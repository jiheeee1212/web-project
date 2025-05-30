const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const auth = require('./routes/auth');          
const { isAuthenticated } = require('./middlewares/authMiddleware');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 환경변수에서 MongoDB 주소를 가져오고, 없으면 로컬 기본값 사용
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/myboard';

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors({
  origin: 'http://localhost:3000', // React 앱 주소
  credentials: true, // 쿠키를 허용
}));


app.use(
  session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoUri }),
    cookie: { maxAge: 1000 * 60 * 60 }, // 1시간
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/uploads', express.static('/app/uploads'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

