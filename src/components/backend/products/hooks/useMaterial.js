import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { materialVariations } from "../utils/materialValidation";

const useMaterial = ({ setErrors }) => {
  const [materials, setMaterials] = useState([]);

  const validateMaterials = (updatedMaterials) =>
    materialVariations(updatedMaterials);

  const handleAddMaterials = useCallback(() => {
    setMaterials((prevMaterial) => [
      ...prevMaterial,
      {
        matName: "",
        matStock: "",
        matPrice: "",
        matSalePrice: "",
        matSaleStartDate: "",
        matSaleEndDate: "",
        isAvailable: true,
        isDefault: false,
      },
    ]);
    setErrors((prevErrors) => ({
      ...prevErrors,
      materials: [...(prevErrors.materials || []), {}],
    }));
  }, [setErrors]);

  const handleMaterialsChange = useCallback(
    (index, updatedMaterials) => {
      const defaultMaterials = materials.filter((mat, i) =>
        i === index ? updatedMaterials.isDefault : mat.isDefault
      );
      if (defaultMaterials.length > 1) {
        toast.error("Only one materials can be marked as default.");
        return;
      }

      const newMaterial = materials.map((mat, i) =>
        i === index ? updatedMaterials : mat
      );

      const newErrors = materialVariations(newMaterial);

      setMaterials(newMaterial);
      setErrors((prevErrors) => ({
        ...prevErrors,
        materials: newErrors,
      }));
    },
    [materials, setErrors]
  );

  const handleRemoveMaterial = useCallback((index) => {
    setMaterials((prevMaterial) => prevMaterial.filter((_, i) => i !== index));
  }, []);

  const toggleDefaultMaterials = useCallback((index) => {
    setMaterials((prevMaterial) =>
      prevMaterial.map((mat, i) => ({
        ...mat,
        isDefault: i === index,
      }))
    );
  }, []);

  return {
    materials,
    setMaterials,
    handleAddMaterials,
    handleMaterialsChange,
    handleRemoveMaterial,
    validateMaterials,
    toggleDefaultMaterials,
  };
};

export default useMaterial;
