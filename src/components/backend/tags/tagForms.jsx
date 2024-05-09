import React, { useState, useEffect } from "react";
import Joi from "joi";
import { useParams, useNavigate } from "react-router-dom";
import Input from "./input";
import { getTag, saveTag, updateTag } from "../../../services/tagService";

export default function TagForms() {
  const [data, setData] = useState({
    name: "",
    // slug: "",
    // description: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const tagId = params.id;
        if (tagId) {
          setIsEditMode(true);
          const tag = await getTag(tagId);
          setData(tag);
        }
      } catch (error) {
        console.error("Error fetching tag:", error);
      }
    }
    fetchData();
  }, [params.id]);

  const schema = Joi.object({
    name: Joi.string().min(3).max(255).trim().label("Name").required(),
    slug: Joi.string().label("Slug"),
    description: Joi.string().min(0).max(1000).label("Description"),
  });

  function validate(data) {
    const { error } = schema.validate(data, { abortEarly: false });
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate(data);

    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (isEditMode) {
        await updateTag(data);
      } else {
        await saveTag(data);
      }
      //   navigate("/tags");
    } catch (error) {
      console.error("Error saving tag:", error);
    }
  }

  function handleChange({ target }) {
    const { name, value } = target;
    const updatedData = { ...data, [name]: value };
    setData(updatedData);
    const validationErrors = validateProperty(name, value);
    setErrors({ ...errors, [name]: validationErrors });
  }

  function validateProperty(name, value) {
    const obj = { [name]: value };
    const { error } = schema.validate(obj, { abortEarly: false });
    return error ? error.details[0].message : null;
  }

  return (
    <section>
      <h1>{isEditMode ? "Edit Tag" : "Add New Tag"}</h1>
      <form onSubmit={handleSubmit}>
        <Input
          autoFocus
          name="name"
          label="Name"
          value={data.name}
          onChange={handleChange}
          error={errors.name}
        />
        <Input
          name="slug"
          label="Slug"
          value={data.slug}
          onChange={handleChange}
          error={errors.slug}
        />
        <Input
          name="description"
          label="Description"
          value={data.description}
          onChange={handleChange}
          error={errors.description}
        />
        <button type="submit">
          {isEditMode ? "Update Tag" : "Add New Tag"}
        </button>
      </form>
    </section>
  );
}
