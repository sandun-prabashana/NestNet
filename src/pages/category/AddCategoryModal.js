import React, { useState } from "react";
import PropTypes from "prop-types";
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

AddCategoryModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddCategory: PropTypes.func.isRequired,
};

export default function AddCategoryModal({ open, onClose, onAddCategory }) {
  const [categoryName, setCategoryName] = useState("");
  const [status, setStatus] = useState("active");

  const handleAdd = () => {
    const newCategory = {
      categoryName,
      status,
    };
    onAddCategory(newCategory);
    setCategoryName("");
    setStatus("active");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New Category</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Category Name
        </Typography>
        <TextField
          required
          fullWidth
          autoFocus
          margin="dense"
          variant="outlined"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
          Status
        </Typography>
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="banned">Banned</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd} disabled={!categoryName}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
