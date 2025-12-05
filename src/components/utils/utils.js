export const calculateTotalPrice = (
  cartItems = [],
  selectedQuantities = {},
  quantityTenPlus = {},
  conversionRate = 1
) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return 0;
  }

  const validConversionRate = Number(conversionRate) || 1;

  return cartItems.reduce((total, item) => {
    if (!item || typeof item.price !== "number") {
      console.warn("Invalid item in cart:", item);
      return total;
    }

    const quantity =
      quantityTenPlus[item._id] ?? selectedQuantities[item._id] ?? 1;
    const validQuantity = Number(quantity) || 1;
    const itemPrice = item.price * validQuantity * validConversionRate;

    return total + itemPrice;
  }, 0);
};

export const calculateItemSubtotal = (
  item,
  quantity = 1,
  conversionRate = 1
) => {
  if (!item || typeof item.price !== "number") {
    return 0;
  }

  const validQuantity = Number(quantity) || 1;
  const validConversionRate = Number(conversionRate) || 1;

  return item.price * validQuantity * validConversionRate;
};

export const calculateCartTotals = (
  cartItems = [],
  selectedQuantities = {},
  quantityTenPlus = {},
  conversionRate = 1,
  taxRate = 0,
  shippingCost = 0
) => {
  const subtotal = calculateTotalPrice(
    cartItems,
    selectedQuantities,
    quantityTenPlus,
    conversionRate
  );

  const tax = subtotal * taxRate;
  const shipping = cartItems.length > 0 ? shippingCost : 0;
  const total = subtotal + tax + shipping;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
};

export const calculateTotalItems = (
  cartItems = [],
  selectedQuantities = {},
  quantityTenPlus = {}
) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return 0;
  }

  return cartItems.reduce((total, item) => {
    const quantity =
      quantityTenPlus[item._id] ?? selectedQuantities[item._id] ?? 1;
    const validQuantity = Number(quantity) || 1;
    return total + validQuantity;
  }, 0);
};

export const formatCurrency = (amount, currency, decimals = 2) => {
  const validAmount = Number(amount) || 0;
  const formatted = validAmount.toFixed(decimals);
  return `${currency}${formatted}`;
};

export const validateStock = (item, requestedQuantity) => {
  if (!item) {
    return {
      isValid: false,
      message: "Item not found",
    };
  }

  if (!item.inStock || item.inStock === 0) {
    return {
      isValid: false,
      message: "Item is out of stock",
    };
  }

  const validQuantity = Number(requestedQuantity) || 1;

  if (validQuantity > item.inStock) {
    return {
      isValid: false,
      message: `Only ${item.inStock} items available in stock`,
      maxAvailable: item.inStock,
    };
  }

  return {
    isValid: true,
    message: "Stock available",
  };
};

export const calculateSavings = (item, quantity = 1, conversionRate = 1) => {
  if (!item || !item.discountPrice || !item.price) {
    return 0;
  }

  const validQuantity = Number(quantity) || 1;
  const validConversionRate = Number(conversionRate) || 1;
  const regularPrice = item.price * validQuantity * validConversionRate;
  const discountPrice =
    item.discountPrice * validQuantity * validConversionRate;

  return Math.max(0, regularPrice - discountPrice);
};

export const getCartSummary = (
  cartItems = [],
  selectedQuantities = {},
  quantityTenPlus = {}
) => {
  const totalItems = calculateTotalItems(
    cartItems,
    selectedQuantities,
    quantityTenPlus
  );

  const uniqueItems = cartItems.length;

  const itemsInStock = cartItems.filter(
    (item) => item.inStock && item.inStock > 0
  ).length;

  const itemsOutOfStock = uniqueItems - itemsInStock;

  return {
    totalItems,
    uniqueItems,
    itemsInStock,
    itemsOutOfStock,
  };
};

export const sanitizeCartData = (cartItems) => {
  if (!Array.isArray(cartItems)) {
    console.warn("Invalid cart items provided");
    return [];
  }

  return cartItems.filter((item) => {
    if (!item || !item._id) {
      console.warn("Invalid cart item:", item);
      return false;
    }

    if (typeof item.price !== "number" || item.price < 0) {
      console.warn("Invalid price for item:", item);
      return false;
    }

    return true;
  });
};

export const generateShareableCartLink = (cartItems) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return "";
  }

  const itemIds = cartItems.map((item) => item._id).join(",");
  const baseUrl = window.location.origin;
  return `${baseUrl}/cart?items=${encodeURIComponent(itemIds)}`;
};

export const formatPermalink = (name) => {
  if (typeof name !== "string") {
    return "";
  }
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
