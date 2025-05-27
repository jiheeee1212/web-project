import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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

  if (!post) return <div>로딩 중...</div>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>작성자: {post.author}</p>
      <p>{post.content}</p>
      <button onClick={() => navigate(`/posts/${id}/edit`)}>수정</button>
      <button onClick={handleDelete}>삭제</button>
    </div>
  );
}

export default PostDetail;
