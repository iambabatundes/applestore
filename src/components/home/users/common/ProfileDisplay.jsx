import React from "react";
import { Avatar, Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import config from "../../../../config.json";

export default function ProfileDisplay({ user, onEdit }) {
  return (
    <Box
      p={3}
      boxShadow={3}
      borderRadius={2}
      bgcolor="background.paper"
      marginBottom={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={3}
      position="relative"
      width="100%"
      fontSize="1rem"
    >
      <IconButton
        onClick={onEdit}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
        }}
      >
        <EditIcon fontSize="0.9em" />
      </IconButton>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
      >
        <Avatar
          src={
            user.profileImage instanceof File
              ? URL.createObjectURL(user.profileImage)
              : user.profileImage
              ? `${config.mediaUrl}/uploads/${user.profileImage?.filename}`
              : "/default-avatar.png"
          }
          alt={`${user.firstName} ${user.lastName}`}
          sx={{ width: 100, height: 100 }}
        />

        <Typography variant="h1" mt={2} fontSize="1.5rem" fontWeight={500}>
          {user.firstName} {user.lastName}
        </Typography>
        <Typography
          variant="h2"
          color="textSecondary"
          fontSize="1.2rem"
          fontWeight={300}
        >
          {user.username}
        </Typography>
      </Box>
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        gap={2}
        mt={2}
        borderBottom="1px solid #e0e0e0"
        pb={2}
      >
        <Typography variant="body1" color="textSecondary">
          <strong>Phone Number:</strong> {user.phoneNumber}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Email:</strong> {user.email}
        </Typography>
        <Box display="flex" gap={2}>
          <Typography variant="body1" color="textSecondary">
            <strong>Gender:</strong> {user.gender}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Date of Birth:</strong>{" "}
            {user.dateOfBirth
              ? new Date(user.dateOfBirth).toLocaleDateString()
              : "N/A"}
          </Typography>
        </Box>
        <Typography variant="body1" color="textSecondary">
          <strong>Address:</strong>{" "}
          {/* {user.address
            ? `${user.address.address}, 
            ${user.address.state}, ${user.address.country}, 
            ${user.address.zipCode}`
            : "N/A"} */}
          {user.address}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Role:</strong> {user.role}
        </Typography>
      </Box>
    </Box>
  );
}
