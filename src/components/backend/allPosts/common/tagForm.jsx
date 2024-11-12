import React from "react";
import useTagForm from "../hook/useTagForm";
import TagField from "../common/tagField";

export default function TagForm({ onAddTag, selectedTag, onEditTag }) {
  const initialValues = { name: "", slug: "", description: "" };
  const onSubmit = (data) => {
    if (selectedTag) {
      onEditTag(selectedTag._id, data);
    } else {
      onAddTag(data);
    }
  };

  const { formData, errors, handleChange, handleSubmit } = useTagForm(
    initialValues,
    onSubmit,
    selectedTag
  );

  return (
    <section className="tag-form-container">
      <h1 className="tagForm__title">
        {selectedTag ? "Edit Tag" : "Add New Tag"}
      </h1>
      <form onSubmit={handleSubmit}>
        <TagField
          autoFocus
          name="name"
          placeholder="Tag Name"
          type="text"
          value={formData.name}
          error={errors.name}
          onChange={handleChange}
          tooltipTitle="The name is how it appears on your site."
        />
        <TagField
          name="slug"
          placeholder="Slug"
          type="text"
          value={formData.slug}
          error={errors.slug}
          onChange={handleChange}
          tooltipTitle="The slug is the URL-friendly version of the name."
        />
        <TagField
          name="description"
          placeholder="Description"
          type="textarea"
          value={formData.description}
          error={errors.description}
          onChange={handleChange}
          tooltipTitle="The slug is the URL-friendly version of the name."
        />
        <button className="tagForm__btn" type="submit">
          {selectedTag ? "Update Tag" : "Add Tag"}
        </button>
      </form>
    </section>
  );
}
