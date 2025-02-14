function calculateTotalPrice(
  cartItems,
  selectedQuantities,
  quantityTenPlus,
  conversionRate
) {
  let totalPrice = 0;

  cartItems.forEach((item) => {
    const selectedQuantity = selectedQuantities[item._id] || 1;

    if (quantityTenPlus[item._id] && selectedQuantity === "10+") {
      totalPrice += item.price * conversionRate; // Use the default price of the item
    } else {
      const quantity = quantityTenPlus[item._id]
        ? selectedQuantity
        : parseInt(selectedQuantity);
      totalPrice += item.price * quantity * conversionRate;
    }
  });

  return totalPrice.toFixed(2); // Format the total price to two decimal places
}

export { calculateTotalPrice };
