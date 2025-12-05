// Separate component for payment method card
const PaymentMethodCard = ({ method, isSelected, onSelect, onDelete }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();

    if (
      !window.confirm("Are you sure you want to remove this payment method?")
    ) {
      return;
    }

    setDeleting(true);
    try {
      await onDelete(method._id);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={`payment-card ${isSelected ? "selected" : ""} ${
        !method.isValid ? "invalid" : ""
      }`}
      onClick={() => method.isValid && onSelect(method)}
    >
      <div className="payment-card-header">
        <label className="payment-radio">
          <input
            type="radio"
            name="payment"
            checked={isSelected}
            onChange={() => onSelect(method)}
            disabled={!method.isValid}
          />
          <span className="radio-checkmark"></span>
        </label>

        <i
          className={`fa ${getPaymentIcon(
            method.type,
            method.card?.brand
          )} payment-icon`}
        ></i>

        {method.isDefault && (
          <span className="badge badge-primary">Default</span>
        )}

        {!method.isValid && <span className="badge badge-danger">Expired</span>}
      </div>

      <div className="payment-content">
        <h3 className="payment-name">{method.displayName}</h3>
        {method.type === "card" && method.card && (
          <>
            <p className="payment-details">
              <span className="card-brand">{method.card.brand}</span>
              {" •••• "}
              {method.card.last4}
            </p>
            <p className="payment-expiry">
              Expires {method.card.expiryMonth}/{method.card.expiryYear}
            </p>
          </>
        )}
      </div>

      <div className="payment-actions">
        <button
          className="btn-link text-danger"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <i className="fa fa-spinner fa-spin"></i>
          ) : (
            <i className="fa fa-trash"></i>
          )}
          {deleting ? " Removing..." : " Remove"}
        </button>
      </div>
    </div>
  );
};
