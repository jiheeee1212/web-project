# 📌 게시판 웹 어플리케이션

간단한 로그인/회원가입 기능과 게시글 CRUD가 가능한 **게시판 웹 애플리케이션**  

**React + Node.js + MongoDB** 기반으로 개발

---

## 🛠️ 개발 환경

- **Frontend**: React  
- **Backend**: Node.js + Express  
- **Database**: MongoDB (Mongoose ODM)  
- **인증 방식**: 세션 기반 인증 (`express-session`)  
- **스타일링**: CSS  
- **컨테이너 관리**: Docker + Docker Compose  

---

## 🚀 실행 방법

```bash
git clone https://github.com/jiheeee1212/web-project.git
cd web-project
docker-compose up --build
```

---

## 접속 주소
http://localhost:3000

---

## 종료
```
docker-compose down 
```

---

## 📁 프로젝트 구조
web-project/  

├── backend/                 # Express 서버 및 API, DB 모델, 미들웨어 등  

│   ├── src/  

│   │   ├── api/  

│   │   │   ├── middlewares/     # 인증 미들웨어 등  

│   │   │   ├── models/          # User, Post 모델 정의  

│   │   │   ├── routes/          # auth, posts API 라우터  

│   │   │   └── server.js        # 백엔드 서버 진입점  

│   └── uploads/                 # 업로드 파일 저장소  

│
├── frontend/              # React 프론트엔드  

│   ├── src/  

│   │   ├── components/        # 재사용 UI 컴포넌트  

│   │   ├── pages/             # 로그인, 메인 등 페이지 컴포넌트  

│   │   └── styles/            # CSS 스타일 파일  

│
├── docker-compose.yml     # 도커 컴포즈 설정 파일  

├── Dockerfile             # 백엔드, 프론트엔드 Dockerfile  

└── README.md              # 프로젝트 설명 파일  




---

## 📌 주요 기능
회원가입 및 로그인 (세션 기반 인증)

게시글 작성, 수정, 삭제, 목록 조회

게시글 상세 조회 

댓글 작성, 수정, 삭제, 목록 조회

파일 업로드, 다운로드

