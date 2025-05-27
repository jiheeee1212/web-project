const express = require('express');
const Post = require('../models/Post');
console.log('Post 모델:', Post);
const router = express.Router();

// 게시글 리스트 조회 (검색 가능: ?q=검색어)
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    const filter = q
      ? { $or: [
          { title: { $regex: q, $options: 'i' } },
          { content: { $regex: q, $options: 'i' } }
        ] }
      : {};
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: '게시글 리스트 조회 실패' });
  }
});

// 게시글 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: '게시글 조회 실패' });
  }
});

// 게시글 작성
router.post('/', async (req, res) => {
  try {
    console.log('폼 데이터:', req.body); // 이거 추가
    const { title, content, author } = req.body;
    const newPost = new Post({ title, content, author });
    console.log('폼 데이터2:', req.body); // 이거 추가
    await newPost.save();
    res.status(201).json({ message: '게시글 작성 성공', post: newPost });
  } catch (err) {
    console.error('게시글 작성 실패:', err); // 이게 있어야 함
    console.log('Post 모델:', Post);
    res.status(500).json({ message: '게시글 작성 실패' });
  }
});

// 게시글 수정
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedPost) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    res.json({ message: '게시글 수정 성공', post: updatedPost });
  } catch (err) {
    res.status(500).json({ message: '게시글 수정 실패' });
  }
});

// 게시글 삭제
router.delete('/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    res.json({ message: '게시글 삭제 성공' });
  } catch (err) {
    res.status(500).json({ message: '게시글 삭제 실패' });
  }
});

module.exports = router;
