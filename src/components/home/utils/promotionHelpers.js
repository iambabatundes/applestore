export const specialPromotions = {
  WinterSale: "#007BFF",
  CyberMonday: "#6f42c1",
  HolidaySale: "#28a745",
  BlackFriday: "#343a40",
  FlashSale: "#fd7e14",
};

export const isSpecialPromotion = (name) =>
  Object.keys(specialPromotions).includes(name);
