import React from 'react';
import LoginForm from '../components/LoginForm';
import '../styles/LoginForm.css';

function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-box">
        <h2>로그인</h2>
        <p>계정 정보를 입력해주세요</p>
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
