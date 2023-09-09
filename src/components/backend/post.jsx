import React from "react";
import "./styles/posts.css";
import { Link } from "react-router-dom";

export default function Post() {
  return (
    <section>
      <h1>Posts</h1>

      <Link to="/admin/create">
        <button>Add New</button>
      </Link>
    </section>
  );
}
