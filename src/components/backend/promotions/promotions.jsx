import { useState, useEffect } from "react";
import { toast } from "react-toastify";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const { data: promotion } = await getPromotions();
      setPromotions(promotion);
    } catch (error) {
      setError(error);
      toast.error("Error fetching promotions");
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPromotion = async (promotion) => {
    try {
      await savePromotion(promotion);
      toast.success("Promotion added successfully!");
      fetchPromotions(); // Refetch promotion to update the list
    } catch (error) {
      console.log(error);
      toast.error("Error saving coupon");
    }
  };

  const handleEditPromotion = async (promotionId, updatedPromotion) => {
    try {
      await updatePromotion(promotionId, updatedPromotion);
      toast.success("Promotion updated successfully!");
      fetchPromotions();
      setSelectedPromotion(null);
    } catch (error) {
      console.log(error);
      toast.error("Error updating coupon");
    }
  };

  const handleSelectPromotion = (promotion) => {
    setSelectedPromotion(promotion); // Set promotion for editing
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
          onEditPromotion={handleEditPromotion}
          onAddPromotion={handleAddPromotion}
          selectedPromotion={selectedPromotion}
        />
        <div className="promotionList__main">
          <PromotionList
            promotions={promotions}
            onEdit={handleSelectPromotion}
            onDelete={handleDelete}
            error={error}
            loading={loading}
          />
        </div>
      </div>
    </section>
  );
}
