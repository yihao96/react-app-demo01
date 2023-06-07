import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AlertColor,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Container,
  FormControl,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  InputLabel,
  MenuItem,
  Modal,
  Pagination,
  Rating,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Product } from "../types/Products";
import { GetProductResp } from "../types/ApiResponse";
import { formatNumber } from "../utils/Formatter";
import { AddShoppingCart, Close, Search } from "@mui/icons-material";

type SortBy =
  | "none"
  | "price-asc"
  | "price-dsc"
  | "name-asc"
  | "name-dsc"
  | "rating-asc"
  | "rating-dsc";

interface SortOption {
  value: SortBy;
  label: string;
}

const SortOptions: SortOption[] = [
  {
    value: "none",
    label: "None",
  },
  {
    value: "price-asc",
    label: "Price: Low to High",
  },
  {
    value: "price-dsc",
    label: "Price: High to Low",
  },
  {
    value: "name-asc",
    label: "Name: A - Z",
  },
  {
    value: "name-dsc",
    label: "Name: Z - A",
  },
  {
    value: "rating-dsc",
    label: "Rating: High to Low",
  },
  {
    value: "rating-asc",
    label: "Rating: Low to High",
  },
];

const Products = (): JSX.Element => {
  const { token, apiUrl, cart, setCart } = useContext(Context);

  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>();
  const [productsDisc, setProductsDisc] = useState<Product[]>();
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);

  const [selectedSort, setSelectedSort] = useState<SortBy>("none");

  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState<string>();
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");

  const limit = 10;

  useEffect(() => {
    if (token === undefined || token === "") {
      navigate("/login");
    }

    handleGetProducts();
  }, [navigate, token]);

  const handleGetProducts = (skip: number = 0) => {
    axios({
      method: "GET",
      url: `${apiUrl}products`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        limit: limit,
        skip: skip,
      },
    })
      .then((response: AxiosResponse) => {
        setSelectedSort("none");

        var resp: GetProductResp = response.data;
        var prods: Product[] = resp.products;

        var updatedProds: Product[] = [];

        prods.forEach((element) => {
          element.discountedPrice =
            element.price - element.price * (element.discountPercentage / 100);

          updatedProds.push(element);
        });

        setProducts(updatedProds);
        setTotalProducts(resp.total);

        console.log(prods);
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  const handleSearchProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    var searchKeyword = data.get("search");

    axios({
      method: "GET",
      url: `${apiUrl}products/search`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        q: searchKeyword,
      },
    })
      .then((response: AxiosResponse) => {
        setSelectedSort("none");

        var resp: GetProductResp = response.data;
        var prods: Product[] = resp.products;

        var updatedProds: Product[] = [];

        prods.forEach((element) => {
          element.discountedPrice =
            element.price - element.price * (element.discountPercentage / 100);

          updatedProds.push(element);
        });

        setProducts(updatedProds);
        setTotalProducts(resp.total);

        console.log(resp);
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  const handleSorting = (event: SelectChangeEvent) => {
    var sort = event.target.value as SortBy;
    setSelectedSort(sort);

    if (products !== undefined) {
      const sorted = [...products];

      switch (sort) {
        case "price-dsc":
          sorted.sort((a, b) =>
            a.discountedPrice !== undefined && b.discountedPrice !== undefined
              ? b.discountedPrice - a.discountedPrice
              : b.price - a.price
          );
          break;
        case "price-asc":
          sorted.sort((a, b) =>
            a.discountedPrice !== undefined && b.discountedPrice !== undefined
              ? a.discountedPrice - b.discountedPrice
              : a.price - b.price
          );
          break;
        case "name-dsc":
          sorted.sort((a, b) => {
            let x = a.title.toLowerCase();
            let y = b.title.toLowerCase();

            return x > y ? -1 : x < y ? 1 : 0;
          });
          break;
        case "name-asc":
          sorted.sort((a, b) => {
            let x = a.title.toLowerCase();
            let y = b.title.toLowerCase();

            return x < y ? -1 : x > y ? 1 : 0;
          });
          break;
        case "rating-dsc":
          sorted.sort((a, b) => b.rating - a.rating);
          break;
        case "rating-asc":
          sorted.sort((a, b) => a.rating - b.rating);
          break;
        default:
          sorted.sort((a, b) => a.id - b.id);
      }

      setProducts(sorted);
    }
  };

  const handleAddToCart = (product?: Product) => {
    if (cart !== undefined && product !== undefined) {
      var item = cart.find(({ id }) => id === product.id);
      if (item == null) {
        setCart([...cart, product]);
        handleShowSnackbar("Added to cart", "success");
      } else {
        handleShowSnackbar("Item already in cart!", "warning");
      }
    } else if (cart === undefined && product !== undefined) {
      setCart([product]);
      handleShowSnackbar("Added to cart", "success");
    }
  };

  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    console.log(value);
    setPage(value);
    handleGetProducts((value - 1) * 10);
  };

  const getTotalPage = () => {
    var totalPages = totalProducts / limit;
    return totalPages >= 1 ? totalPages : 1;
  };

  const getTotalPageStatus = () => (totalProducts >= 10 ? false : true);

  const handleCloseModal = () => {
    setShowProductDetail(false);
    setSelectedProduct(undefined);
  };

  const handleShowSnackbar = (msg: string, severity: AlertColor) => {
    setSnackbarMsg(msg);
    setAlertSeverity(severity);
    setShowSnackbar(true);
  };

  const handleCloseSnackbar = () => setShowSnackbar(false);

  const renderSortMenu = () => (
    <FormControl fullWidth size="small" variant="standard">
      <InputLabel>Sort</InputLabel>
      <Select value={selectedSort} label="Sort" onChange={handleSorting}>
        {SortOptions.map((option, index) => (
          <MenuItem value={option.value}>{option.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderProducts = () => {
    return (
      <>
        <Grid container spacing={1} mb={2}>
          {products !== undefined ? (
            products.map((obj, index) => (
              <Grid item key={index} xs={6}>
                <Card
                  onClick={() => {
                    // console.log("onClick:", obj);
                  }}
                >
                  <CardMedia image={obj.thumbnail} sx={{ height: 100 }} />
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="subtitle2" noWrap>
                        {obj.title}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "flex-end",
                          columnGap: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ textDecoration: "line-through", color: "gray" }}
                        >
                          ${formatNumber(obj.price, 2)}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "red" }}>
                          ${formatNumber(obj.discountedPrice, 2)}
                        </Typography>
                      </Box>
                      <Rating
                        name="rating"
                        value={obj.rating}
                        precision={0.5}
                        size="small"
                        readOnly
                        sx={{ mt: 1 }}
                      />
                      <Box>
                        <Chip
                          label={obj.category}
                          size="small"
                          variant="outlined"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between" }}>
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedProduct(obj);
                        setShowProductDetail(true);
                      }}
                    >
                      See more
                    </Button>
                    <Tooltip title="Add to cart">
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => handleAddToCart(obj)}
                      >
                        <AddShoppingCart />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography mx={2}>nothing to see here</Typography>
          )}
        </Grid>
        <Pagination
          // count={totalProducts / limit}
          count={getTotalPage()}
          page={page}
          onChange={handlePagination}
          color="primary"
          disabled={getTotalPageStatus()}
        />
      </>
    );
  };

  const renderProductImages = (product?: Product) => {
    const imgs = product?.images;

    return (
      <ImageList variant="woven" cols={1}>
        {imgs !== undefined ? (
          imgs.map((image, index) => (
            <ImageListItem key={index}>
              <img src={image} alt={index.toString()} loading="lazy" />
            </ImageListItem>
          ))
        ) : (
          <></>
        )}
      </ImageList>
    );
  };

  const renderProductDetail = () => (
    <Container maxWidth="xs" sx={{ py: 2 }}>
      <Box
        sx={{
          p: 2,
          height: "100%",
          maxHeight: 600,
          overflow: "scroll",
          display: "block",
          backgroundColor: "white",
        }}
      >
        <Box>
          <Typography variant="h6">{selectedProduct?.title}</Typography>
        </Box>
        {renderProductImages(selectedProduct)}
        <Typography variant="body2">{selectedProduct?.description}</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            mt: 2,
          }}
          columnGap={1}
        >
          <Typography variant="subtitle1">Was:</Typography>
          <Typography
            variant="h6"
            sx={{ textDecoration: "line-through", color: "gray" }}
          >
            ${formatNumber(selectedProduct?.price, 2)}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "red" }}>
            {formatNumber(selectedProduct?.discountPercentage)}% off
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
          }}
          columnGap={1}
        >
          <Typography variant="subtitle1">Now:</Typography>
          <Typography variant="h6" sx={{ color: "red" }}>
            ${formatNumber(selectedProduct?.discountedPrice, 2)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 2,
          }}
        >
          <Typography variant="button">Rating</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              columnGap: 1,
            }}
          >
            <Rating
              name="rating"
              value={selectedProduct?.rating}
              precision={0.5}
              size="small"
              readOnly
            />
            <Typography variant="subtitle2">
              {formatNumber(selectedProduct?.rating, 1)}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 1 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => handleAddToCart(selectedProduct)}
          >
            Add to Cart
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="button">Stock Availability</Typography>
          <Typography variant="body2">{selectedProduct?.stock}</Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="button">Brand</Typography>
          <Typography variant="body2">{selectedProduct?.brand}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 2,
          }}
        >
          <Typography variant="button">Category</Typography>
          <Box sx={{ mt: 1 }}>
            <Chip label={selectedProduct?.category} size="medium" />
          </Box>
        </Box>
        <IconButton
          size="large"
          sx={{ position: "absolute", top: 15, right: 15 }}
          onClick={handleCloseModal}
        >
          <Close />
        </IconButton>
      </Box>
    </Container>
  );

  return (
    <Container maxWidth="xs">
      <Typography component="h1" variant="h5" mt={1}>
        Products
      </Typography>
      <Box
        sx={{
          mb: 1,
          display: "flex",
          flexDirection: "column",
          // alignItems: "center",
          columnGap: 1,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSearchProduct}
          sx={{
            mb: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            columnGap: 1,
          }}
        >
          <TextField
            id="search"
            name="search"
            label="Search"
            margin="normal"
            placeholder="Search"
            variant="standard"
            size="small"
            fullWidth
          />
          <IconButton edge="end" type="submit">
            <Search />
          </IconButton>
        </Box>
        <Box sx={{ minWidth: 350 }}>{renderSortMenu()}</Box>
      </Box>
      <Box mb={8}>{renderProducts()}</Box>
      <Modal open={showProductDetail} onClose={handleCloseModal}>
        {renderProductDetail()}
      </Modal>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          severity={alertSeverity}
          sx={{ width: "100%", mb: 8 }}
          onClose={handleCloseSnackbar}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Products;
