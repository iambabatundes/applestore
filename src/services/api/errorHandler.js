import { toast } from "react-toastify";

export const handleApiError = (error, role) => {
  const { response } = error;
  const errorMessage =
    response?.data?.message || response?.data?.details || "An error occurred.";

  if (!response) {
    toast.error(`Network error or timeout: ${errorMessage}`);
    return;
  }

  const status = response.status;

  if (status >= 500) toast.error(`Server error: ${errorMessage}`);
  else if (status === 401) toast.warn("Unauthorized. Please log in.");
  else if (status === 403) toast.warn(`Access denied: ${errorMessage}`);
  else if (status === 404) toast.info(`Resource not found: ${errorMessage}`);
  else if (status === 429) toast.error("Too many requests. Try again later.");
};
