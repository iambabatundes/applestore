// /utils/currencyFormatter.js

export const CURRENCY_CONFIGS = {
  USD: {
    symbol: "$",
    decimalDigits: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  EUR: {
    symbol: "€",
    decimalDigits: 2,
    thousandsSeparator: ".",
    decimalSeparator: ",",
  },
  GBP: {
    symbol: "£",
    decimalDigits: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  JPY: {
    symbol: "¥",
    decimalDigits: 0,
    thousandsSeparator: ",",
    decimalSeparator: "",
  },
  CNY: {
    symbol: "¥",
    decimalDigits: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  INR: {
    symbol: "₹",
    decimalDigits: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  NGN: {
    symbol: "₦",
    decimalDigits: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  CAD: {
    symbol: "C$",
    decimalDigits: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  AUD: {
    symbol: "A$",
    decimalDigits: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },

  // African currencies
  KES: {
    symbol: "KSh",
    decimalDigits: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  GHS: {
    symbol: "GH₵",
    decimalDigits: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  ZAR: {
    symbol: "R",
    decimalDigits: 2,
    thousandsSeparator: " ",
    decimalSeparator: ".",
  },

  // Middle Eastern currencies
  AED: {
    symbol: "د.إ",
    decimalDigits: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  SAR: {
    symbol: "ر.س",
    decimalDigits: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },

  // European currencies
  CHF: {
    symbol: "CHF",
    decimalDigits: 2,
    thousandsSeparator: "'",
    decimalSeparator: ".",
  },
  SEK: {
    symbol: "kr",
    decimalDigits: 2,
    thousandsSeparator: " ",
    decimalSeparator: ",",
  },
  NOK: {
    symbol: "kr",
    decimalDigits: 2,
    thousandsSeparator: " ",
    decimalSeparator: ",",
  },
  DKK: {
    symbol: "kr",
    decimalDigits: 2,
    thousandsSeparator: ".",
    decimalSeparator: ",",
  },

  // Asian currencies
  KRW: {
    symbol: "₩",
    decimalDigits: 0,
    thousandsSeparator: ",",
    decimalSeparator: "",
  },
  SGD: {
    symbol: "S$",
    decimalDigits: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  HKD: {
    symbol: "HK$",
    decimalDigits: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  TWD: {
    symbol: "NT$",
    decimalDigits: 0,
    thousandsSeparator: ",",
    decimalSeparator: "",
  },

  // South American currencies
  BRL: {
    symbol: "R$",
    decimalDigits: 2,
    thousandsSeparator: ".",
    decimalSeparator: ",",
  },
  ARS: {
    symbol: "$",
    decimalDigits: 2,
    thousandsSeparator: ".",
    decimalSeparator: ",",
  },

  // Default fallback
  DEFAULT: {
    symbol: "",
    decimalDigits: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
};

export const formatNumber = (
  number,
  thousandsSeparator = ",",
  decimalSeparator = ".",
  decimalDigits = 2
) => {
  const num = parseFloat(number);

  if (isNaN(num)) {
    return "0" + decimalSeparator + "00".padStart(decimalDigits, "0");
  }

  // Handle negative numbers
  const isNegative = num < 0;
  const absoluteNum = Math.abs(num);

  // Format integer part with thousands separators
  const integerPart = Math.floor(absoluteNum);
  const formattedInteger = integerPart
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);

  // Format decimal part
  const decimalPart = (absoluteNum - integerPart)
    .toFixed(decimalDigits)
    .slice(2);

  const formattedDecimal = decimalPart.padStart(decimalDigits, "0");

  // Combine parts
  let result = formattedInteger;

  if (decimalDigits > 0 && formattedDecimal !== "00".repeat(decimalDigits)) {
    result += decimalSeparator + formattedDecimal;
  }

  // Add negative sign if needed
  if (isNegative) {
    result = "-" + result;
  }

  return result;
};

export const formatCurrency = (amount, currencyCode = "USD", options = {}) => {
  // Get currency configuration
  const currency = currencyCode.toUpperCase();
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.DEFAULT;

  // Merge options with config
  const {
    symbol = config.symbol,
    decimalDigits = config.decimalDigits,
    thousandsSeparator = config.thousandsSeparator,
    decimalSeparator = config.decimalSeparator,
    symbolPosition = "before", // "before" or "after"
    symbolSpacing = true, // Add space between symbol and amount
    compact = false, // Use compact notation for large numbers (e.g., 1.2K, 1.5M)
    compactThreshold = 10000, // When to use compact notation
    locale = "en-US", // For Intl API fallback
    showCode = false, // Show currency code instead of symbol
  } = options;

  const num = parseFloat(amount);

  if (isNaN(num)) {
    return `${symbol}${symbolSpacing ? " " : ""}0${decimalSeparator}00`;
  }

  // Handle compact notation for large numbers
  if (compact && Math.abs(num) >= compactThreshold) {
    const compactFormatted = formatCompactNumber(num, decimalDigits, locale);
    return formatCurrencySymbol(
      compactFormatted,
      symbol,
      symbolPosition,
      symbolSpacing,
      showCode,
      currency
    );
  }

  // Standard formatting
  const formattedNumber = formatNumber(
    num,
    thousandsSeparator,
    decimalSeparator,
    decimalDigits
  );

  return formatCurrencySymbol(
    formattedNumber,
    symbol,
    symbolPosition,
    symbolSpacing,
    showCode,
    currency
  );
};

export const formatCompactNumber = (
  num,
  decimalDigits = 1,
  locale = "en-US"
) => {
  const formatter = new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
    minimumFractionDigits: decimalDigits,
    maximumFractionDigits: decimalDigits,
  });

  return formatter.format(num);
};

const formatCurrencySymbol = (
  formattedNumber,
  symbol,
  symbolPosition,
  symbolSpacing,
  showCode,
  currencyCode
) => {
  const space = symbolSpacing ? " " : "";

  if (showCode) {
    // Show currency code (e.g., "USD 1,234.56")
    return `${currencyCode}${space}${formattedNumber}`;
  }

  if (symbolPosition === "after") {
    // Symbol after amount (e.g., "1 234,56 €" in French)
    return `${formattedNumber}${space}${symbol}`;
  }

  // Default: symbol before amount (e.g., "$1,234.56")
  return `${symbol}${space}${formattedNumber}`;
};

export const parseCurrency = (formattedCurrency, currencyCode = "USD") => {
  const config = CURRENCY_CONFIGS[currencyCode] || CURRENCY_CONFIGS.DEFAULT;

  // Remove currency symbol and spaces
  let cleanString = formattedCurrency
    .replace(new RegExp(`[${config.symbol}\\s]`, "g"), "")
    .replace(config.thousandsSeparator, "")
    .replace(config.decimalSeparator, ".");

  return parseFloat(cleanString) || 0;
};

export const formatPriceWithDiscount = (price, discountPrice, currencyCode) => {
  const formattedOriginal = formatCurrency(price, currencyCode);
  const formattedDiscount = formatCurrency(discountPrice, currencyCode);

  const discountPercentage =
    discountPrice < price
      ? Math.round(((price - discountPrice) / price) * 100)
      : 0;

  const savings = price - discountPrice;
  const formattedSavings = formatCurrency(savings, currencyCode);

  return {
    original: formattedOriginal,
    discount: formattedDiscount,
    percentage: discountPercentage,
    savings: formattedSavings,
    hasDiscount: discountPrice < price,
  };
};

export const formatPriceRange = (minPrice, maxPrice, currencyCode = "USD") => {
  if (minPrice === maxPrice) {
    return formatCurrency(minPrice, currencyCode);
  }

  const formattedMin = formatCurrency(minPrice, currencyCode);
  const formattedMax = formatCurrency(maxPrice, currencyCode);

  return `${formattedMin} – ${formattedMax}`;
};

export const getCurrencyConfig = (currencyCode = "USD") => {
  return (
    CURRENCY_CONFIGS[currencyCode.toUpperCase()] || CURRENCY_CONFIGS.DEFAULT
  );
};

export const formatCurrencyIntl = (
  amount,
  currencyCode = "USD",
  locale = "en-US"
) => {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback to custom formatting
    console.warn(`Intl formatting failed for ${currencyCode}:`, error);
    return formatCurrency(amount, currencyCode);
  }
};

export const calculateAndFormatTotalPrice = (
  cartItems = [],
  selectedQuantities = {},
  quantityTenPlus = {},
  conversionRate = 1,
  currencyCode = "USD",
  options = {}
) => {
  const rawTotal = calculateTotalPrice(
    cartItems,
    selectedQuantities,
    quantityTenPlus,
    conversionRate
  );

  return formatCurrency(rawTotal, currencyCode, options);
};

export const calculateAndFormatItemSubtotal = (
  item,
  quantity = 1,
  conversionRate = 1,
  currencyCode = "USD",
  options = {}
) => {
  const rawSubtotal = calculateItemSubtotal(item, quantity, conversionRate);
  return formatCurrency(rawSubtotal, currencyCode, options);
};
