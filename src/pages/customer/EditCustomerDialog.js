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

const EditCustomerDialog = ({ open, onClose, customer }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (customer) {
      setFormData(customer);
    }
  }, [customer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = sessionStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(formData)
    console.log(customer.id);
    console.log('Type of customer.id:', formData.customerid);
    const customerDTO = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      addressLine1: formData.addressLine1,
      city: formData.city,
      postalCode: formData.postalCode,
      password: formData.password,
      status: formData.status,
      user: {
        username: formData.username,
      },
    };

    axios
      .put(
        `http://localhost:8080/BB/api/v1/customer/${formData.customerId}`,
        customerDTO,
        config
      )
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Update Success",
          text: "Customer Update Success",
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
          text: errorMessage || "Customer Update Failed",
        });
      })
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Customer</DialogTitle>
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
        <TextField
          label="Address"
          name="address"
          value={formData.addressLine1 || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="City"
          name="city"
          value={formData.city || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Postal Code"
          name="postalCode"
          value={formData.postalCode || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          name="status"
          value={formData.status || ''}
          onChange={handleChange}
        >
          <MenuItem value="ACTIVE">ACTIVE</MenuItem>
          <MenuItem value="DEACTIVE">DEACTIVE</MenuItem>
          {/* Add other status options as needed */}
        </Select>
        </FormControl>
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

export default EditCustomerDialog;