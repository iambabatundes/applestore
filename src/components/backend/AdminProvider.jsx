import React, { useState, useEffect, createContext, useContext } from "react";
import { getUploads } from "../../services/mediaService";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [selectedLink, setSelectedLink] = useState(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDropdownLink, setSelectedDropdownLink] = useState(null);
  const [mediaData, setMediaData] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxFileSize, setMaxFileSize] = useState("");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [mediaSearch, setMediaSearch] = useState("");
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    async function fetchMediaData() {
      try {
        const { data: mediaData } = await getUploads();
        setMediaData(mediaData);
      } catch (error) {
        console.error("Error fetching media data:", error);
      }
    }
    fetchMediaData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const maxFileSizeFromServerMB = 2048;
      setMaxFileSize(maxFileSizeFromServerMB);
    }, 1000);
  }, []);

  const handleToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <AdminContext.Provider
      value={{
        selectedLink,
        setSelectedLink,
        isMobileMenuOpen,
        setMobileMenuOpen,
        selectedDropdownLink,
        setSelectedDropdownLink,
        mediaData,
        setMediaData,
        uniqueDates,
        setUniqueDates,
        loading,
        setLoading,
        maxFileSize,
        setMaxFileSize,
        selectedMedia,
        setSelectedMedia,
        selectedFilter,
        setSelectedFilter,
        selectedDate,
        setSelectedDate,
        mediaSearch,
        setMediaSearch,
        blogPosts,
        setBlogPosts,
        handleToggle,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext);
