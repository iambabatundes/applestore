import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "../styles/categoryModel.css";
import { getPostByCategory } from "../../../../services/postService";

export default function CategoryModel({ category, onClose }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (category) fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const { data: fetchedPosts } = await getPostByCategory(category._id);
      setPosts(fetchedPosts);
    } catch (error) {
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Focus trapping
  useEffect(() => {
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const trapFocus = (event) => {
      if (event.key === "Tab") {
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", trapFocus);
    return () => document.removeEventListener("keydown", trapFocus);
  }, []);

  return (
    <div className="categoryModel__overlay">
      <section className="categoryModel__container" ref={modalRef}>
        <header className="categoryModel__header">
          <button
            className="categoryModel__close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
          <h2 className="categoryModel__title">{category.name} Details</h2>
        </header>

        <div className="categoryModel__details">
          <p>
            <strong>Name:</strong> {category.name}
          </p>
          <p>
            <strong>Slug:</strong> {category.slug}
          </p>
          <p>
            <strong>Description:</strong> {category.description}
          </p>
          <p>
            <strong>Post Count:</strong> {category.postCount}
          </p>
        </div>

        <div className="categoryModel__products">
          <h3>Associated Posts</h3>
          {loading ? (
            <p className="categoryModel__loading">Loading posts...</p>
          ) : error ? (
            <div className="categoryModel__error">
              <p>{error}</p>
              <button onClick={() => fetchPosts()}>Retry</button>
            </div>
          ) : posts.length > 0 ? (
            <ul>
              {posts.map((post) => (
                <li key={post._id} onClick={() => alert(post.name)}>
                  {post.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No posts found for this category.</p>
          )}
        </div>
      </section>
    </div>
  );
}

CategoryModel.propTypes = {
  category: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    description: PropTypes.string,
    postCount: PropTypes.number,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
