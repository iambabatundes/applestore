// import { getNotifications } from "../../services/notificationService";
// import { updateUser } from "../../services/profileService";

import { updateUser } from "../../../services/profileService";
import { getNotifications } from "../../../services/notificationService";

export const handleInputChange = (e) => {
  const { name, value } = e.target;
  setProfileDetails((prevData) => ({ ...prevData, [name]: value }));
};

export const handleProfileImageChange = (e) => {
  const file = e.target.files[0];
  if (file && file.size < 2 * 1024 * 1024 && file.type.startsWith("image/")) {
    const preview = URL.createObjectURL(file);
    setProfileImage({ file, preview });
    setProfileDetails((prevState) => ({
      ...prevState,
      profileImage: { file, preview },
    }));
  } else {
    alert("Please select an image file smaller than 2MB.");
  }
};

export const fetchNotification = useCallback(async () => {
  try {
    const { data: notifications } = await getNotifications();
    setNotifications(notifications);
  } catch (error) {
    console.error("Failed to fetch notifications", error);
  }
}, []);

export const toggleDropdown = () => {
  setDropdownOpen(!dropdownOpen);
};

export const toggleModal = () => {
  setModalOpen(!modalOpen);
  if (!modalOpen) setProfileDetails(currentUser); // Reset form data when opening the modal
};

export const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const updatedUser = { ...profileDetails };
    if (profileDetails.profileImage && profileDetails.profileImage.file) {
      updatedUser.profileImage = profileDetails.profileImage.file;
    } else {
      delete updatedUser.profileImage;
    }
    const { data } = await updateUser(updatedUser, currentUser._id);
    setCurrentUser(data);
    setProfileDetails(data);
    toggleModal();
  } catch (error) {
    console.error("Failed to update user profile", error);
  }
};
