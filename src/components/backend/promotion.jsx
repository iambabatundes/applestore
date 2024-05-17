import React, { useState, useEffect } from "react";
import "../backend/promotions/styles/promotion.css";
import { saveSalePrice } from "../../services/toggleSalesService";

export default function Promotion() {
  const [toggleSale, setToggleSale] = useState([]);
  const [enableSale, setEnableSale] = useState(false);
  const [salePrice, setSalePrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchToggleSale() {
      try {
        const { data: toggleSale } = await saveSalePrice();
        setToggleSale(toggleSale);
      } catch (error) {
        console.error("Error fetching toggle sale:", error);
        setError("Failed to fetch toggle sale data.");
      }
    }

    fetchToggleSale();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await saveSalePrice({
        enableSale,
        salePrice: enableSale ? salePrice : null,
        startDate: enableSale ? startDate : null,
        endDate: enableSale ? endDate : null,
      });
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        const data = await response.json();
        setError(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error toggling sale:", error);
      setError("Something went wrong. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <section className="promotion-main">
      <section className="promotion-container">
        <form onSubmit={handleSubmit} className="promotion-form">
          <article className="promotion-content">
            <h4>Toggle Sale</h4>
            <label>
              <input
                type="checkbox"
                checked={enableSale}
                onChange={(e) => setEnableSale(e.target.checked)}
              />
              Enable Sale
            </label>
            {enableSale && (
              <>
                <label>
                  Sale Price:
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                  />
                </label>
                <label>
                  Start Date:
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </label>
                <label>
                  End Date:
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </label>
              </>
            )}
            <button className="promotion__btn" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Submit"}
            </button>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
          </article>
        </form>
      </section>
    </section>
  );
}
