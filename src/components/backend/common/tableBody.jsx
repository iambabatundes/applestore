import React from "react";
import { Link } from "react-router-dom";

export default function TableBody({
  currentPosts,
  formatPermalink,
  handlePostCheckboxChange,
  hoveredPost,
  onEdit,
  onTrash,
  onPreview,
  handleMouseEnter,
  handleMouseLeave,
  selectedThumbnail,
}) {
  return (
    <tbody>
      {currentPosts.map((post) => (
        <tr
          key={post.title}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <td scope="col" id={`checkBox-${post.title}`}>
            <input
              type="checkbox"
              name={`select-post-${post.title}`}
              checked={post.selected}
              onChange={() => handlePostCheckboxChange(post.title)}
            />
          </td>
          <td
            className="blogPost__title"
            id={`title-${post.title}`}
            scope="col"
          >
            <Link to={`/blog/${formatPermalink(post.title)}`}>
              {post.title || "(notitle)"}
            </Link>
            {hoveredPost === post && (
              <div className="allPost-options">
                <span onClick={() => onEdit(post.id)}>Edit</span>
                <span onClick={() => onTrash(post.id)}>Trash</span>
                <span onClick={() => onPreview(post.id)}>Preview</span>
              </div>
            )}
          </td>
          <td scope="col" id={`author-${post.title}`}>
            {post.postedBy}
          </td>
          <td id={`catergories-${post.title}`} scope="col">
            {post.categories ? post.categories.join(", ") : "-"}
          </td>
          <td id={`tag-${post.title}`} scope="col">
            {post.tags ? post.tags.join(", ") : "-"}
          </td>
          <td id={`comment-${post.title}`} scope="col">
            <span>
              <i className="fa fa-comment" aria-hidden="true"></i>
            </span>
          </td>
          <td id={`date-${post.title}`} scope="col">
            {post && post.datePosted}
          </td>

          <td id={`featuredImage-${post.title}`} scope="col">
            <img src={post.image} alt={post.title} className="featuredImage" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}
