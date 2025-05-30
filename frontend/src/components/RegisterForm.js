import React, { useState } from 'react';
import '../styles/RegisterForm.css';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);

  const checkUsername = async () => {
    try {
      const res = await fetch(`/api/auth/check-username?username=${username}`);
      const data = await res.json();
      if (data.available) {
        setIsUsernameAvailable(true);
        setError('사용 가능한 아이디입니다.');
      } else {
        setIsUsernameAvailable(false);
        setError('이미 사용 중인 아이디입니다.');
      }
    } catch (err) {
      setError('중복 검사 실패');
      setIsUsernameAvailable(null);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

      if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || '회원가입 실패');
      } else {
        alert('회원가입 성공!');
        window.location.href = '/login';
      }
    } catch (err) {
      setError('서버 오류');
    }
  };

  return (
    <div className="auth-form">
      <form onSubmit={handleSubmit}>
        <h2>회원가입</h2>

        <div className="form-group">
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={checkUsername}
          />
          <button type="button" onClick={checkUsername}>중복 확인</button>
        </div>

        

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">가입하기</button>

        {isUsernameAvailable === false && <p className="check-msg">이미 사용 중인 아이디입니다.</p>}
        {isUsernameAvailable === true && <p className="check-msg">사용 가능한 아이디입니다.</p>}
      </form>
    </div>
  );
}

export default RegisterForm;
