import { useState, useEffect } from "react";
import { validateForm, validateProperty } from "../validations/tagsValidation";

const useTagForm = (initialValues, onSubmit, selectedTag) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedTag) {
      const formattedTag = {
        name: selectedTag.name || "",
        slug: selectedTag.slug || "",
        description: selectedTag.description || "",
      };
      setFormData(formattedTag);
    }
  }, [selectedTag]);

  const handleChange = ({ target: input }) => {
    const newErrors = { ...errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) newErrors[input.name] = errorMessage;
    else delete newErrors[input.name];

    setFormData((prev) => ({
      ...prev,
      [input.name]: input.type === "checkbox" ? input.checked : input.value,
    }));

    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors || {});

    // if (validationErrors) {
    //   console.log(validationErrors);
    //   return;
    // }

    if (!validationErrors) {
      onSubmit(formData);
      setFormData(initialValues); // Reset form
    }
  };

  return { formData, errors, handleChange, handleSubmit };
};

export default useTagForm;
