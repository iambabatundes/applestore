import React from "react";
import InputField from "../../common/inputField";
import InputForm from "../../common/inputForm";
import InputText from "../../common/inputText";
import Button from "../../common/button";
import { TagFormSchema } from "./validation";

export default function TagForm({ onSubmit, isEditMode, initialValues }) {
  return (
    <article>
      <h1>{isEditMode ? "Edit Tag" : "Add New Tag"}</h1>
      <InputForm
        initialValues={initialValues}
        validationSchema={TagFormSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await onSubmit(values);
            resetForm();
            setSubmitting(false);
          } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitting(false);
          }
        }}
      >
        {(values, isSubmitting, setFieldValue) => (
          <>
            <InputText name="name" labelTitle="Name" className="labelTitle" />
            <InputField
              name="name"
              type="text"
              // onChange={setFieldValue}
              placeholder="Tags name here"
              value={values.name || initialValues.name || ""}
              fieldInput
              tooltip
              tooltipTitle="The name is how it appears on your site."
              className="tooltip"
            />
            <InputText name="slug" labelTitle="Slug" className="labelTitle" />
            <InputField
              name="slug"
              type="text"
              fieldInput
              value={values.slug || initialValues.slug || ""}
              // onChange={setFieldValue}
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
              type="text"
              fieldInput
              tooltip
              value={values.description || initialValues.description || ""}
              // onChange={setFieldValue}
              className="tooltip"
              tooltipTitle="The slug is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens."
            />
            <Button type="submit" disabled={isSubmitting} className="addButton">
              {isEditMode ? "Update Tag" : "Add New Tag"}
            </Button>
          </>
        )}
      </InputForm>
    </article>
  );
}
