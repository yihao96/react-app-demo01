import { FormatListBulleted, Person, ShoppingCart } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import { StyledBadge } from "../components";

const MainLayout = (): JSX.Element => {
  const { token, cart } = useContext(Context);

  const navigate = useNavigate();

  const [value, setValue] = useState<string | undefined>("products");

  useEffect(() => {
    setValue(getCurrentPath);
  }, []);

  const getCurrentPath = () => {
    const currentPath = window.location.pathname;
    console.log("currentPath:", currentPath);

    switch (currentPath) {
      case "/":
        return "products";
      case "/products":
        return "products";
      case "/cart":
        return "cart";
      case "/profile":
        return "profile";
      default:
        return "products";
    }
  };

  return (
    <div>
      <Outlet />
      {token !== undefined && token !== "" && (
        <Paper
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction
              label="Products"
              value="products"
              icon={<FormatListBulleted />}
              onClick={() => navigate("products")}
            />
            <BottomNavigationAction
              label="Cart"
              value="cart"
              icon={
                <StyledBadge badgeContent={cart?.length} color="warning">
                  <ShoppingCart />
                </StyledBadge>
              }
              onClick={() => navigate("cart")}
            />
            <BottomNavigationAction
              label="Account"
              value="profile"
              icon={<Person />}
              onClick={() => navigate("profile")}
            />
          </BottomNavigation>
        </Paper>
      )}
    </div>
  );
};

export default MainLayout;
