import { useEffect } from "react";

export function useCartState(
  cartItems,
  quantityTenPlus,
  setQuantityTenPlus,
  selectedQuantities,
  setSelectedQuantities
) {
  //   const [selectedQuantities, setSelectedQuantities] = useState({});
  //   const [quantityTenPlus, setQuantityTenPlus] = useState({});

  useEffect(() => {
    const storedQuantities = localStorage.getItem("selectedQuantities");
    const storedQuantityTenPlus = localStorage.getItem("quantityTenPlus");

    if (storedQuantities) {
      setSelectedQuantities(JSON.parse(storedQuantities));
    } else {
      const initialQuantities = {};
      cartItems.forEach((item) => {
        initialQuantities[item.id] = 1;
      });
      setSelectedQuantities(initialQuantities);
    }

    if (storedQuantityTenPlus) {
      setQuantityTenPlus(JSON.parse(storedQuantityTenPlus));
    } else {
      const initialQuantityTenPlus = {};
      cartItems.forEach((item) => {
        initialQuantityTenPlus[item.id] = 1;
      });
      setQuantityTenPlus(initialQuantityTenPlus);
    }
  }, [cartItems, setSelectedQuantities, setQuantityTenPlus]);

  useEffect(() => {
    localStorage.setItem(
      "selectedQuantities",
      JSON.stringify(selectedQuantities)
    );
    localStorage.setItem("quantityTenPlus", JSON.stringify(quantityTenPlus));
  }, [selectedQuantities, quantityTenPlus]);

  return {
    selectedQuantities,
    setSelectedQuantities,
    quantityTenPlus,
    setQuantityTenPlus,
  };
}
