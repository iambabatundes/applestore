import React, { useState, useEffect } from "react";
import ProductCard from "./productCard";
import "../components/styles/products.css";

export default function Products() {
  const products = [
    {
      id: 1,
      image: "/apple6.jpg",
      title: "Refreshing Flavors in Every Bite",
      description:
        "Experience the Orchard's Finest Selection with our Handpicked Apples: Indulge in the Juicy Sweetness and Exquisite Flavor of Nature's Bounty",
      rating: 4.5,
      price: 19.99,
    },
    {
      id: 2,
      image: "/apple3.jpg",
      title: "Discover the Delight of Fresh Apples",
      description:
        "Embark on a Journey through Nature's Apple Extravaganza: Immerse Yourself in a Whirlwind of Tempting Varieties Grown in Lush Orchards",
      rating: 5,
      price: 20.99,
    },

    {
      id: 3,
      image: "/apple8.jpeg",
      title: "Apple Ecstasy at Your Fingertips.",
      description:
        "Savor the Symphony of Freshness with our Crisp and Succulent Apples: Grown with Care and Nurtured",
      rating: 3.9,
      price: 100,
    },

    {
      id: 4,
      image: "apple9.jpg",
      title: "Savor the Orchard's Finest Apples.",
      description:
        "Prepare for The Apple Symphony Orchestra: A Crescendo of Crispness, Sweetness, and Unforgettable Eating Pleasure.",
      rating: 4.99,
      price: 50.99,
    },

    {
      id: 5,
      image: "apple1.jpg",
      title: "Savor the Orchard's Finest Apples.",
      description:
        "Prepare for The Apple Symphony Orchestra: A Crescendo of Crispness, Sweetness, and Unforgettable Eating Pleasure.",
      rating: 4.99,
      price: 50.99,
    },
    {
      id: 6,
      image: "apple2.jpg",
      title: "A Crescendo of Crispness, Sweetness Apple.",
      description:
        "Prepare for The Apple Symphony Orchestra: A Crescendo of Crispness, Sweetness, and Unforgettable Eating Pleasure.",
      rating: 4.99,
      price: 50.99,
    },
    {
      id: 7,
      image: "apple3.jpg",
      title: "Savor the Orchard's Finest Apples.",
      description:
        "Prepare for The Apple Symphony Orchestra: A Crescendo of Crispness, Sweetness, and Unforgettable Eating Pleasure.",
      rating: 4.99,
      price: 50.99,
    },
    {
      id: 8,
      image: "apple10.jpg",
      title: "Prepare for The Apple Symphony.",
      description:
        "Prepare for The Apple Symphony Orchestra: A Crescendo of Crispness, Sweetness, and Unforgettable Eating Pleasure.",
      rating: 4.99,
      price: 50.99,
    },
    {
      id: 9,
      image: "apple8.jpeg",
      title: "the Orchard's Finest Apples.",
      description:
        "Prepare for The Apple Symphony Orchestra: A Crescendo of Crispness, Sweetness, and Unforgettable Eating Pleasure.",
      rating: 4.99,
      price: 50.99,
    },
    {
      id: 10,
      image: "apple9.jpg",
      title: "Savor the Orchard's Finest Apples.",
      description:
        "Prepare for The Apple Symphony Orchestra: A Crescendo of Crispness, Sweetness, and Unforgettable Eating Pleasure.",
      rating: 4.99,
      price: 50.99,
    },
  ];

  const cardsPerPageDesktop = 5; // Number of cards to display per page on desktop
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobileView, setIsMobileView] = useState(true);

  const totalPagesDesktop = Math.ceil(products.length / cardsPerPageDesktop);
  const startIndexDesktop = currentPage * cardsPerPageDesktop;
  const endIndexDesktop = startIndexDesktop + cardsPerPageDesktop;

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPagesDesktop);
  };

  const handlePrevPage = () => {
    setCurrentPage(
      (prevPage) => (prevPage - 1 + totalPagesDesktop) % totalPagesDesktop
    );
  };

  const visibleProductsDesktop = products.slice(
    startIndexDesktop,
    endIndexDesktop
  );

  useEffect(() => {
    const handleResize = () => {
      // Check if the viewport width is less than the desktop breakpoint
      setIsMobileView(window.innerWidth < 768);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Initial check for mobile view on component mount
    handleResize();

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let intervalId;

    if (!isMobileView) {
      // Start the automatic slide on desktop
      intervalId = setInterval(handleNextPage, 3000);
    }
    if (isMobileView) {
      // Start the automatic slide on desktop
      intervalId = setInterval(handleNextPage, 3000);
    }

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [isMobileView, currentPage]);

  return (
    <section className="product__main">
      {!isMobileView && (
        <button className="chevron-button" onClick={handlePrevPage}>
          <i className="fa fa-chevron-left"></i>
        </button>
      )}

      {isMobileView ? (
        <ProductCard
          key={visibleProductsDesktop[0].id}
          image={visibleProductsDesktop[0].image}
          title={visibleProductsDesktop[0].title}
          description={visibleProductsDesktop[0].description}
          rating={visibleProductsDesktop[0].rating}
          price={visibleProductsDesktop[0].price}
        />
      ) : (
        visibleProductsDesktop.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            title={product.title}
            description={product.description}
            rating={product.rating}
            price={product.price}
          />
        ))
      )}

      {!isMobileView && (
        <button className="chevron-button" onClick={handleNextPage}>
          <i className="fa fa-chevron-right"></i>
        </button>
      )}
    </section>
  );
}
