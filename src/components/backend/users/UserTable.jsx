import React from "react";
import Table from "../common/table";
import { Link } from "react-router-dom";

export default function UserTable({
  userData,
  onDelete,
  onPreview,
  onEdit,
  sortColumn,
  onSort,
}) {
  const columns = [
    { label: "Name", path: "name" },
    {
      label: "Username",
      path: "username",
      sortable: true,
      content: (user) => <Link to={`/users/${user._id}`}>{user.username}</Link>,
    },

    { label: "Email", path: "email" },

    { label: "Phone Number", path: "phoneNumber" },
    { label: "Password", path: "password" },
    { label: "Role", path: "role" },
    // {
    //   label: "Thumbnail",
    //   path: "featureImage",
    //   content: (user) => (
    //     <img
    //       src={`/uploads/${user.featureImage.filename}`}
    //       alt={user.name}
    //       width={20}
    //     />
    //   ),
    // },

    {
      content: (user) => (
        <>
          <i
            className="fa fa-edit"
            aria-hidden="true"
            onClick={() => onEdit(user)}
            style={{ cursor: "pointer" }}
          ></i>
          <i
            className="fa fa-eye"
            aria-hidden="true"
            onClick={() => onPreview(user)}
            style={{ cursor: "pointer" }}
          ></i>
          <i
            className="fa fa-trash"
            aria-hidden="true"
            onClick={() => onDelete(user)}
            style={{ cursor: "pointer" }}
          ></i>
        </>
      ),
    },

    // Add more headings as needed
  ];
  return (
    <Table
      data={userData}
      columns={columns}
      onSort={onSort}
      sortColumn={sortColumn}
    />
  );
}
