import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getBlogPost } from "./blogPosts";
import "../components/styles/singleBlog.css";
import CommentSection from "./commentSection";

export default function SinglePost() {
  const [blogPost, setBlogPost] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isReplyMode, setIsReplyMode] = useState(false);
  const [replyToComment, setReplyToComment] = useState(null);
  const [isReplySubmitted, setIsReplySubmitted] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const { title } = useParams();

  const defaultUserIcon = "/user.png";

  // const handleEdit = () => {
  //   setEditCommentId(comment.id);
  // };

  const handleDelete = (commentId) => {
    // Find the comment with the specified commentId and delete it
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId
    );

    // Update the comments state with the updated comments
    setComments(updatedComments);
  };

  // const handleEditCommentClick = (comment) => {
  //   setEditCommentId(comment.id);
  //   setEditedComment(comment.comment);
  //   setIsUpdateMode(true);
  //   setIsReplyMode(false);
  //   setEditedComment(comment.comment);
  //   setSelectedCommentId(comment.id);
  // };

  const handleCancelEdit = () => {
    setIsUpdateMode(false);
    setEditedComment("");
    setSelectedCommentId(null);
  };

  // const handleReply = (commentId) => {
  //   if (isUpdateMode) {
  //     setIsUpdateMode(false);
  //     setEditedComment("");
  //     setSelectedCommentId(null);
  //   }
  //   // Your existing logic for handling the reply action
  // };

  const handleEdit = () => {
    if (isReplyMode) {
      handleCancelReply();
    }
    setIsUpdateMode(true);
    setEditedComment(comment.comment);
    setSelectedCommentId(comment.id);
  };

  // const handleEdit = () => {
  //   setIsUpdateMode(true);
  //   setEditedComment(comment.comment);
  //   setSelectedCommentId(comment.id);
  // };

  const handleUpdateComment = (commentId) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, comment: editedComment };
      }
      return comment;
    });

    setComments(updatedComments);
    setEditCommentId(null);
    setEditedComment("");
  };

  const handleCancelReply = () => {
    setIsReplyMode(false);
    setReplyToComment(null);
  };

  const handleReply = (commentId) => {
    setIsReplyMode(true);
    setReplyToComment(commentId);
    setIsUpdateMode(false);
    setSelectedCommentId(null);
    // setIsReplySubmitted(false);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleWebsiteChange = (e) => {
    setWebsite(e.target.value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handlePostComment = (e) => {
    e.preventDefault();

    if (replyToComment) {
      const parentComment = comments.find((c) => c.id === replyToComment);
      const newComment = {
        name,
        email,
        website,
        comment,
        id: comments.length + 1,
        createdDate: new Date().toISOString(),
        replyTo: parentComment.id,
      };

      // Add the new reply comment to the comments array
      setComments([newComment, ...comments]);
    } else {
      // Create a new comment object
      const newComment = {
        name,
        email,
        website,
        comment,
        id: comments.length + 1,
        createdDate: new Date().toISOString(),
      };

      // Add the new comment to the comments array
      setComments([newComment, ...comments]);
    }

    // Clear the form fields
    setName("");
    setEmail("");
    setWebsite("");
    setComment("");
    setReplyToComment(null);
    setIsReplySubmitted(false);
  };

  useEffect(() => {
    setBlogPost(getBlogPost(title));
  }, []);

  if (!blogPost) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <header
        className="singlePost__main"
        style={{ backgroundImage: `url(${blogPost.image})` }}
      >
        <div className="singlePost__container">
          <h2 className="single-blog-post__title">{blogPost.title}</h2>
          <div className="singlePost__tags">
            <span>
              <i className="fa fa-clock-o" aria-hidden="true"></i>
              <span className="single-blog-post__date">
                {blogPost.datePosted}
              </span>
            </span>
            <div>
              <i class="fa fa-user" aria-hidden="true"></i>
              <span className="single-blog-post__author">
                {blogPost.postedBy}
              </span>
            </div>

            <div>
              <i class="fa fa-comment-o" aria-hidden="true"></i>
              {comments.length === 0 ? (
                <span>No Comment</span>
              ) : (
                <span>{comments.length} Comment(s)</span>
              )}
            </div>
          </div>
        </div>
      </header>
      <section className="singlePost">
        <section className="singlePost__left">
          <img
            className="single-blog-post__image"
            src={blogPost.image}
            alt={blogPost.title}
          />
          <p className="single-blog-post__content">{blogPost.content}</p>

          <CommentSection
            handleCommentChange={handleCommentChange}
            handleNameChange={handleNameChange}
            handleEmailChange={handleEmailChange}
            handleWebsiteChange={handleWebsiteChange}
            handlePostComment={handlePostComment}
            handleReply={handleReply}
            comments={comments}
            email={email}
            name={name}
            website={website}
            comment={comment}
            defaultUserIcon={defaultUserIcon}
            replyToComment={replyToComment}
            isReplyMode={isReplyMode}
            handleCancelReply={handleCancelReply}
            isReplySubmitted={isReplySubmitted}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            handleUpdateComment={handleUpdateComment}
            setEditCommentId={setEditCommentId}
            editCommentId={editCommentId}
            // handleEditCommentClick={handleEditCommentClick}
            editedComment={editedComment}
            setEditedComment={setEditedComment}
            setIsReplyMode={setIsReplyMode}
            setSelectedCommentId={setSelectedCommentId}
            setIsUpdateMode={setIsUpdateMode}
            handleCancelEdit={handleCancelEdit}
            selectedCommentId={selectedCommentId}
          />
        </section>

        {/* Recent Article Section */}
        <section className="singlePost__right">
          <h1>Recent Article</h1>

          <div>
            <div className="singlePost__recent">
              <img
                className="singleBlog-recent__image"
                src={blogPost.image}
                alt={blogPost.title}
              />

              <div className="singlePost__recent-main">
                <Link>
                  <h2 className="singleBlog__recent-post__title">
                    {blogPost.title}
                  </h2>
                </Link>
                <div className="singlePost__recent-tag">
                  <section>
                    <i className="fa fa-clock-o" aria-hidden="true"></i>
                    <span className="single-blog-post__date">
                      {blogPost.datePosted}
                    </span>
                  </section>

                  <section className="singlePost__recent-icon">
                    <i class="fa fa-user" aria-hidden="true"></i>
                    <span className="singlePost__recent-post__author">
                      {blogPost.postedBy}
                    </span>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
}
