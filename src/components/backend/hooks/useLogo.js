import { useState, useEffect, useCallback } from "react";
import { getUploads } from "../../../services/logoService";

export const useLogo = (initialLogo = "") => {
  const [logo, setLogo] = useState(initialLogo);
  const [logoData, setLogoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getUploads();
      const data = response?.data || response;

      if (data) {
        setLogoData(data);

        // Get logo URL with all fallbacks
        const logoUrl =
          data.logoImage?.url ||
          data.logoImage?.cloudUrl ||
          data.logoImage?.publicUrl ||
          (data.logoImage?.filename
            ? `${import.meta.env.VITE_API_URL}/uploads/${
                data.logoImage.filename
              }`
            : null);

        if (logoUrl) {
          setLogo(logoUrl);
          // Cache in localStorage for faster subsequent loads
          try {
            localStorage.setItem("cachedLogoUrl", logoUrl);
          } catch (e) {
            console.warn("Could not cache logo URL:", e);
          }
        }
      }
    } catch (err) {
      // 404 is expected if no logo exists
      if (err.response?.status !== 404) {
        console.error("Error fetching logo:", err);
        setError(err);
      }

      // Try to use cached logo if available
      try {
        const cachedLogo = localStorage.getItem("cachedLogoUrl");
        if (cachedLogo) {
          setLogo(cachedLogo);
        }
      } catch (e) {
        console.warn("Could not retrieve cached logo:", e);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchLogo();
  }, [fetchLogo]);

  // Refresh function that can be called manually
  const refreshLogo = useCallback(async () => {
    await fetchLogo();
  }, [fetchLogo]);

  return {
    logo,
    logoData,
    loading,
    error,
    refreshLogo,
    setLogo, // Allow manual logo setting
  };
};
