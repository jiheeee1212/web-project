const express = require('express');
const User = require('../models/User');

const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next(); // 로그인 상태면 다음으로 진행
  }
  return res.status(401).json({ message: '로그인이 필요합니다.' });
}

// 아이디 중복 체크
router.get('/check-username', async (req, res) => {
  try {
    const { username } = req.query;
    const exists = await User.findOne({ username });
    res.json({ available: !exists });
  } catch (err) {
    res.status(500).json({ message: '중복 검사 실패' });
  }
});

//회원가입
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log('회원가입 시도:', username, password);  // 요청 데이터 확인용 로그 추가

  try {
    const existing = await User.findOne({ username });
    if (existing) {
      //console.log('이미 존재하는 사용자입니다.');
      return res.status(400).json({ message: '이미 존재하는 사용자입니다.' });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    console.log('회원가입 성공:', username);
    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error('회원가입 에러:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});


// 로그인
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    req.session.userId = user._id;
    res.json({ message: '로그인 성공' });
  } catch (err) {
    res.status(500).json({ message: '서버 오류' });
  }
});

// 로그아웃
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: '로그아웃 성공' });
  });
});

module.exports = router; 
