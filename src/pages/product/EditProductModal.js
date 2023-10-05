import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Swal from "sweetalert2";
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

EditProductModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onEditProduct: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
};

export default function EditProductModal({ open, onClose, onEditProduct, product }) {
  const [productName, setproductName] = useState("");
  const [productDescription, setproductDescription] = useState("");
  const [price, setprice] = useState("");
  const [category, setcategory] = useState("");
  const [brand, setbrand] = useState("");
  const [quantity, setquantity] = useState("");
  const [categories, setcategories] = useState([]);
  const [brands, setbrands] = useState([]);

  useEffect(() => {
    if (product) {
      setproductName(product.productName || "");
      setproductDescription(product.productDescription || "");
      setprice(product.price || "");
      setcategory(product.category?.categoryId || "");
      setbrand(product.brand?.brandId || "");
      setquantity(product.quantity || "");
    }
  }, [product]);

  useEffect(() => {

    const token = sessionStorage.getItem("token");

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .get("http://localhost:8080/BB/api/v1/category", config)
      .then((response) => {
        setcategories(response.data.data);
      })
      .catch((error) => console.error(error));

    axios
      .get("http://localhost:8080/BB/api/v1/brand", config)
      .then((response) => {
        setbrands(response.data.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleEdit = () => {
    const token = sessionStorage.getItem("token");

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    console.log(productName);
    console.log(productDescription);
    console.log(price);
    console.log(category);
    console.log(brand);
    console.log(quantity);
    const productDTO = {
      productName: productName,
      productDescription: productDescription,
      price: price,
      category: {
        categoryId: category
      },
      brand: {
        brandId: brand
      },
      quantity: quantity,
    };

    axios
      .put(`http://localhost:8080/BB/api/v1/product/${product.productId}`, productDTO,
      config)
      .then((response) => {
        // onEditProduct(response.data.data);
        setproductName("");
        setproductDescription("");
        setprice("");
        setcategory("");
        setbrand("");
        setquantity("");
        onClose();
        Swal.fire({
          icon: "success",
          title: "Update Success",
          text: "Product Update Success",
        });
       
      })
      .catch((error) => {
        console.error(error);
        onClose();
        const errorMessage =
          error.response && error.response.data && error.response.data.data;
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: errorMessage || "Product Update Failed",
        });
      });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Product</DialogTitle>
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
        <Button onClick={handleEdit} disabled={!quantity && !productName}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import axios from "axios";
// import Swal from "sweetalert2";

// const EditProductModal = ({ open, onClose, product }) => {
//   const [formData, setFormData] = useState({});
//   const [category, setcategory] = useState("");
//   const [brand, setbrand] = useState("");
//   const [categories, setcategories] = useState([]);
//   const [brands, setbrands] = useState([]);

//   useEffect(() => {
//     if (product) {
//       setFormData(product);
//     }
//   }, [product]);

//   useEffect(() => {
//     console.log(formData.brand);
//     const token = sessionStorage.getItem("token");

//     const config = {
//       headers: { Authorization: `Bearer ${token}` },
//     };

//     axios
//       .get("http://localhost:8080/BB/api/v1/category", config)
//       .then((response) => {
//         setcategories(response.data.data);
//       })
//       .catch((error) => console.error(error));

//     axios
//       .get("http://localhost:8080/BB/api/v1/brand", config)
//       .then((response) => {
//         setbrands(response.data.data);
//       })
//       .catch((error) => console.error(error));
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//     const { name, value } = e.target;
  
//     if (name === "brand") {
//       setFormData({
//         ...formData,
//         brand: {
//           brandId: value,
//         },
//       });
//     } else if (name === "category") {
//       setFormData({
//         ...formData,
//         category: {
//           categoryId: value,
//         },
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     }

//   };

//   const handleSave = async () => {
//     const token = sessionStorage.getItem("token");
//     const config = {
//       headers: { Authorization: `Bearer ${token}` },
//     };
//     console.log(formData.brand);
//     console.log(formData.category);
//     const productDTO = {
//       productName: formData.productName,
//       productDescription: formData.productDescription,
//       price: formData.price,
//       category: {
//         categoryId: category.categoryId
//       },
//       brand: {
//         brandId: formData.brand.brandId
//       },
//       quantity: formData.quantity,
//     };

//     axios
//       .put(
//         `http://localhost:8080/BB/api/v1/product/${formData.productId}`,
//         productDTO,
//         config
//       )
//       .then((response) => {
//         Swal.fire({
//           icon: "success",
//           title: "Update Success",
//           text: "Product Update Success",
//         });
//         onClose();
//       })
//       .catch((error) => {
//         console.error(error);
//         const errorMessage =
//           error.response && error.response.data && error.response.data.data;
//         Swal.fire({
//           icon: "error",
//           title: "Update Failed",
//           text: errorMessage || "Product Update Failed",
//         });
//       });
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>Edit Product</DialogTitle>
//       <DialogContent>
//         <TextField
//           label="Product Name"
//           name="productName"
//           value={formData.productName || ""}
//           onChange={handleChange}
//           fullWidth
//           margin="normal"
//         />
//         <TextField
//           label="Description"
//           name="productDescription"
//           value={formData.productDescription || ""}
//           onChange={handleChange}
//           fullWidth
//           margin="normal"
//         />
//         <TextField
//           label="Price"
//           name="price"
//           value={formData.price || ""}
//           onChange={handleChange}
//           fullWidth
//           margin="normal"
//         />
//         <FormControl fullWidth margin="normal">
//           <InputLabel id="status-label">Category</InputLabel>
//           <Select
//             labelId="category-label"
//             name="category"
//             value={formData.category ||  ""}
//             onChange={handleChange}
//           >
//              {categories.map((category) => (
//                <MenuItem key={category.categoryId} value={category.categoryId}>
//                  {category.categoryName}
//                </MenuItem>
//              ))}
//           </Select>
//         </FormControl>
//         <FormControl fullWidth margin="normal">
//           <InputLabel id="status-label">Brand</InputLabel>
//           <Select
//             labelId="brand-label"
//             name="brand"
//             value={formData.brand || ""}
//             onChange={handleChange}
//           >
//             {brands.map((brand) => (
//               <MenuItem key={brand.brandId} value={brand.brandId}>
//                 {brand.brandName}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <TextField
//           label="Quantity"
//           name="quantity"
//           value={formData.quantity || ""}
//           onChange={handleChange}
//           fullWidth
//           margin="normal"
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="primary">
//           Cancel
//         </Button>
//         <Button onClick={handleSave} color="primary">
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditProductModal;
