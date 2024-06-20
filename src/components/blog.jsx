import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import "../components/styles/blog.css";
// import { getBlogPosts } from "./blogPosts";
import { getPosts } from "../services/postService";

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    // Fetch blog posts from the fake backend

    async function fetchPosts() {
      const { data: blogPosts } = await getPosts();
      const sortedPosts = _.orderBy(blogPosts, ["createdAt"], ["desc"]);
      setBlogPosts(sortedPosts);
    }

    fetchPosts();
  }, []);

  function formatPermalink(title) {
    return title.toLowerCase().replaceAll(" ", "-");
  }

  return (
    <section className="blog__main">
      <article>
        <h1>Our Blog</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia,
          pariatur?
        </p>
      </article>
      <div className="blog">
        {blogPosts.map((post, index) => (
          <div className="blog-post" key={index}>
            <div className="blog-post__image">
              <img src={post.postMainImage.filename} alt={post.title} />
            </div>
            <div className="blog-post__content">
              <h2 className="blog-post__title">{post.title}</h2>
              <p className="blog-post__date">{post.createdAt}</p>
              {/* <p className="blog-post__author">Posted by {post.postedBy}</p> */}
              <p className="blog-post__text">{post.content}</p>
              <Link
                to={`/blog/${formatPermalink(post.title)}`}
                className="blog-post__read-more"
              >
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
