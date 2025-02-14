export function sizeVariations(sizes) {
  const errors = [];

  sizes.forEach((size, index) => {
    const error = {};

    if (!size.sizeName) {
      error.sizeName = "Size Name is required.";
    } else if (size.sizeName.length < 3) {
      error.sizeName = "Size Name must be at least 3 characters long.";
    }

    const priceValue = parseFloat(size.sizePrice);
    if (size.sizePrice === "" || isNaN(priceValue)) {
      error.sizePrice = "Size Price is required and must be a valid number.";
    } else if (priceValue < 0 || priceValue > 900000) {
      error.sizePrice = "Sizes Price must be between 0 and 900,000.";
    }

    const stockValue = parseInt(size.sizeStock, 10);
    if (size.sizeStock === "" || isNaN(stockValue) || stockValue < 0) {
      error.sizeStock = "Size Stock must be a non-negative number.";
    }

    if (size.sizeSalePrice) {
      if (!size.sizeSaleStartDate) {
        error.sizeSaleStartDate =
          "Sale Start Date is required when Sale Price is set.";
      }
      if (!size.sizeSaleEndDate) {
        error.sizeSaleEndDate =
          "Sale End Date is required when Sale Price is set.";
      } else if (
        new Date(size.sizeSaleEndDate) < new Date(size.sizeSaleStartDate)
      ) {
        error.sizeSaleEndDate = "End Date must not be earlier than Start Date.";
      }
      if (parseFloat(size.sizeSalePrice) > parseFloat(size.sizePrice)) {
        error.sizeSalePrice =
          "Size Sale Price must not exceed the regular Price.";
      }
    }

    errors[index] = error;
  });

  return errors;
}
