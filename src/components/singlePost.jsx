import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getBlogPost } from "./blogPosts";
import "../components/styles/singleBlog.css";

export default function SinglePost() {
  const [blogPost, setBlogPost] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const { title } = useParams();

  const defaultUserIcon = "/path/to/default-user-icon.png";

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

    // Create a new comment object
    const newComment = {
      name,
      email,
      website,
      comment,
      id: Date.now(), // Generate a unique ID for the comment
    };

    // Add the new comment to the comments array
    setComments([newComment, ...comments]);

    // Clear the form fields
    setName("");
    setEmail("");
    setWebsite("");
    setComment("");
  };

  const handleReply = (commentId) => {
    // Implement your reply functionality here
    console.log(`Reply to comment with ID: ${commentId}`);
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
              {comments.length === 0 && <span>No Comment</span>}
              <span>No Comment</span>
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
