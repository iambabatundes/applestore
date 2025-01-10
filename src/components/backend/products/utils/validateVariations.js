export function validateVariations(variations) {
  const errors = { colors: [], sizes: [] };

  variations.colors.forEach((color, index) => {
    const colorErrors = {};
    if (!color.name) colorErrors.name = "Color name is required.";
    if (!color.price || color.price < 0)
      colorErrors.price = "Valid price is required.";
    if (!color.stock || color.stock < 0)
      colorErrors.stock = "Valid stock quantity is required.";
    errors.colors[index] = colorErrors;
  });

  variations.sizes.forEach((size, index) => {
    const sizeErrors = {};
    if (!size.label) sizeErrors.label = "Size label is required.";
    if (!size.stock || size.stock < 0)
      sizeErrors.stock = "Valid stock is required.";
    if (!size.price || size.price < 0)
      sizeErrors.price = "Valid price is required.";
    errors.sizes[index] = sizeErrors;
  });

  return errors;
}
