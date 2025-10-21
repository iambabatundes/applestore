export function materialVariations(material) {
  const errors = [];

  material.forEach((mat, index) => {
    const error = {};

    if (!mat.matName) {
      error.matName = "Material Name is required.";
    } else if (mat.matName.length < 3) {
      error.matName = "Material Name must be at least 3 characters long.";
    }

    const priceValue = parseFloat(mat.matPrice);
    if (mat.matPrice === "" || isNaN(priceValue)) {
      error.matPrice = "Material Price is required and must be a valid number.";
    } else if (priceValue < 0 || priceValue > 900000) {
      error.matPrice = "Material Price must be between 0 and 900,000.";
    }

    const stockValue = parseInt(mat.matStock, 10);
    if (mat.matStock === "" || isNaN(stockValue) || stockValue < 0) {
      error.matStock = "Material stock must be a non-negative number.";
    }

    if (mat.matSalePrice) {
      if (!mat.matSaleStartDate) {
        error.matSaleStartDate =
          "Material Start Date is required when Sale Price is set.";
      }
      if (!mat.matSaleEndDate) {
        error.matSaleEndDate =
          "Sale End Date is required when Sale Price is set.";
      } else if (
        new Date(mat.matSaleEndDate) < new Date(mat.matSaleStartDate)
      ) {
        error.matSaleEndDate = "End Date must not be earlier than Start Date.";
      }
      if (parseFloat(mat.matSalePrice) > parseFloat(mat.matPrice)) {
        error.matSalePrice =
          "Material Sale Price must not exceed the regular Price.";
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
