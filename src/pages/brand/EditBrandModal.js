// import React, { useState } from "react";
// import {
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
// } from "@mui/material";
// import axios from "axios";

// export default function EditBrandModal({ open, onClose, brand, brandData, setBrandData }) {
//   const [brandName, setBrandName] = useState(
//     brand ? brand.brandName : ""
//   );

//   const handleBrandNameChange = (event) => {
//     setBrandName(event.target.value);
//   };

//   const handleSave = () => {
//     const token = sessionStorage.getItem("token");
//     const config = {
//       headers: { Authorization: `Bearer ${token}` },
//     };
//     console.log(brand)

//     const updatedBrand= { ...brand, brandName };
//     axios
//       .put(
//         `http://localhost:8080/BB/api/v1/brand/${brand.brandId}`,
//         updatedBrand,
//         config
//       )
//       .then((response) => {
//         const updatedBrand = response.data.data;
//         setBrandName("")
//         onClose();
//         const index = brandData.findIndex(
//           (brand) => brand.brandId === updatedBrand.brandId
//         );
//         if (index >= 0) {
//           const newBrandData = [...brandData];
//           newBrandData[index] = updatedBrand;
//           setBrandData(newBrandData);
//         }
//         onClose();
//       })
//       .catch((error) => console.error(error));
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Edit Brand</DialogTitle>
//       <DialogContent>
//         <TextField
//           autoFocus
//           margin="dense"
//           id="brandName"
//           label="Brand Name"
//           type="text"
//           fullWidth
//           value={brandName}
//           onChange={handleBrandNameChange}
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={handleSave} variant="contained" color="primary">
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

import React, { useState, useEffect } from "react";
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
import Swal from "sweetalert2";

const EditBrandModal = ({ open, onClose, brand }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (brand) {
      setFormData(brand);
    }
  }, [brand]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = sessionStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(formData);
    const brandDTO = {
      brandName: formData.brandName,
    };

    axios
      .put(
        `http://localhost:8080/BB/api/v1/brand/${formData.brandId}`,
        brandDTO,
        config
      )
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Update Success",
          text: "Brand Update Success",
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
          text: errorMessage || "Brand Update Failed",
        });
      });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Brand</DialogTitle>
      <DialogContent>
      <TextField
          label="Brand Name"
          name="brandName"
          value={formData.brandName || ''}
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

export default EditBrandModal;
