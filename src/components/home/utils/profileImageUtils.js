export const getProfileImageUrl = (profileImage) => {
  if (!profileImage) {
    return "/default-avatar.png";
  }

  if (profileImage instanceof File) {
    return URL.createObjectURL(profileImage);
  }

  if (profileImage.preview) {
    return profileImage.preview;
  }

  if (profileImage.storageType === "cloudinary" && profileImage.cloudUrl) {
    return profileImage.cloudUrl;
  }

  // Handle local storage - prioritize publicUrl
  if (profileImage.storageType === "local" && profileImage.publicUrl) {
    return profileImage.publicUrl;
  }

  // Fallback for legacy data - extract filename from path
  if (profileImage.localPath) {
    // Extract just the filename from the path
    const filename =
      profileImage.localPath.split("/").pop() ||
      profileImage.localPath.split("\\").pop();
    return `${import.meta.env.VITE_API_URL}/uploads/${filename}`;
  }

  // Final fallback to default
  return "/default-avatar.png";
};
