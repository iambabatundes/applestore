import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  CircularProgress,
} from "@mui/material";
import config from "../../../../config.json";

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
}) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const validateAndAddFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    if (file.size > 5242880) {
      setError("File size should not exceed 5MB");
      return;
    }

    setUserData({ ...userData, profileImage: file });
    const fileUrl = URL.createObjectURL(file);
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
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Box
      p={3}
      boxShadow={3}
      borderRadius={2}
      bgcolor="background.paper"
      width="100%"
    >
      <form onSubmit={handleSubmit}>
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
                : user.profileImage
                ? `${config.mediaUrl}/uploads/${user.profileImage.filename}`
                : "/default-avatar.png"
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
        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            id="firstName"
            name="firstName"
            label="First Name"
            value={userData.firstName}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            id="lastName"
            name="lastName"
            label="Last Name"
            value={userData.lastName}
            onChange={handleInputChange}
            margin="normal"
          />
        </Box>
        <TextField
          fullWidth
          id="username"
          name="username"
          label="Username"
          value={userData.username}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          value={userData.email}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          id="phoneNumber"
          name="phoneNumber"
          label="Phone Number"
          value={userData.phoneNumber}
          onChange={handleInputChange}
          margin="normal"
        />
        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            id="gender"
            name="gender"
            label="Gender"
            value={userData.gender}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            id="dateOfBirth"
            name="dateOfBirth"
            label="Date Of Birth"
            type="date"
            value={userData.dateOfBirth}
            onChange={handleInputChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
          <Button color="secondary" variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
}
