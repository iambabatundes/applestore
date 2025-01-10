import { useCallback, useState } from "react";

export default function useColors(colors, onColorChange) {
  const [errors, setErrors] = useState([]);

  const handleColorChange = useCallback(
    (index, updatedColor) => {
      // Validation logic
      if (updatedColor.colorSalePrice && updatedColor.colorPrice) {
        if (
          parseFloat(updatedColor.colorSalePrice) >
          parseFloat(updatedColor.colorPrice)
        ) {
          setErrors((prevErrors) => {
            const newErrors = [...prevErrors];
            newErrors[index] = {
              ...newErrors[index],
              colorSalePrice: "Sale Price must not exceed Price.",
            };
            return newErrors;
          });
        } else {
          setErrors((prevErrors) => {
            const newErrors = [...prevErrors];
            if (newErrors[index]) {
              delete newErrors[index].colorSalePrice;
            }
            return newErrors;
          });
        }
      }

      const updatedColors = colors.map((color, i) =>
        i === index ? updatedColor : color
      );
      onColorChange(updatedColors);
    },
    [colors, onColorChange]
  );

  // const handleColorChange = useCallback(
  //   (index, updatedColor) => {
  //     const updatedColors = colors.map((color, i) =>
  //       i === index ? updatedColor : color
  //     );
  //     onColorChange(updatedColors);
  //   },
  //   [colors, onColorChange]
  // );

  const handleAddColor = useCallback(() => {
    const newColor = {
      colorName: "",
      colorPrice: 0,
      stock: 0,
      colorSalePrice: null,
      colorSaleStartDate: null,
      colorSaleEndDate: null,
      colorImages: {},
      isAvailable: true,
      isDefault: false,
    };
    onColorChange([...colors, newColor]);
  }, [colors, onColorChange]);

  const handleRemoveColor = useCallback(
    (index) => {
      const updatedColors = colors.filter((_, i) => i !== index);
      onColorChange(updatedColors);
    },
    [colors, onColorChange]
  );

  const handleImageUpload = useCallback(
    (e, index) => {
      const file = e.target.files?.[0];
      if (file) {
        handleColorChange(index, { ...colors[index], colorImages: file });
      }
    },
    [colors, handleColorChange]
  );

  const toggleDefault = useCallback(
    (index) => {
      const updatedColors = colors.map((color, i) => ({
        ...color,
        isDefault: i === index,
      }));
      onColorChange(updatedColors);
    },
    [colors, onColorChange]
  );

  return {
    handleColorChange,
    handleAddColor,
    handleRemoveColor,
    handleImageUpload,
    toggleDefault,
    errors,
  };
}
