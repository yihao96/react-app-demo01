import React, { useContext, useEffect } from "react";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { formatNumber } from "../utils/Formatter";
import { Delete } from "@mui/icons-material";
import { Product } from "../types/Products";

const ShoppingCart = (): JSX.Element => {
  const { token, cart, setCart } = useContext(Context);

  const navigate = useNavigate();

  useEffect(() => {
    if (token === undefined || token === "") {
      navigate("/login");
    }
  }, [navigate, token]);

  const handleDeleteFromCart = (product: Product) =>
    setCart(cart?.filter((item) => item.id !== product.id));

  const renderCartList = () => (
    <List sx={{ width: "100%" }}>
      {cart !== undefined ? (
        cart.map((item, index) => (
          <>
            <ListItem
              key={item.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => handleDeleteFromCart(item)}
                >
                  <Delete />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar
                  alt={item.id.toString()}
                  src={item.thumbnail}
                  variant="rounded"
                  sx={{ width: 80, height: 80, mr: 2 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography noWrap>{item.title}</Typography>}
                secondary={
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ textDecoration: "line-through", color: "gray" }}
                    >
                      ${formatNumber(item.price, 2)}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                      columnGap={1}
                    >
                      <Typography variant="body2" sx={{ color: "red" }}>
                        ${formatNumber(item.discountedPrice, 2)}
                      </Typography>
                      <Typography variant="subtitle2">
                        {formatNumber(item.discountPercentage)}% off
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </ListItem>
            <Divider variant="fullWidth" />
          </>
        ))
      ) : (
        <Typography>Cart is empty!</Typography>
      )}
    </List>
  );

  return (
    <Container maxWidth="xs">
      <Typography component="h1" variant="h5" my={1}>
        Cart
      </Typography>
      <Box mb={8}>{renderCartList()}</Box>
    </Container>
  );
};

export default ShoppingCart;
