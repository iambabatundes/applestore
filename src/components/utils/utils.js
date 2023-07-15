function calculateTotalPrice(cartItems, selectedQuantities, quantityTenPlus) {
  let totalPrice = 0;

  cartItems.forEach((item) => {
    const selectedQuantity = selectedQuantities[item.id] || 1;

    if (quantityTenPlus[item.id] && selectedQuantity === "10+") {
      totalPrice += item.price; // Use the default price of the item
    } else {
      const quantity = quantityTenPlus[item.id]
        ? selectedQuantity
        : parseInt(selectedQuantity);
      totalPrice += item.price * quantity;
    }
  });

  return totalPrice;
}

// function handleQuantityTenPlusChange(e, itemId, setQuantityTenPlus) {
//   const inputValue = parseInt(e.target.value);
//   if (inputValue >= 1 && inputValue <= 9) {
//     setQuantityTenPlus((prevQuantityTenPlus) => ({
//       ...prevQuantityTenPlus,
//       [itemId]: inputValue,
//     }));
//   } else {
//     setQuantityTenPlus((prevQuantityTenPlus) => ({
//       ...prevQuantityTenPlus,
//       [itemId]: inputValue || 1,
//     }));
//   }
// }

// function handleQuantityChange(
//   itemId,
//   quantity,
//   setSelectedQuantities,
//   setQuantityTenPlus
// ) {
//   if (quantity === "10+") {
//     setSelectedQuantities((prevQuantities) => ({
//       ...prevQuantities,
//       [itemId]: quantity,
//     }));
//     setQuantityTenPlus((prevQuantityTenPlus) => ({
//       ...prevQuantityTenPlus,
//       [itemId]: 1,
//     }));
//   } else {
//     setSelectedQuantities((prevQuantities) => ({
//       ...prevQuantities,
//       [itemId]: parseInt(quantity) || 1,
//     }));
//     setQuantityTenPlus((prevQuantityTenPlus) => ({
//       ...prevQuantityTenPlus,
//       [itemId]: undefined,
//     }));
//   }
// }

export { calculateTotalPrice };
