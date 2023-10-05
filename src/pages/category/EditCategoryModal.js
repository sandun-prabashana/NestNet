import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const EditCategoryModal = ({ open, onClose, category }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (category) {
      setFormData(category);
    }
  }, [category]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = sessionStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(formData);
    const categoryDTO = {
      categoryName: formData.categoryName,
    };

    axios
      .put(
        `http://localhost:8080/BB/api/v1/category/${formData.categoryId}`,
        categoryDTO,
        config
      )
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Update Success",
          text: "Category Update Success",
        });
        onClose();
      })
      .catch((error) => {
        console.error(error);
        const errorMessage =
          error.response && error.response.data && error.response.data.data;
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: errorMessage || "Category Update Failed",
        });
      });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Category Brand</DialogTitle>
      <DialogContent>
      <TextField
          label="Category Name"
          name="categoryName"
          value={formData.categoryName || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
       
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCategoryModal;
