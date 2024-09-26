import React, { useState, useEffect } from "react";
import PromotionForm from "./common/promotionForm";
import PromotionList from "./common/promotionList";
import "./styles/promotions.css";
import {
  getPromotions,
  deletePromotion,
  savePromotion,
  updatePromotion,
} from "../../../services/promotionServices";

export default function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await getPromotions();
      setPromotions(response.data);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  const handleCreateOrUpdate = async (promotion, resetForm) => {
    try {
      if (promotion._id) {
        await updatePromotion(promotion._id, promotion);
      } else {
        await savePromotion(promotion);
      }
      fetchPromotions(); // Refresh promotions
      resetForm();
    } catch (error) {
      console.error("Error creating/updating promotion:", error);
      if (error.response && error.response.status === 404)
        alert("This promotion can not be created");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePromotion(id);
      fetchPromotions(); // Refresh promotions
    } catch (error) {
      console.error("Error deleting promotion:", error);
    }
  };

  return (
    <section className="promotion-section">
      <h1 className="promotion__heading">Promotions</h1>
      <div className="promotion__main">
        <PromotionForm
          onSubmit={handleCreateOrUpdate}
          selectedPromotion={selectedPromotion}
        />
        <div className="promotionList__main">
          <PromotionList
            promotions={promotions}
            onEdit={setSelectedPromotion}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </section>
  );
}
