import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBlogPosts } from "./blogPosts";
import "../components/styles/blog.css";

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    setBlogPosts(getBlogPosts);
  }, []);

  function formatPermalink(title) {
    return title.toLowerCase().replaceAll(" ", "-");
  }

  return (
    <div className="blog">
      {blogPosts.map((post, index) => (
        <div className="blog-post" key={index}>
          <div className="blog-post__image">
            <img src={post.image} alt={post.title} />
          </div>
          <div className="blog-post__content">
            <h2 className="blog-post__title">{post.title}</h2>
            <p className="blog-post__date">{post.datePosted}</p>
            {/* <p className="blog-post__author">Posted by {post.postedBy}</p> */}
            <p className="blog-post__text">{post.content}</p>
            <Link
              to={`/${formatPermalink(post.title)}`}
              className="blog-post__read-more"
            >
              Read More
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
