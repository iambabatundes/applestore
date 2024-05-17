import React, { useState, useEffect } from "react";
import _ from "lodash";
import { toast } from "react-toastify";

import Header from "./common/header";
import "../backend/styles/cateTagStyle.css";
import SearchBox from "./common/searchBox";
import { paginate } from "../utils/paginate";
import Pagination from "./common/pagination";
import {
  deleteTag,
  getTags,
  saveTag,
  updateTag,
} from "../../services/tagService";
import TagForm from "./tags/tagForm";
import TagTable from "./tags/TagTable";
import TagModal from "./tags/tagModal";

export default function AddTags({ className }) {
  const [tags, setTags] = useState([]);
  const [sortColumn, setSortColumn] = useState({ path: "name", order: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTag, setEditTag] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTag(null);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: fetchedTags } = await getTags();
        setTags(fetchedTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }

    fetchData();
  }, [tags]);

  function handleEdit(tag) {
    setIsEditMode(true);
    setEditTag(tag);
  }

  function handlePreview(tag) {
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

  async function handleDelete(tag) {
    const originalTags = tags;
    const tagId = originalTags.filter((t) => t._id !== tag._id);
    setTags(tagId);

    try {
      await deleteTag(tag._id);

      toast.success("Tag deleted successfully");
    } catch (error) {
      if (error.response && error.response.status === 404)
        toast.error("This tag has already been deleted");

      setTags(originalTags);
    }
  }

  async function handleSubmit(tag) {
    try {
      let updatedTags;
      if (isEditMode) {
        // Update existing tag
        const updatedTag = await updateTag(editTag._id, tag);
        updatedTags = tags.map((t) =>
          t._id === updatedTag._id ? updatedTag : t
        );
        setTags(updatedTags);
        setIsEditMode(false);
        setEditTag(null);
        toast.success("Tag updated successfully");
      } else {
        // Create new tag
        const savedTag = await saveTag(tag);
        setTags([savedTag, ...tags]); // Add the newly created tag to the beginning of the tags array
        toast.success("Tag created successfully");
      }
    } catch (error) {
      console.error("Error saving tag:", error);
      toast.error("Failed to save tag");
    }
  }

  let initialValues = {
    name: "",
    slug: "",
    description: "",
  };

  if (isEditMode && editTag) {
    initialValues = {
      name: editTag.name,
      slug: editTag.slug,
      description: editTag.description,
    };
    console.log(initialValues);
  }

  let filteredTags = tags;
  if (searchQuery) {
    filteredTags = tags.filter((t) =>
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
      <Header headerTitle="Product Tags" />
      <section className={`${className} tag-header`}>
        <TagForm
          onSubmit={handleSubmit}
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
          <TagTable
            onSort={handleSort}
            sortColumn={sortColumn}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onPreview={handlePreview}
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
          <TagModal
            tag={selectedTag}
            products={selectedTag.products}
            onClose={closeModal}
          />
        )}
      </section>
    </section>
  );
}
