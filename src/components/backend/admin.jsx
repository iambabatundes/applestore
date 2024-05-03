import React, { useState, useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import AdminNavbar from "./adminNavbar";
import AdminSidebar from "./adminSidebar";
import Dashboard from "./dashboard";
import { getMediaDatas } from "./mediaData";
import { getBlogPosts } from "../blogPosts";
import adminSideBarLinks from "./adminSideBarLinks"; // Import the adminSideBarLinks function

const Admin = ({ companyName, count }) => {
  // State variables
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

  // Fetch blog posts and media data on component mount
  useEffect(() => {
    const fetchedPosts = getBlogPosts();
    setBlogPosts(fetchedPosts);
  }, []);

  useEffect(() => {
    setLoading(true);
    const data = getMediaDatas();
    setMediaData(data);
    const dates = [...new Set(data.map((media) => media.date))];
    setUniqueDates(dates);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const maxFileSizeFromServerMB = 2048;
      setMaxFileSize(maxFileSizeFromServerMB);
    }, 1000);
  }, []);

  // Handlers for filter, date, and search
  const handleFilterChange = (event) => {
    setLoading(true);
    setSelectedFilter(event.target.value);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleDateChange = (event) => {
    setLoading(true);
    setSelectedDate(event.target.value);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleSearch = (e) => {
    setMediaSearch(e.target.value);
  };

  // Toggle mobile menu
  const handleToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  // Retrieve sidebar links using adminSideBarLinks function
  const sidebarLinks = adminSideBarLinks({
    blogPosts,
    setBlogPosts,
    mediaData,
    selectedFilter,
    handleFilterChange,
    handleDateChange,
    selectedDate,
    uniqueDates,
    handleSearch,
    mediaSearch,
    // filteredMedia,
    setLoading,
    setMediaData,
    setUniqueDates,
    selectedMedia,
    maxFileSize,
    setMaxFileSize,
    loading,

    // filteredMe,dia
  });

  return (
    <section>
      <AdminNavbar
        companyName={companyName}
        count={count}
        handleToggle={handleToggle}
      />
      <section className="admin-container">
        <AdminSidebar
          isMobileMenuOpen={isMobileMenuOpen}
          selectedLink={selectedLink}
          setSelectedLink={setSelectedLink}
          sidebarLinks={sidebarLinks} // Pass sidebarLinks to AdminSidebar component
          selectedDropdownLink={selectedDropdownLink}
          setSelectedDropdownLink={setSelectedDropdownLink}
        />
        <section className="admin-main-content">
          <Routes>
            <Route path="/admin" element={<Dashboard />} />
            {sidebarLinks.map((link) => (
              <Route key={link.to} path={link.to} element={link.content} />
            ))}
            {sidebarLinks.flatMap((link) =>
              link.dropdown.map((submenu) => (
                <Route
                  key={submenu.to}
                  path={submenu.to}
                  element={submenu.content}
                />
              ))
            )}
          </Routes>
        </section>
      </section>
    </section>
  );
};

export default Admin;
