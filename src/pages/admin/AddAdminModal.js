import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress } from '@mui/material';

export default function AddAdminModal({ open, handleClose, handleAddAdmin, isLoading  }) {
  const [adminDetails, setAdminDetails] = React.useState({
    userName: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  });

  const handleChange = (event) => {
    setAdminDetails({ ...adminDetails, [event.target.name]: event.target.value });
  };


  const handleSubmit = () => {
    handleAddAdmin(adminDetails);
    handleClose();
    setAdminDetails({
      userName: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: ''
    });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Admin</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="userName"
          label="User Name"
          fullWidth
          variant="outlined"
          value={adminDetails.userName}
          onChange={handleChange}
        />
        {/* <TextField
          margin="dense"
          name="password"
          label="Password"
          fullWidth
          variant="outlined"
          value={adminDetails.password}
          onChange={handleChange}
        /> */}
        <TextField
          margin="dense"
          name="firstName"
          label="First Name"
          fullWidth
          variant="outlined"
          value={adminDetails.firstName}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="lastName"
          label="Last Name"
          fullWidth
          variant="outlined"
          value={adminDetails.lastName}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="phoneNumber"
          label="Phone Number"
          fullWidth
          variant="outlined"
          value={adminDetails.phoneNumber}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email"
          fullWidth
          variant="outlined"
          value={adminDetails.email}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        {isLoading ? (
          <CircularProgress size={24} />
        ) : (
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Save</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
