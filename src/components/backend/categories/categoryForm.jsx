import React from "react";
import InputForm from "../../common/inputForm";
import InputText from "../../common/inputText";
import InputField from "../../common/inputField";
import { ErrorMessage } from "formik";
import Button from "../../common/button";
import { CategoryFormSchema } from "./validate";

export default function CategoryForm({
  isEditMode,
  onSubmit,
  categories,
  flattenedCategories,
}) {
  return (
    <article>
      <h1>{isEditMode ? "Edit Category" : "Add New Category"}</h1>

      <InputForm
        initialValues={{
          name: "",
          //   slug: "",
          //   description: "",
          //   parent: "",
        }}
        validationSchema={CategoryFormSchema}
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
        // onSubmit={(values, { resetForm }) => {
        //   handleSaveOrUpdate(values, { resetForm });
        // }}
      >
        {(values, isSubmitting, setFieldValue) => (
          <>
            <InputText name="name" labelTitle="Name" className="labelTitle" />
            <InputField
              name="name"
              type="name"
              placeholder=""
              fieldInput
              tooltip
              tooltipTitle="The name is how it appears on your site."
              className="tooltip"
            />
            <ErrorMessage name="name" />

            <InputText name="slug" labelTitle="Slug" className="labelTitle" />
            <InputField
              name="slug"
              type="slug"
              fieldInput
              tooltip
              className="tooltip"
              tooltipTitle="The slug is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens."
            />

            <InputField
              name="category"
              placeholder="Parent Category"
              setFieldValue={setFieldValue}
              tooltip
              select
              flattenedCategories={flattenedCategories}
              options={categories}
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

            <Button type="submit" disabled={isSubmitting} className="addButton">
              {isEditMode ? "Update Category" : "Add New Category"}
            </Button>
          </>
        )}
      </InputForm>
    </article>
  );
}
