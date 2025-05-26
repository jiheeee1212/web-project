import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm() {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', form);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || '회원가입 실패');
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">회원가입</button>
    </form>
  );
}

export default RegisterForm;
