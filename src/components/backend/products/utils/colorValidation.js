export function colorVariations(colors) {
  const errors = [];
  colors.forEach((color, index) => {
    const colorErrors = {};

    // Validate colorName
    if (!color.colorName) {
      colorErrors.colorName = "Color Name is required.";
    } else if (color.colorName.length < 3) {
      colorErrors.colorName = "Color Name must be at least 3 characters long.";
    }

    // Validate colorPrice
    const priceValue = parseFloat(color.colorPrice);
    if (!color.colorPrice) {
      colorErrors.colorName = "Color Price is required.";
    } else if (color.colorPrice === "" || isNaN(priceValue)) {
      colorErrors.colorPrice = "Price is required and must be a valid number.";
    } else if (priceValue < 0 || priceValue > 900000) {
      colorErrors.colorPrice = "Price must be between 0 and 900,000.";
    }

    // Validate stock
    const stockValue = parseInt(color.stock, 10);
    if (color.stock === "" || isNaN(stockValue) || stockValue < 0) {
      colorErrors.stock = "Stock must be a non-negative number.";
    }

    // Validate colorSalePrice dependencies
    if (color.colorSalePrice) {
      if (!color.colorSaleStartDate) {
        colorErrors.colorSaleStartDate =
          "Sale Start Date is required when Sale Price is set.";
      }
      if (!color.colorSaleEndDate) {
        colorErrors.colorSaleEndDate =
          "Sale End Date is required when Sale Price is set.";
      } else if (
        new Date(color.colorSaleEndDate) < new Date(color.colorSaleStartDate)
      ) {
        colorErrors.colorSaleEndDate =
          "End Date must not be earlier than Start Date.";
      }
      if (parseFloat(color.colorSalePrice) > parseFloat(color.colorPrice)) {
        colorErrors.colorSalePrice =
          "Sale Price must not exceed the regular Price.";
      }
    }

    // Validate colorImages
    // if (!color.colorImages || Object.keys(color.colorImages).length === 0) {
    //   colorErrors.colorImages = "Color image is required.";
    // }

    errors[index] = colorErrors;
  });

  return errors;
}
