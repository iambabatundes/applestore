import { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useStore } from "zustand";

import "./styles/userProfile.css";
import MyProfile from "./users/myProfile";
import MyOrder from "./users/myOrder";
import MyPayment from "./users/myPayment";
import MyMessages from "./users/myMessages";
import MyAddress from "./users/myAddress";
import MyDashboard from "./users/myDashboard";
import MySettings from "./users/mySettings";
import SidebarLeft from "./users/common/SidebarLeft";
import SidebarRight from "./users/common/SidebarRight";
import TopNavbar from "./users/common/TopNavbar";
import { useUserProfile } from "./users/hooks/useUserProfile";
import { authStore } from "../../services/authService";
import { useCartStore } from "../store/cartStore";

export default function UserProfile() {
  const { user } = useStore(authStore);
  const { cartItems, addToCart } = useCartStore();

  const {
    userData,
    setUserData,
    profileImage,
    setProfileImage,
    loading,
    isEditing,
    setIsEditing,
    greeting,
    handleSubmit,
    handleProfileImageChange,
    contactInfo,
    pendingVerifications,
    setPendingVerifications,
    verificationLoading,
    handleSendVerification,
    handleVerifyContact,
  } = useUserProfile();

  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsLeftSidebarOpen(false);
        setIsRightSidebarOpen(false);
      } else {
        setIsRightSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebars when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsLeftSidebarOpen(false);
    }
  }, [location, isMobile]);

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="userProfile">
      {/* Overlay for mobile */}
      {isMobile && isLeftSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleLeftSidebar} />
      )}

      <div
        className={`user-profile-container ${
          isLeftSidebarOpen ? "left-sidebar-open" : ""
        } ${isRightSidebarOpen ? "right-sidebar-open" : ""}`}
      >
        <SidebarLeft
          isOpen={isLeftSidebarOpen}
          toggleSidebar={toggleLeftSidebar}
          user={user}
          isMobile={isMobile}
        />

        <main className="main-content">
          <TopNavbar
            greeting={greeting}
            user={user}
            toggleLeftSidebar={toggleLeftSidebar}
            toggleRightSidebar={toggleRightSidebar}
            isRightSidebarOpen={isRightSidebarOpen}
          />

          <div className="content-wrapper">
            <Routes location={location}>
              <Route index element={<Navigate to="my-dashboard" replace />} />
              <Route
                path="my-dashboard"
                element={
                  <MyDashboard
                    user={user}
                    cartItems={cartItems}
                    addToCart={addToCart}
                  />
                }
              />
              <Route
                path="my-profile"
                element={
                  <MyProfile
                    user={user}
                    handleSubmit={handleSubmit}
                    profileImage={profileImage}
                    setProfileImage={setProfileImage}
                    userData={userData}
                    setUserData={setUserData}
                    loading={loading}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    handleProfileImageChange={handleProfileImageChange}
                    contactInfo={contactInfo}
                    pendingVerifications={pendingVerifications}
                    handleSendVerification={handleSendVerification}
                    handleVerifyContact={handleVerifyContact}
                    verificationLoading={verificationLoading}
                  />
                }
              />
              <Route path="my-orders" element={<MyOrder user={user} />} />
              <Route path="my-payments" element={<MyPayment user={user} />} />
              <Route path="my-messages" element={<MyMessages user={user} />} />
              <Route path="my-address" element={<MyAddress user={user} />} />
              <Route path="my-settings" element={<MySettings user={user} />} />
            </Routes>
          </div>
        </main>

        {/* <SidebarRight
          isOpen={isRightSidebarOpen}
          toggleSidebar={toggleRightSidebar}
          isMobile={isMobile}
        /> */}
      </div>
    </section>
  );
}
