export const formatPrice = (price, currency, conversionRate) => {
  const convertedPrice = price * conversionRate;

  const formattedPrice = convertedPrice
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const [whole, fraction] = formattedPrice.split(".");

  return { currency, whole, fraction };
};

export const formatPermalink = (name) => {
  return name.toLowerCase().replaceAll(" ", "-");
};
