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
// components
import Label from "../../components/label";
import Iconify from "../../components/iconify";
import Scrollbar from "../../components/scrollbar";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import Swal from "sweetalert2";
// sections
import { UserListHead, UserListToolbar } from "../../sections/@dashboard/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "categoryId", label: "Category_ID", alignRight: false },
  { id: "categoryName", label: "Category_Name", alignRight: false },
  { id: "status", label: "status", alignRight: false },
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
      (_user) =>
        _user.categoryName.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function CategoryPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("categoryName");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [categoryData, setCategoryData] = useState([]);

  const [openAddCategory, setOpenAddCategory] = useState(false);

  const [editCategory, setEditCategory] = useState(null);

  const [openEditPopup, setOpenEditPopup] = useState(false);

  const handleOpenMenu = (event, category) => {
    setEditCategory(category);
    setOpenEditPopup(true);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setOpenEditPopup(false);
  };

  const handleOpenAddCategory = () => {
    setOpenAddCategory(true);
  };

  const handleCloseAddCategory = () => {
    setOpenAddCategory(false);
  };

  const handleAddCategory = (newCategory) => {
    const token = sessionStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const categoryDTO = {
      categoryName: newCategory.categoryName, // stringify the newCategory parameter
      status: "ACT", // set default status to "active"
    };
    axios
      .post("http://localhost:8080/BB/api/v1/category", categoryDTO, config)
      .then((response) => {
        const category = response.data.data;
        setCategoryData([...categoryData, category]);
        setOpenAddCategory(false);
        Swal.fire({
          icon: "success",
          title: "Create Success",
          text: newCategory.categoryName+" "+"Category Create Success",
        });
      })
      .catch((error) => {
        console.error(error);
        const errorMessage =
          error.response && error.response.data && error.response.data.data;
        Swal.fire({
          icon: "error",
          title: "Create Failed",
          text: errorMessage || "Category Create Failed",
        });
      });
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .get("http://localhost:8080/BB/api/v1/category", config)
      .then((response) => {
        setCategoryData(response.data.data);
      })
      .catch((error) => console.error(error));
  }, []);

  // const handleOpenMenu = (event) => {
  //   setOpen(event.currentTarget);
  // };

  // const handleCloseMenu = () => {
  //   setOpen(null);
  // };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");

    setOrderBy(property);
  };

  const handleClick = (event, categoryId) => {
    const selectedIndex = selected.indexOf(categoryId);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, categoryId);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - categoryData.length) : 0;

  const filteredCategories = applySortFilter(
    categoryData,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredCategories.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Category</title>
      </Helmet>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Category
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpenAddCategory}
          >
            New Category
          </Button>
        </Stack>
        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar sx={{ height: "500px" }} >
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={categoryData.length}
                />
                <TableBody   >
                  {filteredCategories
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((category) => {
                      const { categoryId, categoryName, status } = category;
                      const selectedCategory =
                        selected.indexOf(categoryId) !== -1;

                      return (
                        <TableRow
                          hover
                          key={categoryId}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedCategory}
                          // sx={{ backgroundColor: "lightgray" }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedCategory}
                              onChange={(event) =>
                                handleClick(event, categoryId)
                              }
                            />
                          </TableCell>

                          <TableCell align="left">{categoryId}</TableCell>

                          <TableCell align="left">{categoryName}</TableCell>

                          <TableCell align="left">
                            <TableCell align="left">
                              <Label
                                color={
                                  (status === "banned" && "error") || "success"
                                }
                              >
                                {sentenceCase(status)}
                              </Label>
                            </TableCell>
                          </TableCell>

                          <TableCell align="right">
                            <Button
                              size="large"
                              color="inherit"
                              onClick={(event) =>
                                handleOpenMenu(event, category)
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
            count={categoryData.length}
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

      <AddCategoryModal
        open={openAddCategory}
        onClose={handleCloseAddCategory}
        onAddCategory={handleAddCategory}
      />
      <EditCategoryModal
        open={openEditPopup}
        onClose={handleCloseMenu}
        category={editCategory}
      />
    </>
  );
}
