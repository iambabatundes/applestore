const calculateTotalPrice = (
  cartItems,
  selectedQuantities,
  quantityTenPlus,
  conversionRate
) => {
  return cartItems.reduce((total, item) => {
    const quantity =
      quantityTenPlus[item._id] ?? selectedQuantities[item._id] ?? 1;
    return total + item.price * quantity * conversionRate;
  }, 0);
};

export { calculateTotalPrice };
