import React, { useState } from "react";
import "../components/styles/comments.css";
import DeleteConfirmation from "./deleteConfirmation";

export default function CommentSection({
  handleEmailChange,
  comments,
  defaultUserIcon,
  handlePostComment,
  comment,
  handleCommentChange,
  handleNameChange,
  name,
  email,
  handleWebsiteChange,
  website,
  handleReply,
  replyToComment,
  handleCancelReply,
  isReplyMode,
  isReplySubmitted,
  handleEditCommentClick,
  handleUpdateComment,
  setEditedComment,
  editedComment,
  editCommentId,
  setComments,
}) {
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [commentToDeleteId, setCommentToDeleteId] = useState(null);

  const handleConfirmDelete = (commentId) => {
    // Find the comment with the specified commentId and delete it
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId
    );

    setIsConfirmationOpen(false);
    setCommentToDeleteId(null);
    setComments(updatedComments);
  };

  const handleDeleteCancel = () => {
    setIsConfirmationOpen(false);
    setCommentToDeleteId(null);
  };

  const renderComment = (comment) => {
    const createdDate = new Date(comment.createdDate);

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    const formattedDate = createdDate.toLocaleDateString("en-US", options);

    const handleEdit = () => {
      setIsUpdateMode(true);
      setEditedComment(comment.comment);
      setSelectedCommentId(comment.id);
    };

    const handleCancelEdit = () => {
      setIsUpdateMode(false);
      setEditedComment("");
      setSelectedCommentId(null);
    };

    const handleUpdate = (event) => {
      event.preventDefault();
      handleUpdateComment(comment.id, editedComment);
      setIsUpdateMode(false);
      setEditedComment("");
      setSelectedCommentId(null);
    };

    const handleDelete = () => {
      setIsConfirmationOpen(true);
      setCommentToDeleteId(comment.id);
    };

    const handleReplyToComment = () => {
      handleReply(comment.id);
    };

    const renderReplies = (replies) => {
      return (
        <div className="comment-replies">
          {replies.map((reply) => (
            <div key={reply.id}>{renderComment(reply)}</div>
          ))}
        </div>
      );
    };

    return (
      <div key={comment.id} className="comment">
        <div className="comment-user-info">
          <img
            src={comment.picture || defaultUserIcon}
            alt="User Icon"
            className="user-icon"
          />
          <div>
            <h3 className="comment-user-name">{comment.name}</h3>
            <p className="comment-created-date">{formattedDate}</p>
          </div>
        </div>

        <button className="reply-button" onClick={handleReplyToComment}>
          Reply
        </button>
        {!isUpdateMode && (
          <button className="reply-button" onClick={handleEdit}>
            Edit
          </button>
        )}
        {!isUpdateMode && (
          <button className="reply-button" onClick={handleDelete}>
            Delete
          </button>
        )}
        {isUpdateMode && selectedCommentId === comment.id ? (
          <div>
            <h2>Edit Comment</h2>
            <form onSubmit={handleUpdate}>
              <textarea
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                placeholder="Comment"
                required
              ></textarea>

              <button type="submit">Update Comment</button>
              <button type="button" onClick={handleCancelEdit}>
                Cancel
              </button>
            </form>
          </div>
        ) : (
          <p className="comment-text">{comment.comment}</p>
        )}

        {replyToComment === comment.id && isReplyMode && (
          <div>
            <h2>Reply to {comment.name}</h2>
            {replyToComment === comment.id && isReplyMode && (
              <button
                className="cancel-reply-button"
                onClick={handleCancelReply}
              >
                Cancel Reply
              </button>
            )}
            <form onSubmit={handlePostComment}>
              <textarea
                value={isReplyMode ? comment.replyComment : comment.comment}
                onChange={handleCommentChange}
                placeholder="Comments"
                required
              ></textarea>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Name"
                required
              />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Email"
                required
              />
              <input
                type="url"
                value={website}
                onChange={handleWebsiteChange}
                placeholder="Website"
              />
              <button type="submit">Post Comment</button>
            </form>
          </div>
        )}

        {comment.replies && renderReplies(comment.replies)}
      </div>
    );
  };

  return (
    <div className="comment-section">
      {comments.map((comment) => renderComment(comment))}

      {(!isReplyMode || replyToComment !== comment.id) &&
        !isReplySubmitted &&
        replyToComment === null &&
        !isUpdateMode && (
          <div>
            <h2>Leave a Comment</h2>
            <form onSubmit={handlePostComment}>
              <textarea
                value={comment}
                onChange={handleCommentChange}
                placeholder="Comments"
                required
              ></textarea>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Name"
                required
              />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Email"
                required
              />
              <input
                type="url"
                value={website}
                onChange={handleWebsiteChange}
                placeholder="Website"
              />
              <button type="submit">Post Comment</button>
            </form>
          </div>
        )}

      <DeleteConfirmation
        isConfirmationOpen={isConfirmationOpen}
        handleConfirmDelete={handleConfirmDelete}
        handleDeleteCancel={handleDeleteCancel}
        commentToDeleteId={commentToDeleteId}
      />
    </div>
  );
}
