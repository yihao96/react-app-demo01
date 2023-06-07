import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { Context } from "../context/Context";

const Profile = (): JSX.Element => {
  const navigate = useNavigate();

  const { setUser, token, setToken } = useContext(Context);

  useEffect(() => {
    if (token === undefined || token === "") {
      navigate("/login");
    }
  }, [navigate, token]);

  const handleLogout = () => {
    setUser(undefined);
    setToken(undefined);
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: 2,
        }}
      >
        <Typography component="p" variant="h5">
          Profile
        </Typography>
        <Button
          fullWidth
          color="error"
          type="submit"
          variant="contained"
          sx={{ my: 2 }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;
