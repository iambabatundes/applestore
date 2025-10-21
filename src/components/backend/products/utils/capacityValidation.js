export function capacityVariations(capacity) {
  const errors = [];

  capacity.forEach((cap, index) => {
    const error = {};

    if (!cap.capName) {
      error.capName = "Capacity Name is required.";
    } else if (cap.capName.length < 3) {
      error.capName = "Capacity Name must be at least 3 characters long.";
    }

    const priceValue = parseFloat(cap.capPrice);
    if (cap.capPrice === "" || isNaN(priceValue)) {
      error.capPrice = "Capacity Price is required and must be a valid number.";
    } else if (priceValue < 0 || priceValue > 900000) {
      error.capPrice = "Capacity Price must be between 0 and 900,000.";
    }

    const stockValue = parseInt(cap.capStock, 10);
    if (cap.capStock === "" || isNaN(stockValue) || stockValue < 0) {
      error.capStock = "Capacity Stock must be a non-negative number.";
    }

    if (cap.capSalePrice) {
      if (!cap.capSaleStartDate) {
        error.capSaleStartDate =
          "Capacity Start Date is required when Sale Price is set.";
      }
      if (!cap.capSaleEndDate) {
        error.capSaleEndDate =
          "Sale End Date is required when Sale Price is set.";
      } else if (
        new Date(cap.capSaleEndDate) < new Date(cap.capSaleStartDate)
      ) {
        error.capSaleEndDate = "End Date must not be earlier than Start Date.";
      }
      if (parseFloat(cap.capSalePrice) > parseFloat(cap.capPrice)) {
        error.capSalePrice =
          "Capacity Sale Price must not exceed the regular Price.";
      }
    }

    // Only add to errors array if there are actual errors
    if (Object.keys(error).length > 0) {
      errors[index] = error;
    }
  });

  // Return null if no errors, otherwise return the errors array
  return errors.length > 0 ? errors : null;
}
