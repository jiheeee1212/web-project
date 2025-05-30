import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/PostList.css';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState('');

  const handleLogout = async () => {
    try {
      // 서버에 로그아웃 요청 (세션 삭제용)
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', // 세션 쿠키 전송
      });

      alert('로그아웃 성공');
      window.location.href = '/login'; // 알림 후 리다이렉트
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };



  useEffect(() => {
  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/posts', { params: { q } });
      setPosts(res.data);
    } catch {
      alert('게시글 불러오기 실패');
    }
  };
  fetchPosts();
}, [q]);

  useEffect(() => {
  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/posts', { params: { q } });
      setPosts(res.data);
    } catch {
      alert('게시글 불러오기 실패');
    }
  };
  fetchPosts();
}, [q]);




  return (
  <div className="post-list-page">
    <div className="post-list-container">

      <div style={{ position: 'relative', marginBottom: '24px' }}>
          <h1 style={{ textAlign: 'center', margin: 0 }}>게시판</h1>
          <button 
            onClick={handleLogout} 
            style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
          >
            로그아웃
          </button>
        </div>
      <Link to="/posts/new">
        <button>글 작성하기</button>
      </Link>

      <input
        placeholder="검색어 입력"
        value={q}
        onChange={e => setQ(e.target.value)}
      />
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <a href={`/posts/${post._id}`}>{post.title}</a>
            <span> - 작성자: {post.author}</span>
            <span> ({new Date(post.createdAt).toLocaleDateString()})</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
}

export default PostList;
