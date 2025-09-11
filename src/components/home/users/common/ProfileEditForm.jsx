import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  MenuItem,
} from "@mui/material";

import { getProfileImageUrl } from "../../../home/utils/profileImageUtils";

export default function ProfileEditForm({
  user,
  handleSubmit,
  onCancel,
  userData,
  setUserData,
  profileImage,
  setProfileImage,
  loading,
  handleProfileImageChange,
  contactInfo,
  pendingVerifications = [],
  handleSendVerification,
  verificationLoading,
}) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(null);

  const validateAndAddFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    if (file.size > 5242880) {
      setError("File size should not exceed 5MB");
      return;
    }
    const fileUrl = URL.createObjectURL(file);
    setUserData((prev) => ({
      ...prev,
      profileImage: { file, preview: fileUrl },
    }));
    setProfileImage({ file, preview: fileUrl });
    handleProfileImageChange(file, fileUrl);
    setError("");
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setUserData((prevFormData) => ({
        ...prevFormData,
        address: {
          ...prevFormData.address,
          [addressField]: value,
        },
      }));
    } else {
      setUserData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleVerificationRequest = async (contactType) => {
    try {
      await handleSendVerification(contactType);
      setShowVerificationInput(contactType);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const getContactDisplayInfo = () => {
    if (!contactInfo) return null;

    const { primaryContact, secondaryContact } = contactInfo;
    return { primaryContact, secondaryContact };
  };

  const contactDisplayInfo = getContactDisplayInfo();

  return (
    <Box
      p={3}
      boxShadow={3}
      borderRadius={2}
      bgcolor="background.paper"
      width="100%"
    >
      <form onSubmit={handleSubmit}>
        {/* Profile Image Section */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mb={2}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          border={dragging ? "2px dashed #1976d2" : "2px dashed #ccc"}
          p={2}
          borderRadius={2}
          textAlign="center"
        >
          <Avatar
            src={
              profileImage && profileImage.preview
                ? profileImage.preview
                : getProfileImageUrl(user.profileImage)
            }
            alt={`${user.firstName} ${user.lastName}`}
            sx={{ width: 100, height: 100, mb: 2 }}
          />

          <input
            accept="image/*"
            id="profileImage"
            type="file"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <label htmlFor="profileImage">
            <Button variant="contained" component="span">
              Change Profile Image
            </Button>
          </label>
          <Typography variant="body2" color="textSecondary" mt={1}>
            or drag and drop an image here
          </Typography>
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
        </Box>

        {/* Contact Information Alerts */}
        {contactDisplayInfo && (
          <Box mb={2}>
            <Alert severity="info" sx={{ mb: 1 }}>
              <Typography variant="body2">
                <strong>Primary Contact:</strong>{" "}
                {contactDisplayInfo.primaryContact.type} -{" "}
                {contactDisplayInfo.primaryContact.value}
                <br />
                {contactDisplayInfo.primaryContact.note}
              </Typography>
            </Alert>

            {contactDisplayInfo.secondaryContact && (
              <Alert
                severity={
                  contactDisplayInfo.secondaryContact.verified
                    ? "success"
                    : "warning"
                }
                sx={{ mb: 1 }}
              >
                <Typography variant="body2">
                  <strong>Secondary Contact:</strong>{" "}
                  {contactDisplayInfo.secondaryContact.type} -{" "}
                  {contactDisplayInfo.secondaryContact.value}
                  <br />
                  {contactDisplayInfo.secondaryContact.note}
                </Typography>
              </Alert>
            )}
          </Box>
        )}

        {/* Pending Verifications */}
        {pendingVerifications.length > 0 && (
          <Box mb={2}>
            <Typography variant="h6" mb={1}>
              Pending Verifications
            </Typography>
            <Stack spacing={1}>
              {pendingVerifications.map((verification) => (
                <Alert key={verification.type} severity="warning">
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                  >
                    <Typography variant="body2">
                      {verification.message}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        handleVerificationRequest(verification.type)
                      }
                      disabled={verificationLoading}
                    >
                      {verification.buttonText || `Verify ${verification.type}`}
                    </Button>
                  </Box>
                </Alert>
              ))}
            </Stack>
          </Box>
        )}

        {/* Basic Information */}
        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            id="firstName"
            name="firstName"
            label="First Name"
            value={userData.firstName || ""}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            id="lastName"
            name="lastName"
            label="Last Name"
            value={userData.lastName || ""}
            onChange={handleInputChange}
            margin="normal"
          />
        </Box>

        <TextField
          fullWidth
          id="username"
          name="username"
          label="Username"
          value={userData.username || ""}
          onChange={handleInputChange}
          margin="normal"
        />

        {/* Contact Information with Restrictions */}
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          value={userData.email || ""}
          onChange={handleInputChange}
          margin="normal"
          disabled={contactDisplayInfo?.primaryContact?.type === "email"}
          helperText={
            contactDisplayInfo?.primaryContact?.type === "email"
              ? "Primary email cannot be changed"
              : "You can add an email as secondary contact"
          }
        />

        <TextField
          fullWidth
          id="phoneNumber"
          name="phoneNumber"
          label="Phone Number"
          value={userData.phoneNumber || ""}
          onChange={handleInputChange}
          margin="normal"
          disabled={contactDisplayInfo?.primaryContact?.type === "phone"}
          helperText={
            contactDisplayInfo?.primaryContact?.type === "phone"
              ? "Primary phone number cannot be changed"
              : "You can add a phone number as secondary contact"
          }
        />

        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            id="gender"
            name="gender"
            label="Gender"
            select
            value={userData.gender || ""}
            onChange={handleInputChange}
            margin="normal"
          >
            <MenuItem value="">Prefer not to say</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>
          <TextField
            fullWidth
            id="dateOfBirth"
            name="dateOfBirth"
            label="Date Of Birth"
            type="date"
            value={userData.dateOfBirth || ""}
            onChange={handleInputChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>

        {/* Address Section */}
        <Typography variant="h6" mt={2} mb={1}>
          Address
        </Typography>

        <TextField
          fullWidth
          id="address"
          name="address.addressLine"
          label="Address Line"
          value={userData.address?.addressLine || ""}
          onChange={handleInputChange}
          margin="normal"
        />

        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            id="city"
            name="address.city"
            label="City"
            value={userData.address?.city || ""}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            id="state"
            name="address.state"
            label="State"
            value={userData.address?.state || ""}
            onChange={handleInputChange}
            margin="normal"
          />
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            id="country"
            name="address.country"
            label="Country"
            value={userData.address?.country || ""}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            id="postalCode"
            name="address.postalCode"
            label="Postal Code"
            value={userData.address?.postalCode || ""}
            onChange={handleInputChange}
            margin="normal"
          />
        </Box>

        {/* Form Actions */}
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
          <Button color="secondary" variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
}
