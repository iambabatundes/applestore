import React, { useState, useEffect } from "react";
import "./styles/posts.css";
import { Link } from "react-router-dom";
import { getBlogPosts } from "../blogPosts";
import Filtered from "./allPosts/filtered";

export default function AllPosts() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [sortBy, setSortBy] = useState({ column: "title", order: "asc" });
  const [selectAll, setSelectAll] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query

  useEffect(() => {
    const fetchedPosts = getBlogPosts();
    const postsWithSelection = fetchedPosts.map((post) => ({
      ...post,
      selected: false,
    }));
    setBlogPosts(postsWithSelection);
  }, []);

  function formatPermalink(title) {
    return title.toLowerCase().replaceAll(" ", "-");
  }

  const handleSort = (column) => {
    const updatedBlogPosts = blogPosts.map((post) => ({
      ...post,
      selected: false,
    }));

    setBlogPosts(updatedBlogPosts);
    setSelectAll(false);
    setSearchQuery(""); // Clear the search query when sorting

    setSortBy((prevSortBy) => {
      if (prevSortBy.column === column) {
        return {
          column,
          order: prevSortBy.order === "asc" ? "desc" : "asc",
        };
      } else {
        return {
          column,
          order: "asc",
        };
      }
    });
  };

  const filteredBlogPosts = blogPosts
    .filter((post) => {
      if (activeTab === "all") {
        return true;
      } else if (activeTab === "published") {
        return post.status === "published";
      } else if (activeTab === "draft") {
        return post.status === "draft";
      } else if (activeTab === "trash") {
        return post.status === "trash";
      }
      return true;
    })
    .filter((post) => {
      // Filter posts based on search query
      return post.title.toLowerCase().startsWith(searchQuery.toLowerCase());
    });

  const sortedBlogPosts = [...filteredBlogPosts].sort((a, b) => {
    const column = sortBy.column;
    const order = sortBy.order;

    if (column === "title") {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (order === "asc") {
        return titleA.localeCompare(titleB);
      } else {
        return titleB.localeCompare(titleA);
      }
    } else if (column === "date") {
      const dateA = new Date(a.datePosted).getTime();
      const dateB = new Date(b.datePosted).getTime();
      if (order === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    }

    return 0;
  });

  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;

    const updatedBlogPosts = blogPosts.map((post) => ({
      ...post,
      selected:
        newSelectAll ||
        (selectedStatus !== "all" && post.status === selectedStatus) ||
        (newSelectAll && post.status === activeTab),
    }));

    setBlogPosts(updatedBlogPosts);
    setSelectAll(newSelectAll);
  };

  const handlePostCheckboxChange = (postTitle) => {
    const updatedBlogPosts = [...blogPosts];
    const postIndex = updatedBlogPosts.findIndex(
      (post) => post.title === postTitle
    );
    updatedBlogPosts[postIndex].selected =
      !updatedBlogPosts[postIndex].selected;

    const allSelected = updatedBlogPosts.every((post) => post.selected);
    setSelectAll(allSelected);

    setBlogPosts(updatedBlogPosts);
  };

  const totalPosts = blogPosts.length;
  const publishedPosts = blogPosts.filter(
    (post) => post.status === "published"
  ).length;
  const draftPosts = blogPosts.filter((post) => post.status === "draft").length;
  const trashPosts = blogPosts.filter((post) => post.status === "trash").length;

  return (
    <section className="allPost">
      <div className="allPost-main">
        <h1 className="allPost-title">Posts</h1>
        <Link to="/admin/create">
          <button className="allPost-btn">Add New</button>
        </Link>
      </div>

      <Filtered
        allPost={totalPosts}
        published={publishedPosts}
        draft={draftPosts}
        trash={trashPosts}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        setSelectAll={setSelectAll}
        setSearchQuery={setSearchQuery} // Pass setSearchQuery to Filtered component
        searchQuery={searchQuery} // Pass searchQuery as a prop
        resetIndividualPostCheckboxes={() => {
          const updatedBlogPosts = blogPosts.map((post) => ({
            ...post,
            selected: false,
          }));
          setBlogPosts(updatedBlogPosts);
        }}
      />

      <section>
        <table className="allPost-table post-list">
          <thead>
            <tr>
              <td scope="col" id="checkBox">
                <input
                  type="checkbox"
                  name="select-all"
                  id="selectAll"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
              </td>
              <td
                id="title"
                scope="col"
                onClick={() => handleSort("title")}
                style={{ cursor: "pointer" }}
              >
                Title{" "}
                {sortBy.column === "title" && (
                  <i
                    className={`fa fa-sort-${sortBy.order}`}
                    aria-hidden="true"
                  ></i>
                )}
              </td>
              <td scope="col" id="author">
                Author
              </td>
              <td id="catergories" scope="col">
                Categories
              </td>
              <td id="tag" scope="col">
                Tag
              </td>
              <td id="comment" scope="col">
                <span>
                  <i className="fa fa-comment" aria-hidden="true"></i>
                </span>
              </td>
              <td
                id="date"
                scope="col"
                onClick={() => handleSort("date")}
                style={{ cursor: "pointer" }}
              >
                Date{" "}
                {sortBy.column === "date" && (
                  <i
                    className={`fa fa-sort-${sortBy.order}`}
                    aria-hidden="true"
                  ></i>
                )}
              </td>
              <td id="featuredImage" scope="col">
                thumbnail
              </td>
            </tr>
          </thead>
          <tbody>
            {sortedBlogPosts.map((post) => (
              <tr key={post.title}>
                <td scope="col" id={`checkBox-${post.title}`}>
                  <input
                    type="checkbox"
                    name={`select-post-${post.title}`}
                    checked={post.selected}
                    onChange={() => handlePostCheckboxChange(post.title)}
                  />
                </td>
                <td id={`title-${post.title}`} scope="col">
                  <Link to={`/post/${formatPermalink(post.title)}`}>
                    {post.title}
                  </Link>
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
                  {post.datePosted}
                </td>
                <td id={`featuredImage-${post.title}`} scope="col">
                  <img src={post.image} alt="" className="featuredImage" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}
