import React, { useState } from 'react';
import axios from 'axios';

function Comments({ postId, initialComments }) {
  const [comments, setComments] = useState(initialComments || []);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  // 댓글 작성
  const addComment = async () => {
    if (!author || !content) return alert('작성자와 내용을 입력하세요');
    try {
      const res = await axios.post(`/api/posts/${postId}/comments`, { author, content });
      setComments(res.data);
      setAuthor('');
      setContent('');
    } catch {
      alert('댓글 작성 실패');
    }
  };

  // 댓글 수정 저장
  const saveEdit = async (commentId) => {
    if (!editingContent) return alert('내용을 입력하세요');
    try {
      const res = await axios.put(`/api/posts/${postId}/comments/${commentId}`, {
        author, // 필요하면 수정 가능
        content: editingContent,
      });
      setComments(comments.map(c => c._id === commentId ? res.data : c));
      setEditingId(null);
      setEditingContent('');
    } catch {
      alert('댓글 수정 실패');
    }
  };

  // 댓글 삭제
  const deleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/api/posts/${postId}/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch {
      alert('댓글 삭제 실패');
    }
  };

  return (
    <div>
      <h3>댓글</h3>
      <div>
        <input
          placeholder="작성자"
          value={author}
          onChange={e => setAuthor(e.target.value)}
        />
        <textarea
          placeholder="댓글 내용"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button onClick={addComment}>댓글 작성</button>
      </div>

      <ul>
        {comments.map(c => (
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
              <>
                <p>{c.content}</p>
                <button onClick={() => {
                  setEditingId(c._id);
                  setEditingContent(c.content);
                }}>수정</button>
                <button onClick={() => deleteComment(c._id)}>삭제</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Comments;