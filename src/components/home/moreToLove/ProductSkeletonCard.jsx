import "./styles/productSkeletonCard.css";

export default function ProductSkeletonCard() {
  return (
    <div className="product-skeleton-card">
      <div className="skeleton-image" />
      <div className="skeleton-text title" />
      <div className="skeleton-text price" />
      <div className="skeleton-text button" />
    </div>
  );
}
