import { useState, useEffect } from "react";
import {
  validateForm,
  validateProperty,
} from "../validation/categoryValidation";

const useCategoryForm = (initialValues, onSubmit, selectedCategory) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedCategory) {
      const formattedCategory = {
        name: selectedCategory.name || "",
        slug: selectedCategory.slug || "",
        description: selectedCategory.description || "",
        parent: selectedCategory.parent || null,
      };
      setFormData(formattedCategory);
    }
  }, [selectedCategory]);

  const handleChange = ({ target: input }) => {
    const newErrors = { ...errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) newErrors[input.name] = errorMessage;
    else delete newErrors[input.name];

    // setFormData((prev) => ({
    //   ...prev,
    //   [input.name]:
    //     input.name === "parent" && !input.value ? null : input.value,
    // }));

    setFormData((prev) => ({
      ...prev,
      [input.name]: input.name === "parent" ? input.value || null : input.value,
    }));

    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data before validation:", formData);

    const validationErrors = validateForm(formData);

    console.log("Validation errors:", validationErrors);
    setErrors(validationErrors || {});

    if (validationErrors) return;

    console.log("Form data submitted:", formData);
    onSubmit(formData);
    setFormData(initialValues);
    setErrors({});
  };

  return { formData, errors, handleChange, handleSubmit };
};

export default useCategoryForm;
