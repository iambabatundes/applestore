import React from "react";
import "../../backend/styles/dataTable.css";
import { Link } from "react-router-dom";
import Table from "./table";

export default function TableData({
  handleSort,
  currentPosts,
  onDelete,
  onPreview,
  onEdit,
  sortColumn,
  onSort,
}) {
  const columns = [
    {
      label: "Title",
      path: "title",
      sortable: true,
      content: (post) => <Link to={`/blog/${post._id}`}>{post.title}</Link>,
    },
    { label: "Author", path: "postedBy" },
    { label: "Categories", path: "categories" },
    { label: "Tags", path: "tags" },
    { label: "Review", path: "review" },
    { label: "Date", path: "datePosted" },
    {
      label: "Thumbnail",
      path: "image",
      content: (data) => <img src={data.image} alt={data.title} width={50} />,
    },

    {
      content: (post) => (
        <>
          <i
            className="fa fa-edit"
            aria-hidden="true"
            onClick={() => onEdit(post)}
          ></i>
          <i
            className="fa fa-eye"
            aria-hidden="true"
            onClick={() => onPreview(post)}
          ></i>
          <i
            className="fa fa-trash"
            aria-hidden="true"
            onClick={() => onDelete(post)}
          ></i>
        </>
      ),
    },

    // Add more headings as needed
  ];
  return (
    <Table
      columns={columns}
      data={currentPosts}
      handleSort={handleSort}
      onSort={onSort}
      sortColumn={sortColumn}
    />
  );
}
