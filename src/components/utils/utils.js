export default function calculateTotalPrice(
  cartItems,
  selectedQuantities,
  quantityTenPlus
) {
  let totalPrice = 0;

  cartItems.forEach((item) => {
    const quantity = selectedQuantities[item.id] || 1;
    totalPrice += item.price * quantity;
  });

  if (quantityTenPlus > 0 && cartItems.length > 0) {
    totalPrice += quantityTenPlus * cartItems[0].price; // Assuming all items have the same price, use cartItems[0].price
  }

  return totalPrice;
}
