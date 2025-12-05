// export const formatPrice = (price, currency, conversionRate) => {
//   const convertedPrice = price * conversionRate;

//   const formattedPrice = convertedPrice
//     .toFixed(2)
//     .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

//   const [whole, fraction] = formattedPrice.split(".");

//   return { currency, whole, fraction };
// };

// export const formatPermalink = (name) => {
//   return name.toLowerCase().replaceAll(" ", "-");
// };

// utils.js

export const formatPrice = (price, currency, conversionRate) => {
  const convertedPrice = price * conversionRate;

  const formattedPrice = convertedPrice
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const [whole, fraction] = formattedPrice.split(".");

  return {
    currency,
    whole,
    fraction,
    full: `${currency}${formattedPrice}`,
    numeric: convertedPrice,
  };
};

// New function for cart/summary display
export const formatPriceDisplay = (price, currency, conversionRate) => {
  const { whole, fraction } = formatPrice(price, currency, conversionRate);
  return `${currency}${whole}.${fraction}`;
};

// For numeric calculations (keeps the number)
export const getConvertedPrice = (price, conversionRate) => {
  return price * conversionRate;
};

export const formatPermalink = (name) => {
  return name.toLowerCase().replaceAll(" ", "-");
};
