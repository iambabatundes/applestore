import React from "react";
import ProductList from "./ProductList";

const groupProducts = (products, chunkSize) => {
  const groups = [];
  for (let i = 0; i < products.length; i += chunkSize) {
    groups.push(products.slice(i, i + chunkSize));
  }
  return groups;
};

export default function BuyFrom10k({ productImage1, productImage }) {
  const buyFrom10kProducts = [
    { image: productImage1, price: "NGN45,000", discount: "-60%" },
    { image: productImage, price: "NGN55,000", discount: "-60%" },
    { image: productImage, price: "NGN85,000", discount: "-70%" },
  ];

  const superDealProducts = [
    { image: productImage1, price: "₦45,000", oldPrice: "₦120,000" },
    { image: productImage, price: "₦45,000", oldPrice: "₦120,000" },
    { image: productImage, price: "₦45,000", oldPrice: "₦120,000" },
  ];

  const buyFrom10kGroups = groupProducts(buyFrom10kProducts, 3);
  const superDealGroups = groupProducts(superDealProducts, 3);
  return (
    <div className="buyFrom10k">
      <section className="buyFrom10k__offer">
        <h1 className="buyFrom10k__offer-title">
          Free <span className="buyFrom10k__shipping">Shipping</span>, 50% off
        </h1>
        <button className="buyFrom10k__offer-label">Shipping</button>
        <span className="buyFrom10k__offer-subtitle">Free Shipping</span>
        {buyFrom10kGroups.map((group, index) => (
          <ProductList
            products={group}
            key={index}
            containerClassName="buyFrom10k__products"
            productClassName="buyFrom10k__product"
            imageClassName="buyFrom10k__productImage"
            priceClassName="buyFrom10k__productPrice"
            discountClassName="buyFrom10k__discount"
            priceContainer="buyFrom10k__priceContainer"
          />
        ))}
      </section>

      <section className="superDeal">
        <h1 className="superDeal__offer-title">
          Super<span className="superDeal__deal">Deal</span>
        </h1>
        <button className="superDeal__offer-label">Limited</button>
        <span className="superDeal__offer-subtitle">Limited Time Offers</span>
        {superDealGroups.map((group, index) => (
          <ProductList
            products={group}
            key={index}
            containerClassName="superDeal__products"
            productClassName="superDeal__product"
            imageClassName="superDeal__productImage"
            priceClassName="superDeal__productPrice"
            oldPriceClassName="superDeal__oldPrice"
          />
        ))}
      </section>
    </div>
  );
}
