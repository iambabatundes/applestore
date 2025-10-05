import { getUploads } from "../services/logoService";

const fetchLogo = async (setLogoImage) => {
  try {
    const response = await getUploads();

    const logoData = response?.data || response;

    if (!logoData) {
      console.log("No logo data found");
      return null;
    }

    const logoUrl =
      logoData.logoImage?.url ||
      logoData.logoImage?.cloudUrl ||
      logoData.logoImage?.publicUrl ||
      (logoData.logoImage?.filename
        ? `${import.meta.env.VITE_API_URL}/uploads/${
            logoData.logoImage.filename
          }`
        : null);

    if (logoUrl) {
      console.log("Logo fetched successfully:", logoUrl);
      if (setLogoImage) {
        setLogoImage(logoUrl);
      }
      return logoUrl;
    } else {
      console.log("Logo data exists but no valid URL found");
      return null;
    }
  } catch (error) {
    if (error.response?.status === 404) {
      console.log("No logo uploaded yet");
    } else {
      console.error("Error fetching logo:", error);
    }
    return null;
  }
};

export default fetchLogo;
