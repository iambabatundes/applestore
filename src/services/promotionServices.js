import {
  adminHttpService,
  publicHttpService,
  userHttpService,
} from "./http/index.js";

const promotionsPath = "/api/promotions";

function promoUrl(id) {
  return `${promotionsPath}/${id}`;
}

function clearPromotionsCache() {
  adminHttpService.clearCache();
  publicHttpService.clearCache();
}

export async function getActivePromotions() {
  try {
    const response = await publicHttpService.get(`${promotionsPath}/active`);
    clearPromotionsCache();
    return response;
  } catch (err) {
    console.error("Failed to fetch active promotions:", err);
    throw err;
  }
}

export async function getPromotion(promoId) {
  try {
    const { data } = await publicHttpService.get(promoUrl(promoId));
    clearPromotionsCache();
    return data;
  } catch (err) {
    console.error("Failed to fetch promotion:", err);
    throw err;
  }
}

export async function getPromotionsByCategory(categoryId) {
  try {
    const { data } = await publicHttpService.get(
      `${promotionsPath}/category/${categoryId}`
    );
    clearPromotionsCache();
    return data;
  } catch (err) {
    console.error("Failed to fetch promotions by category:", err);
    throw err;
  }
}

// User functions - applying promotions
export async function applyPromotion(promoCode, cartItems = []) {
  try {
    const { data } = await userHttpService.post(`${promotionsPath}/apply`, {
      code: promoCode,
      items: cartItems,
    });
    clearPromotionsCache();
    return data;
  } catch (err) {
    console.error("Failed to apply promotion:", err);
    throw err;
  }
}

export async function validatePromotion(promoCode, userId = null) {
  try {
    const { data } = await userHttpService.post(`${promotionsPath}/validate`, {
      code: promoCode,
      userId,
    });
    clearPromotionsCache();
    return data;
  } catch (err) {
    console.error("Failed to validate promotion:", err);
    throw err;
  }
}

// Admin functions - managing promotions
export async function getPromotions() {
  try {
    const response = await adminHttpService.get(promotionsPath);
    clearPromotionsCache();
    return response.data;
  } catch (err) {
    console.error("Failed to fetch promotions:", err);
    throw err;
  }
}

export async function savePromotion(promo) {
  try {
    const { data } = await adminHttpService.post(promotionsPath, promo);
    clearPromotionsCache();
    return data;
  } catch (err) {
    console.error("Failed to save promotion:", err);
    throw err;
  }
}

export async function updatePromotion(promoId, promo) {
  try {
    const { data } = await adminHttpService.put(promoUrl(promoId), promo);
    clearPromotionsCache();
    return data;
  } catch (err) {
    console.error("Failed to update promotion:", err);
    throw err;
  }
}

export async function deletePromotion(promoId) {
  try {
    const { data } = await adminHttpService.delete(promoUrl(promoId));
    clearPromotionsCache();
    return data;
  } catch (err) {
    console.error("Failed to delete promotion:", err);
    throw err;
  }
}

export async function activatePromotion(promoId) {
  try {
    const { data } = await adminHttpService.post(
      `${promoUrl(promoId)}/activate`
    );
    clearPromotionsCache();
    return data;
  } catch (err) {
    console.error("Failed to activate promotion:", err);
    throw err;
  }
}

export async function deactivatePromotion(promoId) {
  try {
    const { data } = await adminHttpService.post(
      `${promoUrl(promoId)}/deactivate`
    );
    clearPromotionsCache();
    return data;
  } catch (err) {
    console.error("Failed to deactivate promotion:", err);
    throw err;
  }
}

export async function getPromotionStats(promoId) {
  try {
    const { data } = await adminHttpService.get(`${promoUrl(promoId)}/stats`);
    clearPromotionsCache();
    return data;
  } catch (err) {
    console.error("Failed to fetch promotion stats:", err);
    throw err;
  }
}
