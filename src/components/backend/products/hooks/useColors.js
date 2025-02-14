import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { colorVariations } from "../utils/colorVariations";
import config from "../../../../config.json";

export default function useColors({ setErrors }) {
  const [colors, setColor] = useState([]);

  const validateColor = (updatedColor) => colorVariations(updatedColor);

  const handleAddColor = useCallback(() => {
    setColor((prevSizes) => [
      ...prevSizes,
      {
        colorName: "",
        colorPrice: 0,
        stock: 0,
        colorSalePrice: null,
        colorSaleStartDate: null,
        colorSaleEndDate: null,
        colorImages: {},
        isAvailable: true,
        isDefault: false,
      },
    ]);
    setErrors((prevErrors) => ({
      ...prevErrors,
      colors: [...(prevErrors.colors || []), {}],
    }));
  }, [setErrors]);

  const handleColorChange = useCallback(
    (index, updatedColor) => {
      const defaultsizes = colors.filter((color, i) =>
        i === index ? updatedColor.isDefault : color.isDefault
      );
      if (defaultsizes.length > 1) {
        toast.error("Only one color can be marked as default.");
        return;
      }

      const sanitizedColorImages =
        updatedColor.colorImages instanceof File
          ? updatedColor.colorImages
          : typeof updatedColor.colorImages === "string"
          ? updatedColor.colorImages
          : updatedColor.colorImages?.filename
          ? `${config.mediaUrl}/uploads/${updatedColor.colorImages.filename}`
          : null;

      const updatedColors = colors.map((color, i) =>
        i === index
          ? { ...updatedColor, colorImages: sanitizedColorImages }
          : color
      );

      // const newErrors = validateColor(updatedColors);
      setColor(updatedColors);

      setErrors((prevErrors) => ({
        ...prevErrors,
        // colors: newErrors,
      }));
    },
    [colors, setErrors]
  );

  const handleRemoveColor = useCallback((index) => {
    setColor((prevColors) => prevColors.filter((_, i) => i !== index));
  }, []);

  const toggleDefaultColor = useCallback((index) => {
    setColor((prevSizes) =>
      prevSizes.map((color, i) => ({
        ...color,
        isDefault: i === index,
      }))
    );
  }, []);

  const handleColorImageUpload = useCallback(
    (e, index) => {
      const file = e.target.files?.[0];
      if (file) {
        handleColorChange(index, { ...colors[index], colorImages: file });
      }
    },
    [colors, handleColorChange]
  );

  return {
    colors,
    setColor,
    handleColorChange,
    handleAddColor,
    handleRemoveColor,
    handleColorImageUpload,
    toggleDefaultColor,
  };
}
