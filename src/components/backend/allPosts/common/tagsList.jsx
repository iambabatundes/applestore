import React from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import "../styles/taglist.css";

export default function TagsList({
  tags,
  error,
  onEdit,
  loading,
  onDelete,
  onPreview,
}) {
  if (loading) {
    return <span className="tagList__loading">Loading Tags list...</span>;
  }

  if (error) {
    return <span className="tagList__error">Error loading Tags list</span>;
  }

  return (
    <section className="tagList__container">
      {tags.length > 0 ? (
        <div className="tagList__grid">
          {tags.map((tag) => (
            <div className="tagList__card" key={tag._id}>
              <div className="tagList__details">
                <h3 className="tagList__title">{tag.name}</h3>
                <p className="tagList__info">
                  <strong>Slug:</strong> {tag.slug}
                </p>
                <p className="tagList__info">
                  <strong>Description:</strong> {tag.description}
                </p>
                <p className="tagList__info">
                  <strong>Products:</strong> {tag.postCount}
                </p>
              </div>
              <div
                className="tagList__delete-icon"
                onClick={() => onDelete(tag._id)}
                aria-label="Delete Tag"
              >
                <FaTrash />
              </div>

              <div className="tagList__actions">
                <button
                  className="tagList__action-btn tagList__edit"
                  onClick={() => onEdit(tag)}
                  aria-label="Edit Tag"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="tagList__action-btn tagList__preview"
                  onClick={() => onPreview(tag)}
                  aria-label="Preview Tag"
                >
                  <FaEye /> Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="tagList__empty">No tags available</p>
      )}
    </section>
  );
}
