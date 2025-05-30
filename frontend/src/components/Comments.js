import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Comments.css';

function Comments({ postId, initialComments }) {
  const [comments, setComments] = useState(initialComments || []);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    axios.get('/api/auth/me', { withCredentials: true })
      .then(res =>{ 
    console.log('현재 로그인 유저 ID:', res.data.userId);
    setCurrentUserId(res.data.userId); })
      .catch(() => setCurrentUserId(null));
  }, []);

  const addComment = async () => {
    if (!content) return alert('내용을 입력하세요');
    try {
      const res = await axios.post(`/api/posts/${postId}/comments`, { content }, { withCredentials: true });
      setComments(res.data);
      setContent('');
    } catch {
      alert('댓글 작성 실패');
    }
  };

  const saveEdit = async (commentId) => {
    if (!editingContent) return alert('내용을 입력하세요');
    try {
      const res = await axios.put(
        `/api/posts/${postId}/comments/${commentId}`,
        { content: editingContent },
        { withCredentials: true }
      );
      setComments(comments.map(c => c._id === commentId ? res.data : c));
      setEditingId(null);
      setEditingContent('');
      alert('댓글이 수정정되었습니다.');
      } catch {
      alert('댓글 수정 권한이 없습니다.');
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/api/posts/${postId}/comments/${commentId}`, { withCredentials: true });
      setComments(comments.filter(c => c._id !== commentId));
      alert('댓글이 삭제되었습니다.');
    } catch {
      alert('댓글 삭제 권한이 없습니다.');
    }
  };

  console.log('현재 comments:', comments);

 return (
  <div>
    <h3>댓글</h3>
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        marginBottom: '16px',
      }}
    >
      <textarea
        placeholder="댓글 내용"
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={3}
        style={{ flex: 1 }}
      />
      <button onClick={addComment}>댓글 작성</button>
    </div>

    <ul>
      {comments.map(c => {
        console.log('댓글 authorId:', c.authorId);
        console.log('현재 로그인 userId:', currentUserId);

        return (
          <li key={c._id}>
            <strong>{c.author}</strong> ({new Date(c.createdAt).toLocaleString()})
            {editingId === c._id ? (
              <>
                <textarea
                  value={editingContent}
                  onChange={e => setEditingContent(e.target.value)}
                />
                <button onClick={() => saveEdit(c._id)}>저장</button>
                <button onClick={() => setEditingId(null)}>취소</button>
              </>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '4px',
                }}
              >
                <p style={{ margin: 0, flex: 1 }}>{c.content}</p>
                
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setEditingId(c._id);
                        setEditingContent(c.content);
                      }}
                    >
                      수정
                    </button>
                    <button onClick={() => deleteComment(c._id)}>삭제</button>
                  </div>
                
              </div>
            )}
          </li>
        );
      })}
    </ul>
  </div>
);

}

export default Comments;
