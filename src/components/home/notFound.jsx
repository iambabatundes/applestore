import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Typography variant="h1" fontSize="2rem" fontWeight={500}>
        404 - Page Not Found
      </Typography>
      {/* <Typography variant="h6" color="textSecondary" mb={3}>
        Page Not Found
      </Typography> */}
      <Typography variant="h6" color="textSecondary" mb={3}>
        Sorry, the page you are looking for does not exist.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGoHome}>
        Go to Homepage
      </Button>
    </Box>
  );
}
