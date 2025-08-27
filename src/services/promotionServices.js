import { adminHttpService, httpService } from "../services/httpService";

const apiEndPoint = `${import.meta.env.VITE_API_URL}/api/promotions`;

function promoUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export async function getPromotions() {
  try {
    const { data } = await adminHttpService.get(apiEndPoint);
    return data;
  } catch (err) {
    console.error("Failed to fetch promotions:", err);
    throw err;
  }
}

export async function getPromotion(promoId) {
  try {
    const { data } = await httpService.get(promoUrl(promoId));
    return data;
  } catch (err) {
    console.error("Failed to fetch promotion:", err);
    throw err;
  }
}

export async function savePromotion(promo) {
  try {
    const { data } = await adminHttpService.post(apiEndPoint, promo);
    return data;
  } catch (err) {
    console.error("Failed to save promotion:", err);
    throw err;
  }
}

export async function updatePromotion(promoId, promo) {
  try {
    const { data } = await adminHttpService.put(promoUrl(promoId), promo);
    return data;
  } catch (err) {
    console.error("Failed to update promotion:", err);
    throw err;
  }
}

export async function deletePromotion(promoId) {
  try {
    const { data } = await adminHttpService.delete(promoUrl(promoId));
    return data;
  } catch (err) {
    console.error("Failed to delete promotion:", err);
    throw err;
  }
}
