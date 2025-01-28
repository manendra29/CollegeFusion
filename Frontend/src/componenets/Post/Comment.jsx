import React, { useState, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';
import axios from 'axios';
import './Comment.css';

const Comment = ({post, postId, isOpen, comments,fetchUser,setComments, currUser }) => {
  const [newComment, setNewComment] = useState('');
  const [commentUsers, setCommentUsers] = useState({});
  const [handleComment,setHandleComment]=useState(false);

  useEffect(() => {
    const fetchCommentUsers = async () => {
      const users = {};
      console.log(comments);
      console.log(post.comment.length);
      for (const comment of comments) {
        try {
          const response = await axios.get(`http://localhost:5000/api/v1/user/getuser/${comment.userId}`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          });
          users[comment.userId] = response.data.user;
        } catch (error) {
          console.error('Error fetching comment user:', error);
        }
      }
      setCommentUsers(users);
    };

    if (isOpen) {
      fetchCommentUsers();
    }
  }, [comments, isOpen,handleComment]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/post/comment/${postId}`,
        { comment: newComment },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setHandleComment(!handleComment);
      console.log(response.data);
      setComments(post.comment);
      setNewComment('');
      fetchUser();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/post/deletecomment/${postId}/${commentId}`,
        { commentId },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setHandleComment(!handleComment);
      console.log("comment deleted")
      setComments(response.data.post.comment);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="comments-section">
      <h3 className="comments-title">Comments ({comments.length})</h3>
      
      <form onSubmit={handleSubmitComment} className="comment-form">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="comment-input"
        />
        <button type="submit" className="send-button">
          <Send size={20} />
        </button>
      </form>

      <div className="comments-list">
        {comments.map((comment) => {
          const user = commentUsers[comment.userId];
          return (
            <div key={comment._id} className="comment">
              <div className="comment-user">
                <img
                  src={user?.profilePicture?.url  ?? "/images/noPP.jpg"}
                  alt="profile"
                  className="comment-avatar"
                />
                <div className="comment-content">
                  <span className="comment-username">{user?.username}</span>
                  <p className="comment-text">{comment.value}</p>
                </div>
              </div>
              {currUser._id === comment.userId && (
                <button
                  className="delete-button"
                  onClick={() => handleDeleteComment(comment._id)}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Comment;