import React, { useState, useRef, useEffect } from "react";
import "../styles/singleProductTab.css";

export default function SingleProductTab() {
  const [activeTab, setActiveTab] = useState("reviews");
  const reviewsRef = useRef(null);
  const specsRef = useRef(null);
  const descRef = useRef(null);
  const storeRef = useRef(null);
  const youMayLikeRef = useRef(null);

  const handleScroll = (sectionRef) => {
    window.scrollTo({
      top: sectionRef.current.offsetTop - 50, // Adjust the scroll position as needed
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const sections = [
      { ref: reviewsRef, id: "reviews" },
      { ref: specsRef, id: "specs" },
      { ref: descRef, id: "description" },
      { ref: storeRef, id: "store" },
      { ref: youMayLikeRef, id: "youMayLike" },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5, // Adjust based on when you want tab to highlight
      }
    );

    sections.forEach(({ ref, id }) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach(({ ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <div className="single-product-tabs">
      {/* Tab Navigation */}
      <nav className="tab-navigation">
        <ul>
          <li
            className={activeTab === "reviews" ? "active" : ""}
            onClick={() => handleScroll(reviewsRef)}
          >
            Customer Reviews
          </li>
          <li
            className={activeTab === "specs" ? "active" : ""}
            onClick={() => handleScroll(specsRef)}
          >
            Specifications
          </li>
          <li
            className={activeTab === "description" ? "active" : ""}
            onClick={() => handleScroll(descRef)}
          >
            Description
          </li>
          <li
            className={activeTab === "store" ? "active" : ""}
            onClick={() => handleScroll(storeRef)}
          >
            Store
          </li>
          <li
            className={activeTab === "youMayLike" ? "active" : ""}
            onClick={() => handleScroll(youMayLikeRef)}
          >
            You May Also Like
          </li>
        </ul>
      </nav>

      {/* Tab Content Sections */}
      <section className="tabSection" id="reviews" ref={reviewsRef}>
        <h2>Customer Reviews</h2>
        {/* Add your customer review content here */}
      </section>

      <section className="tabSection" id="specs" ref={specsRef}>
        <h2>Specifications</h2>
        {/* Add your specifications content here */}
      </section>

      <section className="tabSection" id="description" ref={descRef}>
        <h2>Description</h2>
        {/* Add your description content here */}
      </section>

      <section className="tabSection" id="store" ref={storeRef}>
        <h2>Store</h2>
        {/* Add your store content here */}
      </section>

      <section className="tabSection" id="youMayLike" ref={youMayLikeRef}>
        <h2>You May Also Like</h2>
        {/* Add your recommended products content here */}
      </section>
    </div>
  );
}
