import React, { useState, useEffect } from "react";
import "./styles/posts.css";
import Filtered from "./allPosts/filtered";
import TableData from "./common/tableData";
import BulkAction from "./allPosts/bulkAction";
import Header from "./common/header";

export default function AllPosts({ blogPosts, setBlogPosts }) {
  const [sortBy, setSortBy] = useState({ column: "title", order: "asc" });
  const [selectAll, setSelectAll] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(2);
  const [selectedDate, setSelectedDate] = useState("All Dates");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBulkAction, setSelectedBulkAction] = useState("-1");
  const [postTrash, setPostTrash] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [hoveredPost, setHoveredPost] = useState(null);
  const [userInitiatedSort, setUserInitiatedSort] = useState(false);

  useEffect(() => {
    // Update the trash posts whenever the blogPosts change
    const updatedTrashPosts = blogPosts.filter(
      (post) => post && post.status === "trash"
    );
    setPostTrash(updatedTrashPosts);
  }, [blogPosts]);

  const handleEditClick = (postId) => {
    // Assuming you are using React Router
    // history.push(`/admin/edit/${postId}`);
  };

  const handleTrashClick = (postId) => {
    // Handle trash action (e.g., move post to trash)
  };

  const handlePreviewClick = (postId) => {
    // Handle preview action (e.g., open a preview modal)
  };

  const uniqueDates = [
    ...new Set(blogPosts.map((post) => post && post.datePosted)),
  ];
  const uniqueCategories = [
    ...new Set(blogPosts.flatMap((post) => post && post.categories)),
  ];

  const resetIndividualPostCheckboxes = () => {
    // Implement the logic to reset individual post checkboxes
    const updatedBlogPosts = blogPosts.map((post) => ({
      ...post,
      selected: false,
    }));
    setBlogPosts(updatedBlogPosts);
  };

  function formatPermalink(title) {
    return title.toLowerCase().replaceAll(" ", "-");
  }

  const handleMouseEnter = (post) => {
    setHoveredPost(post);
  };

  const handleMouseLeave = () => {
    setHoveredPost(null);
  };

  const handleSort = (column) => {
    const updatedBlogPosts = blogPosts.map((post) => ({
      ...post,
      selected: false,
    }));

    setBlogPosts(updatedBlogPosts);
    setSelectAll(false);
    setSearchQuery("");

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

  const handleSearch = () => {
    const filteredPosts = blogPosts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredPosts);
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
      return (
        post &&
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedDate === "All Dates" || post.datePosted === selectedDate) &&
        (selectedCategory === "All Categories" ||
          (post.categories && post.categories.includes(selectedCategory)))
      );
    });

  // Filter out trashed posts if activeTab is not "trash"
  const filteredPosts =
    activeTab === "trash"
      ? filteredBlogPosts
      : filteredBlogPosts.filter((post) => post && post.status !== "trash");

  const sortedBlogPosts = [...filteredPosts].sort((a, b) => {
    const column = sortBy.column;
    const order = sortBy.order;

    // if (column === "title") {
    //   const titleA = a.title.toLowerCase();
    //   const titleB = b.title.toLowerCase();
    //   return order === "asc"
    //     ? titleA.localeCompare(titleB)
    //     : titleB.localeCompare(titleA);
    // } else

    if (column === "date") {
      const dateA = new Date(a.datePosted).getTime();
      const dateB = new Date(b.datePosted).getTime();
      return order === "asc" ? dateA - dateB : dateB - dateA;
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

    setBlogPosts(updatedBlogPosts);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedBlogPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(sortedBlogPosts.length / postsPerPage);

  // const totalPosts = blogPosts.length;
  // const allPostsCount = filteredPosts.length;
  const totalPosts = blogPosts.filter(
    (post) => post && post.status !== "trash"
  ).length;
  const publishedPosts = blogPosts.filter(
    (post) => post && post.status === "published" && post.status !== "trash"
  ).length;
  const draftPosts = blogPosts.filter(
    (post) => post && post.status === "draft" && post.status !== "trash"
  ).length;
  const trashPosts = blogPosts.filter(
    (post) => post && post.status === "trash"
  ).length;

  const renderPageNumbers = [...Array(totalPages).keys()].map((number) => {
    const pageNumber = number + 1;
    return (
      <button
        key={pageNumber}
        className={currentPage === pageNumber ? "active" : ""}
        onClick={() => setCurrentPage(pageNumber)}
      >
        {pageNumber}
      </button>
    );
  });

  return (
    <section className="allPost">
      <Header headerTitle="Posts" buttonTitle="Add New" to="/admin/create" />

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
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        resetIndividualPostCheckboxes={() => {
          const updatedBlogPosts = blogPosts.map((post) => ({
            ...post,
            selected: false,
          }));
          setBlogPosts(updatedBlogPosts);
        }}
      />

      <BulkAction
        allPost={totalPosts}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        uniqueDates={uniqueDates}
        uniqueCategories={uniqueCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        // handleBulkAction={handleBulkAction}
        selectedBulkAction={selectedBulkAction}
        setSelectedBulkAction={setSelectedBulkAction}
        // handleTrashAction={handleTrashAction}
        resetIndividualPostCheckboxes={resetIndividualPostCheckboxes}
      />

      <section>
        <TableData
          currentPosts={currentPosts}
          formatPermalink={formatPermalink}
          handleSelectAllChange={handleSelectAllChange}
          handleSort={handleSort}
          selectAll={selectAll}
          sortBy={sortBy}
          handlePostCheckboxChange={handlePostCheckboxChange}
          onEdit={handleEditClick}
          onPreview={handlePreviewClick}
          onTrash={handleTrashClick}
          hoveredPost={hoveredPost}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
        />
      </section>
      <div className="pagination">{renderPageNumbers}</div>
    </section>
  );
}
