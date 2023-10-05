import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import axios from "axios";
import Swal from "sweetalert2";

const EditAdminDialog = ({ open, onClose, admin }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (admin) {
      setFormData(admin);
    }
  }, [admin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  console.log(formData)
  const handleSave = async () => {
    const token = sessionStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(formData)
    console.log(admin.id);
    const adminDTO = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      // userName: {
      //   username: formData.userName,
      // },
    };

    axios
      .put(
        `http://localhost:8080/BB/api/v1/admin/${formData.adminId}`,
        adminDTO,
        config
      )
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Update Success",
          text: "Admin Update Success",
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
          text: errorMessage || "Admin Update Failed",
        });
      })
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Admin</DialogTitle>
      <DialogContent>
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={true}
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber || ''}
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

export default EditAdminDialog;