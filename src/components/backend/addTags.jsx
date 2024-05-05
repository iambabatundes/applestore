import React, { useState, useEffect } from "react";
import _ from "lodash";
import { toast } from "react-toastify";

import Header from "./common/header";
// import "./tags/styles/styles.css";
// import "../common/styles/cateTagStyle.css";
import "../backend/styles/cateTagStyle.css";
import InputForm from "../common/inputForm";
import InputText from "../common/inputText";
import InputField from "../common/inputField";
import { ErrorMessage } from "formik";
import Button from "../common/button";
import TagTable from "./tags/TagTable";
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

export default function AddTags({ className }) {
  const [tags, setTags] = useState([]);
  const [sortColumn, setSortColumn] = useState({ path: "name", order: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  useEffect(() => {
    async function getTag() {
      const { data: tags } = await getTags();
      setTags(tags);
    }

    getTag();
  }, []);

  function handleSort(sortColumns) {
    setSortColumn(sortColumns);
  }

  function handleSearch(query) {
    setSearchQuery(query);
    setCurrentPage(1);
  }

  async function handleDelete(tag) {
    const originalTag = tags;
    const tagId = originalTag.filter((t) => t._id !== tag._id);
    setTags(tagId);

    try {
      await deleteTag(tag._id);
    } catch (error) {
      if (error.response && error.response.status === 404)
        toast.info("This tag has already been deleted");

      setTags(originalTag);
    }
  }

  async function handleSubmit(tag) {
    try {
      if (tag._id) {
        // Update existing tag
        await updateTag(tag);
        toast.success("Tag updated successfully");
      } else {
        // Create new tag
        await saveTag(tag);
        toast.success("Tag created successfully");
      }
      const { data: updatedTags } = await getTags();
      setTags(updatedTags);
    } catch (error) {
      toast.error("Failed to save tag");
      console.error("Error saving tag:", error);
    }
  }
  function handlePreview() {}
  // function handleEdit() {}

  let filtered = tags;
  if (searchQuery)
    filtered = tags.filter((t) =>
      t.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

  const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

  const totalItems = filtered.length;
  const paginationEnabled = totalItems > 1; // Enable pagination if more than one item

  const alltags = paginationEnabled
    ? paginate(sorted, currentPage, pageSize)
    : sorted;

  return (
    <section className="padding">
      <Header headerTitle="Product Tags" />

      <section className={`${className} tag-header`}>
        <TagForm onSubmit={handleSubmit} />

        <article>
          <span>
            <SearchBox onChange={handleSearch} value={searchQuery} />
            <span>
              Showing {totalItems} item{totalItems !== 1 ? "s" : ""}{" "}
            </span>
          </span>

          <TagTable
            onSort={handleSort}
            sortColumn={sortColumn}
            onDelete={handleDelete}
            onEdit={handleSubmit}
            onPreview={handlePreview}
            data={alltags}
          />

          <Pagination
            itemsCount={filtered.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </article>
      </section>
    </section>
  );
}
