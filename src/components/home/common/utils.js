// export const formatPrice = (price) => {
//   const [currency, amount] = price.match(/([^\d]+)([\d,.]+)/).slice(1, 3);
//   const [whole, fraction] = amount.split(".");
//   return { currency, whole, fraction };
// };

// export const formatPrice = (price) => {
//   const priceStr = price.toString();

//     const [currency, amount] = priceStr.match(/([^\d]+)([\d,.]+)/).slice(1, 3);
//   const [whole, fraction] = amount.split(",");

//   return { currency, whole, fraction };
// };

// export const formatPrice = (price, currency = "₦") => {
//   // Convert price to a fixed two-decimal string and add commas for large numbers
//   const formattedPrice = price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

//   // Split the whole part and fraction part
//   const [whole, fraction] = formattedPrice.split(".");

//   // Assuming default currency is USD
//   // const currency = "$";

//   return { currency, whole, fraction };
// };

export const formatPrice = (price, currency = "₦", conversionRate = 1) => {
  // Convert price to the selected currency
  const convertedPrice = price * conversionRate;

  // Convert price to a fixed two-decimal string and add commas
  const formattedPrice = convertedPrice
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const [whole, fraction] = formattedPrice.split(".");

  return { currency, whole, fraction };
};

export const formatPermalink = (name) => {
  return name.toLowerCase().replaceAll(" ", "-");
};
