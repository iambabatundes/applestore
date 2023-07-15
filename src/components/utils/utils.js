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

  return totalPrice.toFixed(2); // Format the total price to two decimal places
}

export { calculateTotalPrice };
