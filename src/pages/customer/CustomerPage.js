import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Stack,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TableHead,
  TableSortLabel,
} from "@mui/material";
import { sentenceCase } from "change-case";
import { Helmet } from "react-helmet-async";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../FireBaseConfig2";
import { UserListHead, UserListToolbar } from "../../sections/@dashboard/user";

const TABLE_HEAD = [
  { id: "userID", label: "User ID" },
  { id: "userName", label: "User Name" },
  { id: "email", label: "Email" },
  { id: "phoneNumber", label: "Phone Number" },
  { id: "address", label: "Address" },
  { id: "city", label: "City" },
  { id: "postalCode", label: "Postal Code" },
  { id: "status", label: "Status" },
  { id: "createTime", label: "Create Time" },
  { id: "lastUpdateTime", label: "Last Update" },
  { id: "userType", label: "User Type" },
];

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("userName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersQuery = collection(db, "users");
        const userDocs = await getDocs(usersQuery);
        const usersData = userDocs.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setUsers([]);
      }
    };
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const [filterEmail, setFilterEmail] = useState("");

  const handleFilterByEmail = (event) => {
    setFilterEmail(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(filterEmail.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Users | YourApp</title>
      </Helmet>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Users
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar
            filterName={filterEmail}
            onFilterName={handleFilterByEmail}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {TABLE_HEAD.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      sortDirection={orderBy === headCell.id ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : "asc"}
                        onClick={createSortHandler(headCell.id)}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort(filteredUsers, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => {
                    return (
                      <TableRow key={user.id}>
                        {TABLE_HEAD.map((headCell) => (
                          <TableCell key={headCell.id}>
                            {headCell.id === "status" ? (
                              <Typography
                                style={{
                                  fontWeight: "bold",
                                  color:
                                    user[headCell.id] === "ACTIVE"
                                      ? "green"
                                      : "red",
                                }}
                              >
                                {sentenceCase(user[headCell.id])}
                              </Typography>
                            ) : headCell.id === "userType" ? (
                              <Typography
                                style={{
                                  fontWeight: "bold",
                                  color:
                                    user[headCell.id] === "USER"
                                      ? "blue"
                                      : user[headCell.id] === "ADMIN"
                                      ? "orange"
                                      : "black", // or another suitable default color
                                }}
                              >
                                {sentenceCase(user[headCell.id])}
                              </Typography>
                            ) : (
                              user[headCell.id]
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
