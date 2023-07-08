// export default function calculateTotalPrice(
//   cartItems,
//   selectedQuantities,
//   quantityTenPlus
// ) {
//   let totalPrice = 0;

//   cartItems.forEach((item) => {
//     const selectedQuantity = selectedQuantities[item.id] || 1;

//     if (quantityTenPlus[item.id] && quantityTenPlus[item.id] === "10+") {
//       totalPrice += item.price; // Assuming "Quantity 10+" is always 10
//     } else {
//       const quantity = parseInt(selectedQuantity);
//       totalPrice += item.price * quantity;
//     }
//   });

//   return totalPrice;
// }

export default function calculateTotalPrice(
  cartItems,
  selectedQuantities,
  quantityTenPlus
) {
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

// export default function calculateTotalPrice(
//   cartItems,
//   selectedQuantities,
//   quantityTenPlus
// ) {
//   let totalPrice = 0;

//   cartItems.forEach((item) => {
//     const selectedQuantity = selectedQuantities[item.id] || 1;

//     if (quantityTenPlus[item.id]) {
//       const quantity =
//         quantityTenPlus[item.id] === 10 ? "10+" : quantityTenPlus[item.id];
//       totalPrice += item.price * quantity;
//     } else {
//       totalPrice += item.price * selectedQuantity;
//     }
//   });

//   return totalPrice;
// }
