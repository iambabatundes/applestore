import React, { useState, useEffect } from "react";
import ProductCard from "./common/productCard";
import { getProductsByCategorys } from "./../../services/productService";

export default function Choice({
  addToCart,
  cartItems,
  conversionRate,
  selectedCurrency,
}) {
  const [products, setProducts] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    async function fetctProducts() {
      try {
        const { data } = await getProductsByCategorys("Category");
        // setProducts(data);
        setProducts([...data]);
      } catch (error) {
        console.error("Error fetching category products:", error);
      }
    }

    fetctProducts();
  }, []);

  const handleRatingChange = (newRating) => {
    console.log(`New rating for ${products.name}: ${newRating}`);
  };

  const handleNextCard = () => {
    const nextIndex = (currentCardIndex + 1) % (products.length - 5);
    setCurrentCardIndex(nextIndex);
  };

  const handlePrevCard = () => {
    const prevIndex =
      (currentCardIndex + products.length - 1) % (products.length - 5);
    setCurrentCardIndex(prevIndex);
  };

  const cardsToDisplay = products.slice(currentCardIndex, currentCardIndex + 5);

  return (
    <section>
      <div className="bigSave__cards-wrapper">
        <button
          className="bigSave-arrowBtn bigSave__leftBtn"
          onClick={handlePrevCard}
        >
          <span className="bigSave__iconBtn">
            <i className="fa fa-chevron-left" aria-hidden="true"></i>
          </span>
        </button>

        <div className="bigSave__product">
          {cardsToDisplay.map((product, index) => {
            return (
              <ProductCard
                key={product._id}
                addToCart={addToCart}
                item={product}
                handleRatingChange={handleRatingChange}
                cartItems={cartItems}
                productName={product}
                conversionRate={conversionRate}
                selectedCurrency={selectedCurrency}
              />
            );
          })}
        </div>
        <button
          className="bigSave-arrowBtn bigSave__nextBtn"
          onClick={handleNextCard}
        >
          <span className=".bigSave__iconBtn">
            <i className="fa fa-chevron-right" aria-hidden="true"></i>
          </span>
        </button>
      </div>
    </section>
  );
}
