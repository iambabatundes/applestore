import React, { useState, useEffect } from "react";
import _ from "lodash";

import Header from "../common/header";
// import "../tags/styles/styles.css";
import "../../backend/styles/cateTagStyle.css";
import InputForm from "../../common/inputForm";
import InputText from "../../common/inputText";
import InputField from "../../common/inputField";
import { ErrorMessage } from "formik";
import Button from "../../common/button";
import TagTable from "../tags/tagTable";
import SearchBox from "../common/searchBox";
import { paginate } from "../../utils/paginate";
import Pagination from "../common/pagination";
import { getCategories } from "../../categoryData";

export default function AddCategories({ className }) {
  const [categories, setCategories] = useState([]);
  const [sortColumn, setSortColumn] = useState({ path: "name", order: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(2);

  useEffect(() => {
    setCategories(getCategories);
  }, [categories]);

  function handleSort(sortColumns) {
    setSortColumn(sortColumns);
  }

  function handleSearch(query) {
    setSearchQuery(query);
    setCurrentPage(1);
  }

  function handleDelete() {}
  function handlePreview() {}
  function handleEdit() {}

  const flattenCategories = (categories, depth = 0) => {
    let flatCategories = [];
    categories.forEach((category) => {
      flatCategories.push({ ...category, depth });
      if (category.subcategories) {
        flatCategories = [
          ...flatCategories,
          ...flattenCategories(category.subcategories, depth + 1),
        ];
      }
    });
    return flatCategories;
  };

  const flattenedCategories = flattenCategories(categories);

  let filtered = categories;
  if (searchQuery)
    filtered = categories.filter((c) =>
      c.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

  const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

  const totalItems = filtered.length;
  const paginationEnabled = totalItems > 1; // Enable pagination if more than one item

  const allCategories = paginationEnabled
    ? paginate(sorted, currentPage, pageSize)
    : sorted;

  return (
    <section className="padding">
      <Header headerTitle="Product Categories" />

      <section className={`${className} tag-header`}>
        <article>
          {/* <ModalHeading title="Add New Tag" /> */}
          <h1>Add New Category</h1>
          <InputForm
            initialValues={{
              name: "",
              slug: "",
              parentCategory: "",
              description: "",
            }}
            // validationSchema={val}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
            }}
          >
            {(values, isSubmitting, setFieldValue) => (
              <>
                <InputText
                  name="name"
                  labelTitle="Name"
                  className="labelTitle"
                />
                <InputField
                  name="name"
                  type="name"
                  placeholder="Tags name hear"
                  fieldInput
                  tooltip
                  tooltipTitle="The name is how it appears on your site."
                  className="tooltip"
                />
                <ErrorMessage name="name" />

                <InputText
                  name="slug"
                  labelTitle="Slug"
                  className="labelTitle"
                />
                <InputField
                  name="slug"
                  type="slug"
                  fieldInput
                  tooltip
                  className="tooltip"
                  tooltipTitle="The slug is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens."
                />

                <InputText
                  name="parentCategory"
                  labelTitle="Parent Category"
                  className="labelTitle"
                />

                <InputField
                  name="category"
                  placeholder="None"
                  setFieldValue={setFieldValue}
                  tooltip
                  select
                  flattenedCategories={flattenedCategories}
                  //   options={categories}
                  className="category-select tooltip"
                  type="select"
                  tooltipTitle="Assign a parent term to create a hierarchy. The term Jazz, for example, would be the parent of Bebop and Big Band."
                />

                <InputText
                  name="description"
                  labelTitle="Description"
                  className="labelTitle"
                />
                <InputField
                  name="description"
                  textarea
                  tooltip
                  className="textareas tooltip"
                  tooltipTitle="The slug is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens."
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="addButton"
                >
                  Add new category
                </Button>
              </>
            )}
          </InputForm>
        </article>

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
            onEdit={handleEdit}
            onPreview={handlePreview}
            currentPosts={allCategories}
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
