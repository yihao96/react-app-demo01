import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios, { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { Context } from "../context/Context";
import { UserCreds, UserLoginCreds } from "../types/Users";
import { ApiBaseData } from "../types/ApiBaseData";

const Login = (): JSX.Element => {
  const navigate = useNavigate();

  const { setUser, token, setToken, apiUrl } = useContext(Context);

  const [error, setError] = useState<AxiosError>();

  useEffect(() => {
    if (token !== undefined && token !== "") {
      navigate("/");
    }
  }, [navigate, token]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    var loginData: UserLoginCreds = {
      username: data.get("username"),
      password: data.get("password"),
    };

    setError(undefined);

    axios({
      method: "POST",
      url: `${apiUrl}auth/login`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(loginData),
    })
      .then((response: AxiosResponse) => {
        var userCreds: UserCreds = response.data;
        console.log(userCreds);

        setUser(userCreds);
        setToken(userCreds.token);
        Cookies.set("token", userCreds.token);
      })
      .catch((error: AxiosError) => {
        console.log(error);
        setError(error);
      });
  };

  const handleErrorMsg = (resp: AxiosResponse | undefined) => {
    var apiResp: ApiBaseData = resp?.data;
    return apiResp.message;
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={10} sx={{ p: 2, my: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              required
              id="username"
              name="username"
              label="Username"
              margin="normal"
              placeholder="Enter username"
              variant="outlined"
            />
            <TextField
              fullWidth
              required
              id="password"
              name="password"
              label="Password"
              margin="normal"
              placeholder="Enter password"
              type="password"
              variant="outlined"
            />
            <Button
              fullWidth
              color="primary"
              type="submit"
              variant="contained"
              sx={{ my: 2 }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Paper>
      {error ? (
        <Alert severity="error">
          <AlertTitle>{error.code}</AlertTitle>
          {handleErrorMsg(error.response)}
        </Alert>
      ) : null}
    </Container>
  );
};

export default Login;
