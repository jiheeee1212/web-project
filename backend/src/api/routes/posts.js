const express = require('express');
const Post = require('../models/Post');
console.log('Post 모델:', Post);
const router = express.Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');



// 업로드 디렉토리 없으면 생성
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    // 원본 확장자 유지
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext; 
    cb(null, filename);
  }
});

const upload = multer({ storage });
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
// router.post('/', async (req, res) => {
//   try {
//     console.log('폼 데이터:', req.body); // 이거 추가
//     const { title, content, author } = req.body;
//     const newPost = new Post({ title, content, author });
//     console.log('폼 데이터2:', req.body); // 이거 추가
//     await newPost.save();
//     res.status(201).json({ message: '게시글 작성 성공', post: newPost });
//   } catch (err) {
//     console.error('게시글 작성 실패:', err); // 이게 있어야 함
//     console.log('Post 모델:', Post);
//     res.status(500).json({ message: '게시글 작성 실패' });
//   }
// });


router.post('/', upload.single('file'), async (req, res) => {
  try {
    console.log('폼 데이터:', req.body);
    const { title, content, author } = req.body;
    const file = req.file ? req.file.filename : null;

    const newPost = new Post({ title, content, author, file });
    await newPost.save();
    res.status(201).json({ message: '게시글 작성 성공', post: newPost });
  } catch (err) {
    console.error('게시글 작성 실패:', err);
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



// 다운로드 라우터
router.get('/:id/download', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || !post.file) {
      return res.status(404).send('파일이 없습니다.');
    }

    console.log('__dirname:', __dirname); // 경로 확인용

    const filePath = path.join(__dirname, '../../../uploads', post.file);
    console.log('다운로드 경로:', filePath);
    console.log('파일 존재?', fs.existsSync(filePath));

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('파일이 존재하지 않습니다.');
    }

    res.download(filePath, post.file, err => {
      if (err) {
        console.error('다운로드 중 오류:', err); // 이 로그 꼭 확인
        res.status(500).send('파일 다운로드 실패');
      }
    });
  } catch (err) {
    console.error('서버 오류:', err);
    res.status(500).send('서버 오류');
  }
});


// 댓글 작성
router.post('/:id/comments', async (req, res) => {
  try {
    const { author, content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send('게시글이 없습니다.');

    post.comments.push({ author, content });
    await post.save();

    res.status(201).json(post.comments);
  } catch (err) {
    res.status(500).send('서버 오류');
  }
});

// 댓글 수정
router.put('/:postId/comments/:commentId', async (req, res) => {
  try {
    const { author, content } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).send('게시글이 없습니다.');

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).send('댓글이 없습니다.');

    comment.author = author;
    comment.content = content;
    await post.save();

    res.json(comment);
  } catch (err) {
    res.status(500).send('서버 오류');
  }
});

// 댓글 삭제
router.delete('/:postId/comments/:commentId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).send('게시글이 없습니다.');

    const commentIndex = post.comments.findIndex(
      c => c._id.toString() === req.params.commentId
    );

    if (commentIndex === -1) return res.status(404).send('댓글이 없습니다.');

    post.comments.splice(commentIndex, 1); // 배열에서 제거
    await post.save();

    res.send('삭제 완료');
  } catch (err) {
    console.error('댓글 삭제 중 에러:', err);
    res.status(500).send('서버 오류');
  }
});



module.exports = router;
