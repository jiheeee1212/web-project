import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', author: '' });

  useEffect(() => {
    if (id) {
      axios.get(`/api/posts/${id}`)
        .then(res => setForm(res.data))
        .catch(() => alert('게시글을 불러올 수 없습니다.'));
    }
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
  e.preventDefault();
  try {
    if (id) {
      await axios.put(`/api/posts/${id}`, form);
      alert('게시글 수정 완료');
    } else {
      await axios.post('/api/posts', form);
      alert('게시글 작성 완료');
    }
    navigate('/');
  } catch (err) {
    console.error(err.response || err);  // 에러 내용을 콘솔에 출력
    alert(err.response?.data?.message || '실패했습니다.');
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <input
        name="author"
        placeholder="작성자"
        value={form.author}
        onChange={handleChange}
        required
      />
      <input
        name="title"
        placeholder="제목"
        value={form.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="content"
        placeholder="내용"
        value={form.content}
        onChange={handleChange}
        required
      />
      <button type="submit">{id ? '수정' : '작성'}</button>
    </form>
  );
}

export default PostForm;
