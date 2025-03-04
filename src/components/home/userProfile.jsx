import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
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
import { updateUser } from "../../services/profileService";
// import { updateUser } from "../../services/userServices";

export default function UserProfile({ user, setUser, addToCart, cartItems }) {
  const [userData, setUserData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    gender: user.gender,
    dateOfBirth: user.dateOfBirth,
    profileImage: user.profileImage,
    address: {
      addressLine: user.address?.addressLine || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      country: user.address?.country || "",
      postalCode: user.address?.postalCode || "",
    },
  });
  const [profileImage, setProfileImage] = useState(user.profileImage);
  const [greeting, setGreeting] = useState("Good day");
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good morning");
    } else if (currentHour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  const handleProfileImageChange = useCallback((file, preview) => {
    if (file) {
      setProfileImage({ file, preview });
      setUserData((prevState) => ({
        ...prevState,
        profileImage: { file, preview },
      }));
    } else {
      setProfileImage(null);
      setUserData((prevState) => ({
        ...prevState,
        profileImage: null,
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = { ...userData };
      if (userData.profileImage && userData.profileImage.file) {
        updatedUser.profileImage = userData.profileImage.file;
      } else {
        delete updatedUser.profileImage;
      }
      const { data } = await updateUser(updatedUser);
      setUser(data);
      setUserData(data);
      setProfileImage(data.profileImage);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

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
