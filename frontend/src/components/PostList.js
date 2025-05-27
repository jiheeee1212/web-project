import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/posts', { params: { q } });
      setPosts(res.data);
    } catch {
      alert('게시글 불러오기 실패');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [q]);

  return (
    <div>
        <h1>게시판</h1>
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
  );
}

export default PostList;
