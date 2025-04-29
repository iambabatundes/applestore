import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getNotifications } from "../../../services/notificationService";
import { updateUser } from "../../../services/profileService";

export const useAdminNavStore = create(
  persist(
    (set, get) => ({
      currentUser: null,
      profileDetails: null,
      dropdownOpen: false,
      modalOpen: false,
      notifications: [],
      isEditing: false,
      profileImage: null,

      initializeUser(user) {
        set({
          currentUser: user,
          profileDetails: {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            dateOfBirth: user.dateOfBirth,
            address: user.address,
            profileImage: user.profileImage,
          },
        });
      },

      toggleDropdown() {
        set((state) => ({ dropdownOpen: !state.dropdownOpen }));
      },

      toggleModal() {
        set((state) => {
          if (!state.modalOpen && state.currentUser) {
            return {
              modalOpen: true,
              profileDetails: { ...state.currentUser },
            };
          }
          return { modalOpen: !state.modalOpen };
        });
      },

      fetchNotifications: async () => {
        try {
          const { data } = await getNotifications();
          set({ notifications: data });
        } catch (error) {
          console.error("Failed to fetch notifications", error);
        }
      },

      setIsEditing(isEditing) {
        set({ isEditing });
      },

      handleInputChange(name, value) {
        set((state) => ({
          profileDetails: {
            ...state.profileDetails,
            [name]: value,
          },
        }));
      },

      handleProfileImageChange(file) {
        if (
          file &&
          file.size < 2 * 1024 * 1024 &&
          file.type.startsWith("image/")
        ) {
          const preview = URL.createObjectURL(file);
          set((state) => ({
            profileImage: { file, preview },
            profileDetails: {
              ...state.profileDetails,
              profileImage: { file, preview },
            },
          }));
        } else {
          alert("Please select an image file smaller than 2MB.");
        }
      },

      submitProfileUpdate: async () => {
        try {
          const { profileDetails, currentUser } = get();
          const updatedUser = { ...profileDetails };

          if (profileDetails.profileImage && profileDetails.profileImage.file) {
            updatedUser.profileImage = profileDetails.profileImage.file;
          } else {
            delete updatedUser.profileImage;
          }

          const { data } = await updateUser(updatedUser, currentUser._id);
          set({
            currentUser: data,
            profileDetails: data,
            modalOpen: false,
          });
        } catch (error) {
          console.error("Failed to update user profile", error);
        }
      },
    }),
    {
      name: "admin-navbar-store", // localStorage key
      partialize: (state) => ({
        currentUser: state.currentUser,
        profileDetails: state.profileDetails,
      }),
    }
  )
);
