import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { Login, PageNotFound, Products, Profile, ShoppingCart } from "./pages";

function App() {
  function fizzyBuzzing(n: number) {
    for (let index = 1; index <= n; index++) {
      const divideThree = index % 3;
      const divideFive = index % 5;

      if (divideThree === 0 && divideFive === 0) {
        console.log("fizzbuzz");
      } else if (divideThree === 0 && divideFive !== 0) {
        console.log("fizz");
      } else if (divideThree !== 0 && divideFive === 0) {
        console.log("buzz");
      } else {
        console.log(index);
      }
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* <Route index element={<Login />} /> */}
          <Route index element={<Products />} />
          <Route path="login" element={<Login />} />
          <Route path="products" element={<Products />} />
          <Route path="cart" element={<ShoppingCart />} />
          <Route path="profile" element={<Profile />} />

          {/* Using path="*"" means "match anything", so this route
              acts like a catch-all for URLs that we don't have explicit
              routes for. */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
