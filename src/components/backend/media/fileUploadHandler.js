import { uploadFile } from "../../../services/mediaService";

export const handleFileChange = async (
  event,
  setUploadProgress,
  setMediaData,
  setSelectedFiles = null,
  setShowMediaUpload = null,
  setNotification
) => {
  const files = event.target.files;
  try {
    const uploadedFiles = await Promise.all(
      Array.from(files).map((file) =>
        uploadFile(file, (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        })
      )
    );

    const newMediaData = uploadedFiles.map((response) => response.data);

    setMediaData((prevMediaData) => [...prevMediaData, ...newMediaData]); // Update media data state

    if (setSelectedFiles) {
      setSelectedFiles(newMediaData.map((media) => media._id));
    }

    if (setShowMediaUpload) {
      setShowMediaUpload(false);
    }

    setUploadProgress(0);
    setNotification("Upload successful!");

    // Clear file input
    event.target.value = null;
  } catch (error) {
    console.error("Error uploading file:", error);
    setNotification("Error uploading file. Please try again.");
  }

  setTimeout(() => setNotification(""), 3000);
};
