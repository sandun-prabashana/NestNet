import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import EditAdminDialog from "./EditAdminDialog";
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
  CircularProgress,
} from "@mui/material";

// components
import Label from "../../components/label";
import Iconify from "../../components/iconify";
import Scrollbar from "../../components/scrollbar";
import AddAdminModal from "./AddAdminModal";
// import EditProductModal from "./EditProductModal";
import { UserListHead, UserListToolbar } from "../../sections/@dashboard/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "adminId", label: "Admin_ID", alignRight: false },
  { id: "adminName", label: "Admin_User_Name", alignRight: false },
  { id: "fullName", label: "Full_Name", alignRight: false },
  { id: "phonenumber", label: "Phone_Number", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "role", label: "Role", alignRight: false },
  { id: "" },
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
      (_admin) =>
        _admin.userName.username.toLowerCase().indexOf(query.toLowerCase()) !==
        -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("productName");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [adminData, setAdminData] = useState([]);

  const [openAddAdmin, setOpenAddAdmin] = useState(false);

  const [editAdmin, setEditAdmin] = useState(null);

  const [openEditPopup, setOpenEditPopup] = useState(false);

  const handleOpenMenu = (event, admin) => {
    setEditAdmin(admin);
    setOpenEditPopup(true);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setOpenEditPopup(false);
  };

  const handleOpenAddAdmin = () => {
    setOpenAddAdmin(true);
  };

  const handleCloseAddAdmin = () => {
    setOpenAddAdmin(false);
  };

  const handleAddAdmin = (newAdmin) => {
    setIsLoading(true);
    const token = sessionStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const adminDTO = {
      firstName: newAdmin.firstName,
      lastName: newAdmin.lastName,
      phoneNumber: newAdmin.phoneNumber,
      email: newAdmin.email,
      userName: {
        username: newAdmin.userName,
      },
    };
    axios
      .post("http://localhost:8080/BB/api/v1/admin", adminDTO, config)
      .then((response) => {
        const admin = response.data.data;
        setAdminData([...adminData, admin]);
        setOpenAddAdmin(false);
        Swal.fire({
          icon: "success",
          title: "Register Success",
          text: "Admin Register Success",
        });
      })
      .catch((error) => {
        console.error(error);
        const errorMessage =
          error.response && error.response.data && error.response.data.data;
        Swal.fire({
          icon: "error",
          title: "Register Failed",
          text: errorMessage || "Admin Registration Failed",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // const handleAddAdmin = (newAdmin) => {
  //   const token = sessionStorage.getItem("token");
  //   const config = {
  //     headers: { Authorization: `Bearer ${token}` },
  //   };
  //   console.log(newProduct);

  //   console.log(newProduct.productName);
  //   console.log(newProduct.productDescription);
  //   console.log(newProduct.price);
  //   console.log(newProduct.category);
  //   console.log(newProduct.brand);
  //   console.log(newProduct.quantity);
  //   const productDTO = {
  //     productName: newProduct.productName,
  //     productDescription: newProduct.productDescription,
  //     price: newProduct.price,
  //     category: {
  //       categoryId: newProduct.category
  //     },
  //     brand: {
  //       brandId: newProduct.brand
  //     },
  //     quantity: newProduct.quantity,
  //   };
  //   axios
  //     .post("http://localhost:8080/BB/api/v1/product", productDTO, config)
  //     .then((response) => {
  //       const product = response.data.data;
  //       setProductData([...productData, product]);
  //       setOpenAddProduct(false);
  //     })
  //     .catch((error) => console.error(error));
  // };

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .get("http://localhost:8080/BB/api/v1/admin", config)
      .then((response) => {
        setAdminData(response.data.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");

    setOrderBy(property);
  };

  const handleClick = (event, adminId) => {
    const selectedIndex = selected.indexOf(adminId);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, adminId);
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
  // const handleDeleteAdmin = (adminId) => {
  //   const token = sessionStorage.getItem("token");
  //   const config = {
  //     headers: { Authorization: `Bearer ${token}` },
  //   };
  
  //   axios
  //     .delete(`http://localhost:8080/BB/api/v1/admin/${adminId}`, config)
  //     .then(() => {
  //       setAdminData((prevAdminData) =>
  //         prevAdminData.filter((admin) => admin.adminId !== adminId)
  //       );
  //       Swal.fire({
  //         icon: "success",
  //         title: "Delete Success",
  //         text: "Admin Deleted Successfully",
  //       });
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       Swal.fire({
  //         icon: "error",
  //         title: "Delete Failed",
  //         text: "Admin Deletion Failed",
  //       });
  //     });
  // };

  const handleDeleteAdmin = (adminId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        const token = sessionStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        axios
          .delete(`http://localhost:8080/BB/api/v1/admin/${adminId}`, config)
          .then(() => {
            setAdminData(adminData.filter((admin) => admin.adminId !== adminId));
            setSelected([]);
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Admin deleted successfully",
            });
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "An error occurred while deleting the admin",
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    });
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - adminData.length) : 0;

  const filteredCategories = applySortFilter(
    adminData,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredCategories.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Admin</title>
      </Helmet>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Admin
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpenAddAdmin}
          >
            New Admin
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
                  rowCount={adminData.length}
                />
                <TableBody>
                  {filteredCategories
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((admin) => {
                      const {
                        adminId,
                        userName,
                        phoneNumber,
                        email,
                        firstName,
                        lastName,
                      } = admin;
                      const selectedAdmin = selected.indexOf(adminId) !== -1;

                      return (
                        <TableRow
                          hover
                          key={adminId}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedAdmin}
                          // sx={{ backgroundColor: "lightgray" }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedAdmin}
                              onChange={(event) => handleClick(event, adminId)}
                            />
                          </TableCell>

                          <TableCell align="left">{adminId}</TableCell>
                          <TableCell align="left">
                            {userName.username}
                          </TableCell>
                          <TableCell align="left">
                            {firstName + " " + lastName}
                          </TableCell>
                          <TableCell align="left">{phoneNumber}</TableCell>
                          <TableCell align="left">{email}</TableCell>

                          <TableCell align="left">
                            <TableCell align="left">
                              <Label
                                color={
                                  (userName.userrole.description === "banned" &&
                                    "error") ||
                                  "success"
                                }
                              >
                                {sentenceCase(userName.userrole.description)}
                              </Label>
                            </TableCell>
                          </TableCell>

                          <TableCell align="right">
                            <Button
                              size="large"
                              color="inherit"
                              onClick={(event) => handleOpenMenu(event, admin)}
                            >
                              <Iconify icon={"eva:edit-fill"} />
                            </Button>
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              size="large"
                              color="inherit"
                              onClick={() => handleDeleteAdmin(admin.adminId)}
                            >
                              <Iconify icon={"eva:trash-2-outline"} />
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
            count={adminData.length}
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
      <AddAdminModal
        open={openAddAdmin}
        handleClose={handleCloseAddAdmin}
        handleAddAdmin={handleAddAdmin}
        isLoading={isLoading}
      />
      <EditAdminDialog
        open={openEditPopup}
        onClose={handleCloseMenu}
        admin={editAdmin}
      />
    </>
  );
}
