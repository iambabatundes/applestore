import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { sizeVariations } from "../utils/sizeValidation";

const useSizes = ({ setErrors }) => {
  const [sizes, setSizes] = useState([]);

  const validateSizes = (updatedSizes) => sizeVariations(updatedSizes);

  const handleAddSize = useCallback(() => {
    setSizes((prevSizes) => [
      ...prevSizes,
      {
        sizeName: "",
        sizeStock: "",
        sizePrice: "",
        sizeSalePrice: "",
        sizeSaleStartDate: "",
        sizeSaleEndDate: "",
        isAvailable: true,
        isDefault: false,
      },
    ]);
    setErrors((prevErrors) => ({
      ...prevErrors,
      sizes: [...(prevErrors.sizes || []), {}],
    }));
  }, [setErrors]);

  const handleSizeChange = useCallback(
    (index, updatedSize) => {
      const defaultSizes = sizes.filter((size, i) =>
        i === index ? updatedSize.isDefault : size.isDefault
      );
      if (defaultSizes.length > 1) {
        toast.error("Only one size can be marked as default.");
        return;
      }

      // setSizes((prevSizes) =>
      //   prevSizes.map((size, i) => (i === index ? updatedSize : size))
      // );

      const newSizes = sizes.map((size, i) =>
        i === index ? updatedSize : size
      );

      const newErrors = sizeVariations(newSizes);

      setSizes(newSizes);
      setErrors((prevErrors) => ({
        ...prevErrors,
        sizes: newErrors,
      }));
    },
    [sizes, setErrors]
  );

  const handleRemoveSize = useCallback((index) => {
    setSizes((prevSizes) => prevSizes.filter((_, i) => i !== index));
  }, []);

  const toggleDefaultSize = useCallback((index) => {
    setSizes((prevSizes) =>
      prevSizes.map((size, i) => ({
        ...size,
        isDefault: i === index,
      }))
    );
  }, []);

  return {
    sizes,
    setSizes,
    handleAddSize,
    handleSizeChange,
    handleRemoveSize,
    validateSizes,
    toggleDefaultSize,
  };
};

export default useSizes;
