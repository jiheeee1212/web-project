// frontend/src/components/LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function LoginForm() {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', form, { withCredentials: true });
      alert(res.data.message);
      window.location.href = '/posts';
    } catch (err) {
      alert(err.response?.data?.message || '로그인 실패');
    }
  };

  return (
      <form onSubmit={handleSubmit} className="login-form">
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="아이디"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="비밀번호"
          required
        />
        <button type="submit">로그인</button>
         <Link to="/signup">
          <button type="button" className="signup-button">
            회원가입
          </button>
        </Link>
      </form>
    );
  }

export default LoginForm;
