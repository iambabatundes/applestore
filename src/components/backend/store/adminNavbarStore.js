import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getNotifications } from "../../../services/notificationService";
import {
  updateAdminProfile,
  getAdminProfile,
} from "../../../services/adminProfileService";

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
      isSubmitting: false,
      errors: {},
      successMessage: null,
      isLoadingProfile: false,

      // Fetch profile from backend
      fetchProfile: async () => {
        set({ isLoadingProfile: true });
        try {
          const response = await getAdminProfile();
          const admin = response.data?.admin || response.admin;

          if (admin) {
            // FIXED: Explicitly extract and set profileImage
            const profileImageData = extractProfileImage(admin);

            set({
              currentUser: admin,
              profileDetails: {
                firstName: admin.firstName || "",
                lastName: admin.lastName || "",
                email: admin.email || "",
                phoneNumber: admin.phoneNumber || "",
                dateOfBirth: admin.dateOfBirth
                  ? admin.dateOfBirth.split("T")[0]
                  : "",
                gender: admin.gender || "Male",
              },
              profileImage: profileImageData, // CRITICAL: Set this here
              errors: {},
              successMessage: null,
            });
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        } finally {
          set({ isLoadingProfile: false });
        }
      },

      // Initialize user from props or stored data
      initializeUser(user) {
        const profileImageData = extractProfileImage(user);

        set({
          currentUser: user,
          profileDetails: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            phoneNumber: user?.phoneNumber || "",
            dateOfBirth: user?.dateOfBirth
              ? user.dateOfBirth.split("T")[0]
              : "",
            gender: user?.gender || "Male",
          },
          profileImage: profileImageData,
          errors: {},
          successMessage: null,
        });
      },

      toggleDropdown() {
        set((state) => ({ dropdownOpen: !state.dropdownOpen }));
      },

      toggleModal() {
        set((state) => {
          if (!state.modalOpen && state.currentUser) {
            const profileImageData = extractProfileImage(state.currentUser);

            return {
              modalOpen: true,
              profileDetails: {
                firstName: state.currentUser.firstName || "",
                lastName: state.currentUser.lastName || "",
                email: state.currentUser.email || "",
                phoneNumber: state.currentUser.phoneNumber || "",
                dateOfBirth: state.currentUser.dateOfBirth
                  ? state.currentUser.dateOfBirth.split("T")[0]
                  : "",
                gender: state.currentUser.gender || "Male",
              },
              profileImage: profileImageData,
              isEditing: false,
              errors: {},
              successMessage: null,
            };
          }
          return {
            modalOpen: !state.modalOpen,
            isEditing: false,
            errors: {},
            successMessage: null,
          };
        });
      },

      fetchNotifications: async () => {
        try {
          const response = await getNotifications();
          const notificationsData = response?.data || response || [];
          set({
            notifications: Array.isArray(notificationsData)
              ? notificationsData
              : [],
          });
        } catch (error) {
          console.error("Failed to fetch notifications", error);
          set({ notifications: [] });
        }
      },

      setIsEditing(isEditing) {
        set({
          isEditing,
          errors: {},
          successMessage: null,
        });
      },

      handleInputChange(name, value) {
        set((state) => ({
          profileDetails: {
            ...state.profileDetails,
            [name]: value,
          },
          errors: {
            ...state.errors,
            [name]: null,
          },
        }));
      },

      handleProfileImageChange(file) {
        if (!file) {
          const currentUserImage = extractProfileImage(get().currentUser);
          set({ profileImage: currentUserImage });
          return;
        }

        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
        ];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
          set({
            errors: {
              profileImage: "Only JPEG, PNG, WebP, and GIF images are allowed",
            },
          });
          return;
        }

        if (file.size > maxSize) {
          set({
            errors: {
              profileImage: "Image size must be less than 5MB",
            },
          });
          return;
        }

        const preview = URL.createObjectURL(file);
        set({
          profileImage: { file, preview },
          errors: { ...get().errors, profileImage: null },
        });
      },

      validateForm() {
        const { profileDetails } = get();
        const errors = {};

        if (!profileDetails.firstName?.trim()) {
          errors.firstName = "First name is required";
        } else if (profileDetails.firstName.length < 2) {
          errors.firstName = "First name must be at least 2 characters";
        } else if (profileDetails.firstName.length > 50) {
          errors.firstName = "First name must not exceed 50 characters";
        }

        if (!profileDetails.lastName?.trim()) {
          errors.lastName = "Last name is required";
        } else if (profileDetails.lastName.length < 2) {
          errors.lastName = "Last name must be at least 2 characters";
        } else if (profileDetails.lastName.length > 50) {
          errors.lastName = "Last name must not exceed 50 characters";
        }

        if (!profileDetails.email?.trim()) {
          errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileDetails.email)) {
          errors.email = "Invalid email format";
        }

        if (
          profileDetails.phoneNumber &&
          !/^\+?[\d\s\-()]+$/.test(profileDetails.phoneNumber)
        ) {
          errors.phoneNumber = "Invalid phone number format";
        }

        if (profileDetails.dateOfBirth) {
          const birthDate = new Date(profileDetails.dateOfBirth);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();

          if (age < 13) {
            errors.dateOfBirth = "Must be at least 13 years old";
          }
        }

        set({ errors });
        return Object.keys(errors).length === 0;
      },

      submitProfileUpdate: async () => {
        const { profileDetails, profileImage, currentUser, validateForm } =
          get();

        if (!validateForm()) {
          return { success: false, error: "Please fix validation errors" };
        }

        set({ isSubmitting: true, errors: {}, successMessage: null });

        try {
          const updateData = {
            ...profileDetails,
            adminProfileImage: profileImage,
          };

          const response = await updateAdminProfile(
            updateData,
            currentUser._id
          );
          const updatedAdmin = response.data?.admin || response.admin;

          const updatedProfileImage = extractProfileImage(updatedAdmin);

          set({
            currentUser: updatedAdmin,
            profileDetails: {
              firstName: updatedAdmin.firstName,
              lastName: updatedAdmin.lastName,
              email: updatedAdmin.email,
              phoneNumber: updatedAdmin.phoneNumber || "",
              dateOfBirth: updatedAdmin.dateOfBirth
                ? updatedAdmin.dateOfBirth.split("T")[0]
                : "",
              gender: updatedAdmin.gender || "Male",
            },
            profileImage: updatedProfileImage,
            modalOpen: false,
            isEditing: false,
            isSubmitting: false,
            successMessage: "Profile updated successfully!",
          });

          setTimeout(() => {
            set({ successMessage: null });
          }, 5000);

          return { success: true, data: updatedAdmin };
        } catch (error) {
          console.error("Failed to update user profile", error);

          const errorMessage = error.message || "Failed to update profile";
          const fieldErrors = {};

          if (error.errors && Array.isArray(error.errors)) {
            error.errors.forEach((err) => {
              if (typeof err === "string") {
                const fieldMatch = err.match(/^(\w+):/);
                if (fieldMatch) {
                  fieldErrors[fieldMatch[1]] = err;
                } else {
                  fieldErrors.general = err;
                }
              }
            });
          } else {
            fieldErrors.general = errorMessage;
          }

          set({
            isSubmitting: false,
            errors: fieldErrors,
          });

          return { success: false, error: errorMessage };
        }
      },
    }),
    {
      name: "admin-navbar-store",
      partialize: (state) => ({
        currentUser: state.currentUser,
        profileDetails: state.profileDetails,
        profileImage: state.profileImage,
        notifications: state.notifications,
      }),
    }
  )
);

function extractProfileImage(user) {
  if (!user?.adminProfileImage) return null;

  const img = user.adminProfileImage;

  return {
    url: img.url || null,
    filename: img.filename || null,
    storageType: img.storageType || "local",
    _id: img._id || null,
  };
}
