import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/PostForm.css'; 

function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', author: '' });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`/api/posts/${id}`)
        .then(res => {
          setForm({
            title: res.data.title,
            content: res.data.content,
            author: res.data.author,
          });
        })
        .catch(() => alert('게시글을 불러올 수 없습니다.'));
    }
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('author', form.author);
    if (file) {
      formData.append('file', file);  // ← 여기 수정
    }

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };

    if (id) {
      await axios.put(`/api/posts/${id}`, formData, config);
      alert('게시글 수정 완료');
    } else {
      await axios.post('/api/posts', formData, config);
      alert('게시글 작성 완료');
    }
    navigate('/');
  } catch (err) {
    console.error(err.response || err);
    alert(err.response?.data?.message || '실패했습니다.');
  }
};


  return (
    <div className="post-form-page">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="post-form-container"
      >
        <input
          name="title"
          placeholder="제목"
          value={form.title}
          onChange={handleChange}
          required
          type="text"
        />
        <textarea
          name="content"
          placeholder="내용"
          value={form.content}
          onChange={handleChange}
          required
          rows={8}
        />
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.pdf,.txt,.docx"
        />
        <button type="submit">{id ? '수정' : '작성'}</button>
      </form>
    </div>
  );
}

export default PostForm;
