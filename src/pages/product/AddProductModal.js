import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
// @mui
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

AddProductModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddProduct: PropTypes.func.isRequired,
};

export default function AddProductModal({ open, onClose, onAddProduct }) {
  const [productName, setproductName] = useState("");
  const [productDescription, setproductDescription] = useState("");
  const [price, setprice] = useState("");
  const [category, setcategory] = useState("");
  const [brand, setbrand] = useState("");
  const [quantity, setquantity] = useState("");
  const [categories, setcategories] = useState([]);
  const [brands, setbrands] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    // Fetch categories
    axios
      .get("http://localhost:8080/BB/api/v1/category", config)
      .then((response) => {
        setcategories(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => console.error(error));

    axios
      .get("http://localhost:8080/BB/api/v1/brand", config)
      .then((response) => {
        setbrands(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleAdd = () => {
    const newProduct = {
      productName,
      productDescription,
      price,
      category,
      brand,
      quantity,
    };
    onAddProduct(newProduct);
    setproductName("");
    setproductDescription("");
    setprice("");
    setcategory("");
    setbrand("");
    setquantity("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Product</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Product Name
        </Typography>
        <TextField
          required
          fullWidth
          autoFocus
          margin="dense"
          variant="outlined"
          value={productName}
          onChange={(e) => setproductName(e.target.value)}
        />

        <Typography variant="subtitle1" gutterBottom>
          Product Description
        </Typography>
        <TextField
          required
          fullWidth
          autoFocus
          margin="dense"
          variant="outlined"
          value={productDescription}
          onChange={(e) => setproductDescription(e.target.value)}
        />

        <Typography variant="subtitle1" gutterBottom>
          Price
        </Typography>
        <TextField
          required
          fullWidth
          autoFocus
          margin="dense"
          variant="outlined"
          value={price}
          onChange={(e) => setprice(e.target.value)}
        />

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
          Category
        </Typography>
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={category}
            onChange={(e) => setcategory(e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
          Brand
        </Typography>
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Brand</InputLabel>
          <Select
            label="Brand"
            value={brand}
            onChange={(e) => setbrand(e.target.value)}
          >
            {brands.map((brand) => (
              <MenuItem key={brand.brandId} value={brand.brandId}>
                {brand.brandName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="subtitle1" gutterBottom>
          Quantity
        </Typography>
        <TextField
          required
          fullWidth
          autoFocus
          margin="dense"
          variant="outlined"
          value={quantity}
          onChange={(e) => setquantity(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd} disabled={!quantity && !productName}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
