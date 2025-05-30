import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Comments from '../components/Comments';
import { Link } from 'react-router-dom';
import '../styles/PostDetail.css';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`/api/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(() => alert('게시글을 불러올 수 없습니다.'));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/api/posts/${id}`);
      alert('삭제되었습니다.');
      navigate('/');
    } catch {
      alert('삭제 실패');
    }
  };


  const handleDownload = async () => {
    try {
      const response = await axios.get(`/api/posts/${post._id}/download`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = post.file;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('파일 다운로드 실패');
      console.error('다운로드 에러 응답:', error.response?.data || error.message);
    }
  };


  if (!post) return <div>로딩 중...</div>;

  return (
    <div className="post-detail-page">
      <div className="post-detail-container">
        <h2>{post.title}</h2>
        <p>작성자: {post.author}</p>
        <p>{post.content}</p>

        {post.file && (
          <button onClick={handleDownload}>파일 다운로드</button>
        )}

        <button onClick={() => navigate(`/posts/${id}/edit`)}>수정</button>
        <button onClick={handleDelete}>삭제</button>

        <Comments postId={post._id} initialComments={post.comments} />

         <Link to="/posts">
        <button>목록</button>
      </Link>
      </div>
    </div>
  );
}

export default PostDetail;
