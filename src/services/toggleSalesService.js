import { adminHttpService } from "../services/httpService";

const apiEndPoint = `${import.meta.env.VITE_API_URL}/api/toggle-sales`;

export async function saveSalePrice(salePrice) {
  try {
    console.log("Saving sale price:", salePrice);
    const { data } = await adminHttpService.post(apiEndPoint, salePrice);
    return data;
  } catch (err) {
    console.error("Failed to save sale price:", err);
    throw err;
  }
}
