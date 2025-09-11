import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useStore } from "zustand";

import "./styles/userProfile.css";
import MyProfile from "./users/myProfile";
import MyOrder from "./users/myOrder";
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
  const location = useLocation();

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  return (
    <section className="userProfile">
      <div
        className={`user-profile ${
          isLeftSidebarOpen ? "left-sidebar-open" : ""
        }`}
      >
        <SidebarLeft
          isOpen={isLeftSidebarOpen}
          toggleSidebar={toggleLeftSidebar}
          user={user}
        />
        <main className="main-content">
          <TopNavbar greeting={greeting} user={user} />

          <Routes location={location}>
            <Route
              index
              path="/my-dashboard"
              element={
                <MyDashboard
                  user={user}
                  cartItems={cartItems}
                  addToCart={addToCart}
                />
              }
            />
            <Route
              path="/my-profile"
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
            <Route path="/my-orders" element={<MyOrder />} />
            <Route path="/my-messages" element={<MyMessages />} />
            <Route path="/my-address" element={<MyAddress />} />
            <Route path="/my-settings" element={<MySettings />} />
          </Routes>
        </main>
        <SidebarRight />
      </div>
    </section>
  );
}
