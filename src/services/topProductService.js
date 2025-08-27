import { publicHttpService } from "../services/httpService";

const apiEndPoint = `${import.meta.env.VITE_API_URL}/api/top-products`;

export function getTopProducts() {
  return publicHttpService.get(`${apiEndPoint}`);
}
