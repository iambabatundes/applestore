import React, { useState, useEffect } from "react";
import ProductCard from "./productCards";
import { getProducts } from "./productData";
import "./styles/Product.css";

export default function Product({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(5);

  useEffect(() => {
    const fetchedProducts = getProducts();
    setProducts(fetchedProducts);
  }, []);

  const handleNextCard = () => {
    const nextIndex = (currentCardIndex + 1) % products.length;
    setCurrentCardIndex(nextIndex);
  };

  const handlePrevCard = () => {
    const prevIndex =
      (currentCardIndex + products.length - 1) % products.length;
    setCurrentCardIndex(prevIndex);
  };

  const updateCardsPerPage = () => {
    const viewportWidth = window.innerWidth;
    if (viewportWidth < 768) {
      setCardsPerPage(1);
    } else if (viewportWidth < 1024) {
      setCardsPerPage(3);
    } else {
      setCardsPerPage(5);
    }
  };

  useEffect(() => {
    // Update the number of cards per page on window resize
    window.addEventListener("resize", updateCardsPerPage);
    // Initial update on component mount
    updateCardsPerPage();
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateCardsPerPage);
    };
  }, []);

  const productsToDisplay = [];

  for (let i = 0; i < cardsPerPage; i++) {
    const cardIndex = (currentCardIndex + i) % products.length;
    const card = products[cardIndex];

    if (card && card.className) {
      productsToDisplay.push(card);
    }
  }

  return (
    <section className="product-main">
      <h1 className="product__title">Popular professional services</h1>

      <button
        className="productMain-button productMain-button-prev"
        onClick={handlePrevCard}
      >
        <span className="productMain-button-icon">
          <i className="fa fa-chevron-left" aria-hidden="true"></i>
        </span>
      </button>

      <div className="productMain__card">
        {productsToDisplay.map((card) => (
          <ProductCard
            item={card}
            key={card.id}
            addToCart={addToCart}
            className={card.className}
            product={card}
          />
        ))}
      </div>

      <button
        className="productMain-button productMain-button-next"
        onClick={handleNextCard}
      >
        <span className="productMain-button-icon">
          <i className="fa fa-chevron-right" aria-hidden="true"></i>
        </span>
      </button>
    </section>
  );
}
