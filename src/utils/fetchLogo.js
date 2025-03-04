import { getUploads } from "../services/logoService";

const fetchLogo = async (setLogoImage) => {
  try {
    const { data } = await getUploads();
    if (data?.logoImage) {
      setLogoImage(
        `${import.meta.env.VITE_API_URL}/uploads/${data.logoImage.filename}`
      );
    }
  } catch (error) {
    console.error("Error fetching logo:", error);
  }
};

export default fetchLogo;
