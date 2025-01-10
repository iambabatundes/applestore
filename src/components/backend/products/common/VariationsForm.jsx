import React, { useState } from "react";

export default function VariationsForm() {
  const [variations, setVariations] = useState([
    {
      color: "",
      sizes: [],
      capacity: [],
      materials: [],
      price: "",
      stock: "",
      salePrice: null,
      bundleOptions: [],
    },
  ]);

  const handleVariationChange = (index, field, value) => {
    const updatedVariations = [...variations];
    updatedVariations[index][field] = value;
    setVariations(updatedVariations);
  };

  const handleAddToArrayField = (index, field, value) => {
    const updatedVariations = [...variations];
    updatedVariations[index][field] = [
      ...updatedVariations[index][field],
      value,
    ];
    setVariations(updatedVariations);
  };

  const handleRemoveFromArrayField = (index, field, valueIndex) => {
    const updatedVariations = [...variations];
    updatedVariations[index][field] = updatedVariations[index][field].filter(
      (_, idx) => idx !== valueIndex
    );
    setVariations(updatedVariations);
  };

  const addVariation = () => {
    setVariations([
      ...variations,
      { color: "", sizes: [], capacity: [], materials: [], price: 0, stock: 0 },
    ]);
  };

  return (
    <section>
      {variations.map((variation, index) => (
        <div key={index} className="variation">
          <input
            type="text"
            placeholder="Color"
            value={variation.color}
            onChange={(e) =>
              handleVariationChange(index, "color", e.target.value)
            }
          />
          <input
            type="number"
            placeholder="Price"
            value={variation.price}
            onChange={(e) =>
              handleVariationChange(index, "price", parseFloat(e.target.value))
            }
          />
          <input
            type="number"
            placeholder="Stock"
            value={variation.stock}
            onChange={(e) =>
              handleVariationChange(index, "stock", parseInt(e.target.value))
            }
          />

          {/* Sizes Section */}
          <div>
            <h4>Sizes</h4>
            {variation.sizes.map((size, sizeIndex) => (
              <div key={sizeIndex}>
                <span>{size}</span>
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveFromArrayField(index, "sizes", sizeIndex)
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <input
              type="text"
              placeholder="Add Size"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  handleAddToArrayField(index, "sizes", e.target.value.trim());
                  e.target.value = "";
                }
              }}
            />
          </div>

          {/* Capacity Section */}
          <div>
            <h4>Capacities</h4>
            {variation.capacity.map((cap, capIndex) => (
              <div key={capIndex}>
                <span>{cap}</span>
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveFromArrayField(index, "capacity", capIndex)
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <input
              type="text"
              placeholder="Add Capacity"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  handleAddToArrayField(
                    index,
                    "capacity",
                    e.target.value.trim()
                  );
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>
      ))}
      <button onClick={addVariation}>Add Variation</button>
    </section>
  );
}
