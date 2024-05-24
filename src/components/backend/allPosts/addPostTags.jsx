import React, { useState, useEffect } from "react";
import _ from "lodash";
import { toast } from "react-toastify";

import Header from "../common/header";
// import "../backend/styles/cateTagStyle.css";
import SearchBox from "../common/searchBox";
import { paginate } from "../../utils/paginate";
import Pagination from "../common/pagination";
import TagForm from "../tags/tagForm";

import {
  deletePostTag,
  getPostTags,
  savePostTag,
  updatePostTag,
} from "../../../services/postTagsServices";
import PostTagTable from "./common/postTagTable";
import PostTagModal from "./common/postTagModal";

export default function AddPostTags({ className }) {
  const [postTags, setPostTags] = useState([]);
  const [sortColumn, setSortColumn] = useState({ path: "name", order: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editPostTag, setPostEditTag] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTag(null);
  };

  useEffect(() => {
    async function fetchPostTag() {
      try {
        const { data: fetchedPostTags } = await getPostTags();
        setPostTags(fetchedPostTags);
      } catch (error) {
        console.error("Error fetching post tags:", error);
      }
    }

    fetchPostTag();
  }, []);

  function handleEdit(tag) {
    setIsEditMode(true);
    setPostEditTag(tag);
  }

  function handlePostPreview(tag) {
    setSelectedTag(tag);
    setIsModalOpen(true);
  }

  function handleSort(sortColumns) {
    setSortColumn(sortColumns);
  }

  function handleSearch(query) {
    setSearchQuery(query);
    setCurrentPage(1);
  }

  async function handlePostDelete(tag) {
    const originalPostTags = postTags;
    const tagId = originalPostTags.filter((t) => t._id !== tag._id);
    setPostTags(tagId);

    try {
      await deletePostTag(tag._id);

      toast.success("Post Tag deleted successfully");
    } catch (error) {
      if (error.response && error.response.status === 404)
        toast.error("This tag has already been deleted");

      setPostTags(originalPostTags);
    }
  }

  async function handlePostSubmit(tag) {
    try {
      let updatedTags;
      if (isEditMode) {
        // Update existing tag
        const updatedTag = await updatePostTag(editPostTag._id, tag);
        updatedTags = postTags.map((t) =>
          t._id === updatedTag._id ? updatedTag : t
        );
        setPostTags(updatedTags);
        setIsEditMode(false);
        setPostEditTag(null);
        toast.success("Tag updated successfully");
      } else {
        // Create new tag
        const savedTag = await savePostTag(tag);
        setPostTags([savedTag, ...postTags]); // Add the newly created tag to the beginning of the tags array
        toast.success("Post Tag created successfully");
      }
    } catch (error) {
      console.error("Error saving tag:", error);
      toast.error("Failed to save tag");
    }
  }

  let initialValues = {
    name: "",
    // slug: "",
    // description: "",
  };

  if (isEditMode && editPostTag) {
    initialValues = {
      name: editPostTag.name,
      slug: editPostTag.slug,
      description: editPostTag.description,
    };
    console.log(initialValues);
  }

  let filteredTags = postTags;
  if (searchQuery) {
    filteredTags = postTags.filter((t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const sortedTags = _.orderBy(
    filteredTags,
    [sortColumn.path],
    [sortColumn.order]
  );
  const paginatedTags = paginate(sortedTags, currentPage, pageSize);

  return (
    <section className="padding">
      <Header headerTitle="Post Tags" />
      <section className={`${className} tag-header`}>
        <TagForm
          onSubmit={handlePostSubmit}
          isEditMode={isEditMode}
          initialValues={initialValues}
        />

        <article>
          <span>
            <SearchBox onChange={handleSearch} value={searchQuery} />
            <span>
              Showing {filteredTags.length} item
              {filteredTags.length !== 1 ? "s" : ""}
            </span>
          </span>

          <PostTagTable
            onSort={handleSort}
            sortColumn={sortColumn}
            onDelete={handlePostDelete}
            onEdit={handleEdit}
            onPreview={handlePostPreview}
            data={paginatedTags}
          />
          <Pagination
            itemsCount={filteredTags.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </article>

        {isModalOpen && selectedTag && (
          <PostTagModal
            tag={selectedTag}
            posts={selectedTag.posts}
            onClose={closeModal}
          />
        )}
      </section>
    </section>
  );
}
