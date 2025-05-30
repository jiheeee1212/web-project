// src/components/Logout.js
import React from 'react';
import axios from 'axios';

function Logout() {
  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      alert('로그아웃 성공');
      window.location.href = '/login';
    } catch (err) {
      alert('로그아웃 실패');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition"
    >
      로그아웃
    </button>
  );
}

export default Logout;