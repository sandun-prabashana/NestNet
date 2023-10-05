import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from "@mui/material";
// components
import Label from "../../components/label";
import Iconify from "../../components/iconify";
import Scrollbar from "../../components/scrollbar";
import AddProductModal from "./AddProductModal";
// import AddCategoryModal from "./AddCategoryModal";
// import EditCategoryModal from "./EditCategoryModal";
// sections
import { UserListHead, UserListToolbar } from "../../sections/@dashboard/user";
import EditProductModal from "./EditProductModal";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "productId", label: "Product_ID", alignRight: false },
  { id: "productName", label: "Product_Name", alignRight: false },
  { id: "productDescription", label: "Description", alignRight: false },
  { id: "price", label: "Price", alignRight: false },
  { id: "category", label: "Category", alignRight: false },
  { id: "brand", label: "Brand", alignRight: false },
  { id: "quantity", label: "Quantity", alignRight: false },
  { id: "" },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_product) =>
        _product.productName.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ProductPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("productName");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [productData, setProductData] = useState([]);

  const [openAddProduct, setOpenAddProduct] = useState(false);

  const [editProduct, setEditProduct] = useState(null);

  const [openEditPopup, setOpenEditPopup] = useState(false);

  const handleOpenMenu = (event, product) => {
    setEditProduct(product);
    setOpenEditPopup(true);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setOpenEditPopup(false);
  };

  const handleOpenAddProduct = () => {
    setOpenAddProduct(true);
  };

  const handleCloseAddProduct = () => {
    setOpenAddProduct(false);
  };

  const handleAddProduct = (newProduct) => {
    const token = sessionStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(newProduct);

    console.log(newProduct.productName);
    console.log(newProduct.productDescription);
    console.log(newProduct.price);
    console.log(newProduct.category);
    console.log(newProduct.brand);
    console.log(newProduct.quantity);
    const productDTO = {
      productName: newProduct.productName,
      productDescription: newProduct.productDescription,
      price: newProduct.price,
      category: {
        categoryId: newProduct.category
      },
      brand: {
        brandId: newProduct.brand
      },
      quantity: parseInt(newProduct.quantity),
    };
    axios
      .post("http://localhost:8080/BB/api/v1/product", productDTO, config)
      .then((response) => {
        const product = response.data.data;
        setProductData([...productData, product]);
        setOpenAddProduct(false);
        Swal.fire({
          icon: "success",
          title: "Create Success",
          text: newProduct.productName+" "+"Product Create Success",
        });
      })
      .catch((error) => {
        console.error(error);
        const errorMessage =
          error.response && error.response.data && error.response.data.data;
        Swal.fire({
          icon: "error",
          title: "Create Failed",
          text: errorMessage || "Product Create Failed",
        });
      });
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .get("http://localhost:8080/BB/api/v1/product", config)
      .then((response) => {
        setProductData(response.data.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");

    setOrderBy(property);
  };

  const handleClick = (event, productId) => {
    const selectedIndex = selected.indexOf(productId);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, productId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productData.length) : 0;

  const filteredCategories = applySortFilter(
    productData,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredCategories.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Product</title>
      </Helmet>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Product
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpenAddProduct}
          >
            New Product
          </Button>
        </Stack>
        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar sx={{ height: "500px" }}>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={productData.length}
                />
                <TableBody>
                  {filteredCategories
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product) => {
                      const {
                        productId,
                        productName,
                        productDescription,
                        price,
                        category,
                        brand,
                        quantity,
                      } = product;
                      const selectedProduct =
                        selected.indexOf(productId) !== -1;

                      return (
                        <TableRow
                          hover
                          key={productId}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedProduct}
                          // sx={{ backgroundColor: "lightgray" }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedProduct}
                              onChange={(event) =>
                                handleClick(event, productId)
                              }
                            />
                          </TableCell>

                          <TableCell align="left">{productId}</TableCell>
                          <TableCell align="left">{productName}</TableCell>
                          <TableCell align="left">
                            {productDescription}
                          </TableCell>
                          <TableCell align="left">{price}</TableCell>
                          <TableCell align="left">
                            {category.categoryName}
                          </TableCell>
                          <TableCell align="left">{brand.brandName}</TableCell>
                          <TableCell align="left">{quantity}</TableCell>

                          {/* <TableCell align="left">
                            <TableCell align="left">
                              <Label
                                color={
                                  (status === "banned" && "error") || "success"
                                }
                              >
                                {sentenceCase(status)}
                              </Label>
                            </TableCell>
                          </TableCell> */}

                          <TableCell align="right">
                            <Button
                              size="large"
                              color="inherit"
                              onClick={(event) =>
                                handleOpenMenu(event, product)
                              }
                            >
                              <Iconify icon={"eva:edit-fill"} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper sx={{ textAlign: "center" }}>
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete
                            words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5]}
            component="div"
            count={productData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={"eva:edit-fill"} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: "error.main" }}>
          <Iconify icon={"eva:trash-2-outline"} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <AddProductModal
        open={openAddProduct}
        onClose={handleCloseAddProduct}
        onAddProduct={handleAddProduct}
      />
      <EditProductModal
        open={openEditPopup}
        onClose={handleCloseMenu}
        product={editProduct}
      />
    </>
  );
}
