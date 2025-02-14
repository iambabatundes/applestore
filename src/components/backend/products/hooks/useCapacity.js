import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { capacityVariations } from "../utils/capacityValidation";

const useCapacity = ({ setErrors }) => {
  const [capacity, setCapacity] = useState([]);

  const validateCapacity = (updatedCapacity) =>
    capacityVariations(updatedCapacity);

  const handleAddCapacity = useCallback(() => {
    setCapacity((prevCapacity) => [
      ...prevCapacity,
      {
        capName: "",
        capStock: "",
        capPrice: "",
        capSalePrice: "",
        capSaleStartDate: "",
        capSaleEndDate: "",
        isAvailable: true,
        isDefault: false,
      },
    ]);
    setErrors((prevErrors) => ({
      ...prevErrors,
      capacity: [...(prevErrors.capacity || []), {}],
    }));
  }, [setErrors]);

  const handleCapacityChange = useCallback(
    (index, updatedCapacity) => {
      const defaultCapacity = capacity.filter((cap, i) =>
        i === index ? updatedCapacity.isDefault : cap.isDefault
      );
      if (defaultCapacity.length > 1) {
        toast.error("Only one capacity can be marked as default.");
        return;
      }

      const newCapacity = capacity.map((cap, i) =>
        i === index ? updatedCapacity : cap
      );

      const newErrors = capacityVariations(newCapacity);

      setCapacity(newCapacity);
      setErrors((prevErrors) => ({
        ...prevErrors,
        capacity: newErrors,
      }));
    },
    [capacity, setErrors]
  );

  const handleRemoveCapacity = useCallback((index) => {
    setCapacity((prevCapacity) => prevCapacity.filter((_, i) => i !== index));
  }, []);

  const toggleDefaultCapacity = useCallback((index) => {
    setCapacity((prevCapacity) =>
      prevCapacity.map((cap, i) => ({
        ...cap,
        isDefault: i === index,
      }))
    );
  }, []);

  return {
    capacity,
    setCapacity,
    handleAddCapacity,
    handleCapacityChange,
    handleRemoveCapacity,
    validateCapacity,
    toggleDefaultCapacity,
  };
};

export default useCapacity;
