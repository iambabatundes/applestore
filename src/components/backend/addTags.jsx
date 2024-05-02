import React, { useState, useEffect } from "react";
import Header from "./common/header";
import "./tags/styles/styles.css";
import InputForm from "../common/inputForm";
import InputText from "../common/inputText";
import InputField from "../common/inputField";
import { ErrorMessage } from "formik";
import Button from "../common/button";
import TagTable from "./tags/tagTable";
import { getTag, getTags } from "../tags";

export default function AddTags({ className }) {
  const [tags, setTags] = useState([]);
  const [sortColumn, setSortColumn] = useState({ path: "name", order: "asc" });

  useEffect(() => {
    setTags(getTags);
  }, [tags]);

  function handleSort(sortColumns) {
    setSortColumn(sortColumns);
  }
  function handleDelete() {}
  function handlePreview() {}
  function handleEdit() {}
  return (
    <section className="padding">
      <Header headerTitle="Product Tags" />

      <section className={`${className} tag-header`}>
        <article>
          {/* <ModalHeading title="Add New Tag" /> */}
          <h1>Add New Tag</h1>
          <InputForm
            initialValues={{
              name: "",
              slug: "",
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
                  Add new tag
                </Button>
              </>
            )}
          </InputForm>
        </article>
        <article>
          <TagTable
            onSort={handleSort}
            sortColumn={sortColumn}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onPreview={handlePreview}
            currentPosts={tags}
          />
        </article>
      </section>
    </section>
  );
}
