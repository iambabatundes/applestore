import React from "react";
import InputField from "../../common/inputField";
import InputForm from "../../common/inputForm";
import InputText from "../../common/inputText";
import Button from "../../common/button";
import { TagFormSchema } from "./validation";

export default function TagForm({ onSubmit }) {
  return (
    <article>
      {/* <ModalHeading title="Add New Tag" /> */}
      <h1>Add New Tag</h1>
      <InputForm
        initialValues={{
          name: "",
          slug: "",
          description: "",
        }}
        validationSchema={TagFormSchema}
        onSubmit={onSubmit}
      >
        {(values, isSubmitting, setFieldValue) => (
          <>
            <InputText name="name" labelTitle="Name" className="labelTitle" />
            <InputField
              name="name"
              type="text"
              placeholder="Tags name hear"
              fieldInput
              tooltip
              tooltipTitle="The name is how it appears on your site."
              className="tooltip"
            />
            {/* <ErrorMessage name="name" /> */}

            <InputText name="slug" labelTitle="Slug" className="labelTitle" />
            <InputField
              name="slug"
              type="text"
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
              //   textarea
              fieldInput
              type="text"
              tooltip
              className="textareas tooltip"
              tooltipTitle="The slug is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens."
            />

            <Button type="submit" disabled={isSubmitting} className="addButton">
              Add new tag
            </Button>
          </>
        )}
      </InputForm>
    </article>
  );
}
