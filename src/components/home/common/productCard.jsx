import React from "react";
import { Link } from "react-router-dom";
import StarRating from "./starRating";
import CartIcon from "./cartIcon";
import "../styles/productCard.css";
import { useAddedToCart } from "./useAddedToCart";
import { formatPrice, formatPermalink } from "./utils";
import ProductImage from "./productImage";

export default function ProductCard({
  item,
  addToCart,
  handleRatingChange,
  cartItems,
  // currency,
  conversionRate,
  productName,
  selectedCurrency,
}) {
  // const { currency, whole, fraction } = formatPrice(item.price);
  const { currency, whole, fraction } = formatPrice(
    item.price,
    selectedCurrency,
    conversionRate
  );
  const [added, setIAdded] = useAddedToCart(item.id, cartItems);

  const handleAddToCart = () => {
    addToCart(item);
    setIAdded(true);
    localStorage.setItem(`added_${item.id}`, "true");
  };

  return (
    <div className={`productCard ${added ? "expanded" : ""}`}>
      <ProductImage src={item.image} alt={item.name} />

      <article className="productCard__content">
        <Link to={`/${formatPermalink(productName.name)}`}>
          <h1 className="productCard__product-name">{item.name}</h1>
        </Link>

        <div className="productCard__rating">
          {item.rating && (
            <StarRating
              rating={item.rating}
              totalStars={5}
              size={15}
              onRatingChange={handleRatingChange}
              initialRating={item.rating}
              readOnly={true}
            />
          )}

          {item.numberOfSales && (
            <span className="productCard__product-sold">
              {item.numberOfSales}
            </span>
          )}
        </div>

        <div className="productCard__price">
          <span className="productCard__salePrice">
            <span className="currency">{currency}</span>
            <span className="whole">{whole}</span>
            <span className="fraction">.{fraction}</span>
          </span>
          {item.originalPrice && (
            <span className="productCard__originalPrice">
              ${item.originalPrice}
            </span>
          )}
        </div>

        {item.superDeal && (
          <div className="productCard__superDeal-main">
            <article className="productCard__superDeal">
              <span className="productCard__super">Super</span>
              <span className="productCard__deal">Deals</span>
            </article>

            <span className="productCard__superDeal-text">
              {item.superDeal}
            </span>
          </div>
        )}

        {item.shipping && (
          <div className="productCard__shipping">
            <span className="productCard__shipping-badge">Shipping</span>
            <span className="productCard__shipping-text">{item.superDeal}</span>
          </div>
        )}

        {item.choice && (
          <article className="productCard__choice">
            <span className="productCard__choice-badge">Choice</span>
            <span className="productCard__choice-text">{item.choice}</span>
          </article>
        )}

        {item.discount && (
          <article className="productCard__discount">
            <span className="productCard__discount-text">
              - {item.discount}
            </span>
          </article>
        )}

        {added ? (
          <div className="productCard__added">
            <i className="fa fa-check-circle productCard-check"></i>
            <article className="productCard__addedtoCart-main">
              <span className="productCard__adding">Added</span>
              <span className="productCard__toCart">to cart</span>
            </article>
          </div>
        ) : (
          <CartIcon
            className="productCard__cartIconProduct"
            onClick={handleAddToCart}
          />
        )}

        {added && cartItems.some((cartItem) => cartItem.id === item.id) && (
          <div className="productCard__cartBtn">
            <Link to="/cart" className="gotoCartBtn productCart__gotoCartBtn">
              <i className="fa fa-shopping-cart"></i> Go to Cart
            </Link>
            <Link to="/checkout" className="productCart__proceedCheckoutBtn">
              Proceed to Checkout
            </Link>
          </div>
        )}
      </article>
    </div>
  );
}
