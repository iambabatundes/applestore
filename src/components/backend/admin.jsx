import React, { useState, useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import AdminNavbar from "./adminNavbar";
import Dashboard from "./dashboard";
import CreatePost from "./createPost";
import AllPosts from "./allPosts";
import AddProduct from "./addProduct";
import AllProduct from "./allProducts";
import GeneralSettings from "./generalSettings";
import AppearanceSettings from "./appearanceSettings";
import Upload from "./upload";
import NewMedia from "./newMedia";
import AllPages from "./allPages";
import Profile from "./profile";
import AllUsers from "./allUsers";
import NewPage from "./newPage";
import Updates from "./updates";
import SEO from "./seo";
import Settings from "./settings";
import "./styles/admin.css";
import AdminSidebar from "./adminSidebar";
import ProductEdit from "./productEdit";
import { getBlogPosts } from "../blogPosts";
import AddTags from "./addTags";
import AddCategories from "./categories/addCategory";
import Orders from "./orders";
import Promotion from "./promotion";
import AddPostTags from "./allPosts/addPostTags";
import AddPostCategories from "./allPosts/addPostCategories";
// import { getUploads, uploadFile } from "../../services/mediaService";
// import { handleFileChange } from "./media/fileUploadHandler";

const Admin = ({ companyName, count }) => {
  const [selectedLink, setSelectedLink] = useState(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDropdownLink, setSelectedDropdownLink] = useState(null);
  const [mediaData, setMediaData] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxFileSize, setMaxFileSize] = useState("");
  // const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [mediaSearch, setMediaSearch] = useState("");
  const [blogPosts, setBlogPosts] = useState([]); // Add this state variable
  // const [selectedThumbnail, setSelectedThumbnail] = useState([]);

  // useEffect(() => {
  //   async function fetchMediaData() {
  //     try {
  //       const { data: mediaData } = await getUploads();
  //       setMediaData(mediaData);
  //     } catch (error) {
  //       console.error("Error fetching media data:", error);
  //     }
  //   }

  //   fetchMediaData();
  // }, []);

  const handleFilterChange = (event) => {
    setLoading(true); // Show the loading indicator
    setSelectedFilter(event.target.value);

    setTimeout(() => {
      setLoading(false); // Hide the loading indicator after 2 seconds
    }, 1000);
  };

  const handleDateChange = (event) => {
    setLoading(true); // Show the loading indicator
    setSelectedDate(event.target.value);

    setTimeout(() => {
      setLoading(false); // Hide the loading indicator after 2 seconds
    }, 1000);
  };

  // Filter media based on search input
  const filteredMedia = mediaData.filter(
    (media) =>
      (!selectedFilter || media.fileType === selectedFilter) &&
      (!selectedDate || media.date === selectedDate) &&
      // Add a condition to check if the media's filename includes the search text
      (mediaSearch === "" || media.fileName.includes(mediaSearch))
  );

  const handleSearch = (e) => {
    setMediaSearch(e.target.value);
  };

  const handleToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const sidebarLinks = [
    {
      label: "Dashboard",
      to: "/admin/home",
      content: <Dashboard />,
      icon: "fa-tachometer",
      dropdown: [
        { label: "Home", to: "/admin/home", content: <Dashboard /> },
        { label: "Updates", to: "/admin/updates", content: <Updates /> },
        { label: "SEO", to: "/admin/seo", content: <SEO /> },
        { label: "Promotion", to: "/admin/promotion", content: <Promotion /> },
      ],
    },
    {
      label: "Posts",
      to: "/admin/posts",
      icon: "fa-pencil-square-o",
      content: <AllPosts blogPosts={blogPosts} setBlogPosts={setBlogPosts} />,
      dropdown: [
        {
          label: "All Posts",
          to: "/admin/posts",
          content: (
            <AllPosts blogPosts={blogPosts} setBlogPosts={setBlogPosts} />
          ),
        },
        {
          label: "Create Post",
          to: "/admin/create",
          content: <CreatePost />,
        },
        {
          label: "Categories",
          to: "/admin/posts-categories",
          content: <AddPostCategories />,
        },
        {
          label: "Tags",
          to: "/admin/posts-tags",
          content: <AddPostTags />,
        },
      ],
    },
    {
      label: "Media",
      to: "/admin/upload",
      content: (
        <Upload
          loading={loading}
          setLoading={setLoading}
          // selectedMedia={selectedMedia}
          handleDateChange={handleDateChange}
          handleFilterChange={handleFilterChange}
          selectedDate={selectedDate}
          selectedFilter={selectedFilter}
          filteredMedia={mediaData}
          mediaData={mediaData}
          handleSearch={handleSearch}
          mediaSearch={mediaSearch}
          blogPosts={blogPosts}
        />
      ),
      icon: "fa-tag",
      dropdown: [
        {
          label: "Library",
          to: "/admin/upload",
          content: (
            <Upload
              loading={loading}
              setLoading={setLoading}
              // mediaData={mediaData}
              setMediaData={setMediaData}
              // selectedMedia={selectedMedia}
              maxFileSize={maxFileSize}
              setMaxFileSize={setMaxFileSize}
              handleDateChange={handleDateChange}
              handleFilterChange={handleFilterChange}
              blogPosts={blogPosts}
            />
          ),
        },
        {
          label: "Add New",
          to: "/admin/new-media",
          content: <NewMedia />,
        },
      ],
    },
    {
      label: "Products",
      to: "/admin/all-products",
      content: <AllProduct />,
      icon: "fa-tag",
      dropdown: [
        {
          label: "All Products",
          to: "/admin/all-products",
          content: <AllProduct />,
        },

        {
          label: "Add Product",
          to: "/admin/add-product",
          content: <AddProduct />,
        },
        {
          label: "Categories",
          to: "/admin/add-categories",
          content: <AddCategories />,
        },

        {
          label: "Tags",
          to: "/admin/add-tags",
          content: <AddTags />,
        },
      ],
    },

    {
      label: "Orders",
      to: "/admin/orders", // Corrected URL
      icon: "fa-file",
      content: <Orders />,
      dropdown: [
        {
          label: "All Order",
          to: "/admin/orders", // Set the appropriate URLs
          content: <Orders />, // Use your specific components here
        },
        {
          label: "All Pages",
          to: "/admin/all-pages", // Set the appropriate URLs
          content: <AllPages />, // Use your specific components here
        },
      ],
    },
    {
      label: "Pages",
      to: "/admin/all-pages", // Corrected URL
      icon: "fa-file",
      content: <AllPages />,
      dropdown: [
        {
          label: "All Pages",
          to: "/admin/all-pages", // Set the appropriate URLs
          content: <AllPages />, // Use your specific components here
        },
        {
          label: "Add New",
          to: "/admin/new-page", // Set the appropriate URLs
          content: <NewPage />, // Use your specific components here
        },
      ],
    },
    {
      label: "Users",
      to: "/admin/all-users", // Corrected URL
      icon: "fa-users",
      content: <AllUsers />,
      dropdown: [
        {
          label: "All Users",
          to: "/admin/all-users", // Set the appropriate URLs
          content: <AllUsers />, // Use your specific components here
        },
        {
          label: "Add New",
          to: "/admin/new-user", // Set the appropriate URLs
          content: <NewPage />, // Use your specific components here
        },
        {
          label: "Profile",
          to: "/admin/profile", // Set the appropriate URLs
          content: <Profile />, // Use your specific components here
        },
      ],
    },
    {
      label: "Settings",
      to: "/admin/general", // Corrected URL
      icon: "fa-cog",
      content: <GeneralSettings />,
      dropdown: [
        {
          label: "General Settings",
          to: "/admin/general", // Set the appropriate URLs
          content: <GeneralSettings />, // Use your specific components here
        },
        {
          label: "Appearance",
          to: "/admin/appearance", // Set the appropriate URLs
          content: <AppearanceSettings />, // Use your specific components here
        },
      ],
    },
    // ... other links
  ];

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
          sidebarLinks={sidebarLinks}
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
