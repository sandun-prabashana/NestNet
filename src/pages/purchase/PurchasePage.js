import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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

import Label from "../../components/label";
import Iconify from "../../components/iconify";
import Scrollbar from "../../components/scrollbar";
// import AddProductModal from "./AddProductModal";

import { UserListHead, UserListToolbar } from "../../sections/@dashboard/user";
// import EditProductModal from "./EditProductModal";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "purchaseId", label: "Purchase_ID", alignRight: false },
  { id: "customerId", label: "Customer_ID", alignRight: false },
  { id: "customer", label: "Customer", alignRight: false },
  { id: "product", label: "Product", alignRight: false },
  { id: "purchaseQuantity", label: "Purchase Quantity", alignRight: false },
  { id: "totalPrice", label: "Total Price", alignRight: false },
  { id: "purchaseDate", label: "Purchase Date", alignRight: false },
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
      (_purchase) =>
        _purchase.customer.user.username.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function PurchasePage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("purchaseName");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [purchaseData, setPurchaseData] = useState([]);

  const [openAddPurchase, setOpenAddPurchase] = useState(false);

  const [editPurchase, setEditPurchase] = useState(null);

  const [openEditPopup, setOpenEditPopup] = useState(false);

  const handleOpenMenu = (event, purchase) => {
    setEditPurchase(purchase);
    setOpenEditPopup(true);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setOpenEditPopup(false);
  };

  const handleOpenAddPurchase = () => {
    setOpenAddPurchase(true);
  };

  const handleCloseAddPurchase = () => {
    setOpenAddPurchase(false);
  };

  const handleAddPurchase = (newPurchase) => {
    // const token = sessionStorage.getItem("token");
    // const config = {
    //   headers: { Authorization: `Bearer ${token}` },
    // };
    // console.log(newProduct);

    // console.log(newProduct.productName);
    // console.log(newProduct.productDescription);
    // console.log(newProduct.price);
    // console.log(newProduct.category);
    // console.log(newProduct.brand);
    // console.log(newProduct.quantity);
    // const productDTO = {
    //   productName: newProduct.productName,
    //   productDescription: newProduct.productDescription,
    //   price: newProduct.price,
    //   category: {
    //     categoryId: newProduct.category
    //   },
    //   brand: {
    //     brandId: newProduct.brand
    //   },
    //   quantity: newProduct.quantity,
    // };
    // axios
    //   .post("http://localhost:8080/BB/api/v1/product", productDTO, config)
    //   .then((response) => {
    //     const product = response.data.data;
    //     setProductData([...productData, product]);
    //     setOpenAddProduct(false);
    //   })
    //   .catch((error) => console.error(error));
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .get("http://localhost:8080/BB/api/v1/purchase", config)
      .then((response) => {
        setPurchaseData(response.data.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");

    setOrderBy(property);
  };

  const handleClick = (event, purchaseId) => {
    const selectedIndex = selected.indexOf(purchaseId);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, purchaseId);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - purchaseData.length) : 0;

  const filteredCategories = applySortFilter(
    purchaseData,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredCategories.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Purchase</title>
      </Helmet>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
          Purchase
          </Typography>
          {/* <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpenAddPurchase}
          >
            New Purchase
          </Button> */}
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
                  rowCount={purchaseData.length}
                />
                <TableBody>
                  {filteredCategories
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((purchase) => {
                      const {
                        purchaseId,
                        customer,
                        product,
                        purchaseQuantity,
                        purchaseDate,
                      } = purchase;
                      const selectedPurchase =
                        selected.indexOf(purchaseId) !== -1;

                      return (
                        <TableRow
                          hover
                          key={purchaseId}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedPurchase}
                          // sx={{ backgroundColor: "lightgray" }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedPurchase}
                              onChange={(event) =>
                                handleClick(event, purchaseId)
                              }
                            />
                          </TableCell>

                          <TableCell align="left">{purchaseId}</TableCell>
                          <TableCell align="left">{customer.customerId}</TableCell>
                          <TableCell align="left">{customer.user.username}</TableCell>
                          <TableCell align="left">
                            {product.productName}
                          </TableCell>

                          <TableCell align="left">{product.price}</TableCell>
                          <TableCell align="left">{purchaseQuantity * product.price}</TableCell>
                          <TableCell align="left">{purchaseDate}</TableCell>

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

                          {/* <TableCell align="right">
                            <Button
                              size="large"
                              color="inherit"
                              onClick={(event) =>
                                handleOpenMenu(event, purchase)
                              }
                            >
                              <Iconify icon={"eva:edit-fill"} />
                            </Button>
                          </TableCell> */}
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
            count={purchaseData.length}
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

      {/* <AddProductModal
        open={openAddProduct}
        onClose={handleCloseAddProduct}
        onAddProduct={handleAddProduct}
      />
      <EditProductModal
        open={openEditPopup}
        onClose={handleCloseMenu}
        product={editProduct}
      /> */}
    </>
  );
}
