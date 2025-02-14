export function colorVariations(colors) {
  const errors = [];

  colors.forEach((color, index) => {
    const error = {};

    if (!color.colorName) {
      error.colorName = "Color Name is required.";
    } else if (color.colorName.length < 3) {
      error.colorName = "Color Name must be at least 3 characters long.";
    }

    const priceValue = parseFloat(color.colorPrice);
    if (error.colorPrice === "" || isNaN(priceValue)) {
      error.colorPrice = "Price is required and must be a valid number.";
    } else if (priceValue < 0 || priceValue > 900000) {
      error.colorPrice = "Price must be between 0 and 900,000.";
    }

    const stockValue = parseInt(color.stock, 10);
    if (color.stock === "" || isNaN(stockValue) || stockValue < 0) {
      color.stock = "Stock must be a non-negative number.";
    }

    if (color.colorSalePrice) {
      if (!color.colorSaleStartDate) {
        error.colorSaleStartDate =
          "Sale Start Date is required when Sale Price is set.";
      }
      if (!color.colorSaleEndDate) {
        error.colorSaleEndDate =
          "Sale End Date is required when Sale Price is set.";
      } else if (
        new Date(color.colorSaleEndDate) < new Date(color.colorSaleStartDate)
      ) {
        error.colorSaleEndDate =
          "End Date must not be earlier than Start Date.";
      }
      if (parseFloat(color.colorSalePrice) > parseFloat(color.colorPrice)) {
        error.colorSalePrice =
          "Color Sale Price must not exceed the regular Price.";
      }
    }

    errors[index] = error;
  });

  return errors;
}
