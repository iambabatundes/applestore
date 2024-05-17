export function convertFileSize(sizeInBytes) {
  const KB_THRESHOLD = 1024; // 1KB = 1024 bytes
  const MB_THRESHOLD = 1024 * 1024; // 1MB = 1024 KB

  if (sizeInBytes < KB_THRESHOLD) {
    // If size is less than 1KB, return size in bytes
    return `${sizeInBytes} bytes`;
  } else if (sizeInBytes < MB_THRESHOLD) {
    // If size is less than 1MB, convert to KB and return
    const sizeInKB = (sizeInBytes / KB_THRESHOLD).toFixed(2);
    return `${sizeInKB} KB`;
  } else {
    // If size is greater than or equal to 1MB, convert to MB and return
    const sizeInMB = (sizeInBytes / MB_THRESHOLD).toFixed(2);
    return `${sizeInMB} MB`;
  }
}

export const generateFileLink = (media) => {
  const siteOrigin = window.location.origin;
  const filename = media.filename; // Use the fileName property instead of dataUrl
  const fileExtension =
    media.fileType === "image"
      ? [".jpg", "png"]
      : media.fileType === "video"
      ? ".mp4"
      : ""; // Adjust based on your file types
  return `${siteOrigin}/admin/upload/${filename}${fileExtension}`;
};
