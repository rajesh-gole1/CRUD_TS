import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import axios from "axios";
// import { deleteUser, fetchUsers } from "../../redux/UserSlice";
import { Pagination } from "@mui/material";
import { fetchUsers } from "../../redux/modules/users";
import { AppDispatch, RootState } from "../../redux/configureStore";

const UserView = () => {
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  //  const users = useSelector((state) => state.usersReducer.users);
  //  console.log("users", users);
  //   const [users, setUsers] = useState([]);
  const [noOfUsers, setNoOfUsers] = useState(0);
  const [rows, setRows] = useState([]);
  const [searched, setSearched] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(4);
  const [page, setPage] = useState(1);
  const [orderDirection, setOrderDirection] = useState("asc");
  const { users } = useSelector((state: RootState) => ({
    users: state.users,
  }));

  const handlePage = (page: any) => setPage(page);
  useEffect(() => {
    dispatch(fetchUsers());
    // setRows([...rows, ...user]);
    // setUsers([...users, ...user]);
    // setNoOfUsers(Object.keys(user.data).length);
  }, [dispatch]);

  //   const handleDeleteUser = (id: any) => {
  //     axios.delete(`http://localhost:3008/userDetails/${id}`).then((res) => {
  //       console.log(res);
  //       console.log(res.data);

  //       const newUserList = user.filter((item: any) => item["id"] !== id);
  //       setRows(newUserList);
  //       setNoOfUsers(Object.keys(res.data).length);
  //     });
  //     // dispatch(deleteUser(id));
  //     // navigate("/all-users");
  //   };
  const totalPages = Math.ceil(rows.length / pageSize);
  let copyData = rows.slice((page - 1) * pageSize, page * pageSize);

  const sortData = (arr: any, orderBy: any) => {
    switch (orderBy) {
      case "asc":
      default:
        return arr.sort((a: any, b: any) =>
          a.name.toLowerCase() > b.name.toLowerCase()
            ? 1
            : b.name.toLowerCase() > a.name.toLowerCase()
            ? -1
            : 0
        );
      case "desc":
        return arr.sort((a: any, b: any) =>
          a.name.toLowerCase() < b.name.toLowerCase()
            ? 1
            : b.name.toLowerCase() < a.name.toLowerCase()
            ? -1
            : 0
        );
    }
  };

  const handleSortRequest = () => {
    sortData(rows, orderDirection);
    setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
  };
  console.log("users", users);

  return (
    <div>
      {/* <h2>List of Users : Total {noOfUsers}</h2> */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell onClick={handleSortRequest}>
                <TableSortLabel active={true}>Name</TableSortLabel>
              </TableCell>
              <TableCell align="right">Phone</TableCell>
              <TableCell align="right">Email</TableCell>
              {/* <StyledTableCell align="right">Created At</StyledTableCell> */}
              <TableCell align="right">More</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {copyData &&
              copyData.map((user) => (
                <StyledTableRow key={user["name"]}>
                  <StyledTableCell component="th" scope="row">
                    {user["name"]}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {user["phone"]}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {user["email"]}
                  </StyledTableCell>
                  {/* <StyledTableCell align="right">{moment(user.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}</StyledTableCell>  */}
                  <StyledTableCell align="right">
                    <Stack direction="row-reverse" spacing={2}>
                      <Button
                        variant="outlined"
                        component={Link}
                        to={`/user/${user["id"]}`}
                      >
                        Info
                      </Button>
                      <Button
                        variant="contained"
                        component={Link}
                        to={`/edituser/${user["id"]}`}
                      >
                        Edit
                      </Button>
                      {/* <Button
                        variant="outlined"
                        component={Link}
                        color="error"
                        onClick={() => {
                          handleDeleteUser(user.id);
                        }}
                      >
                        Delete
                      </Button> */}
                    </Stack>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        color="primary"
        count={totalPages}
        onChange={(event, value) => handlePage(value)}
        page={page}
        size="large"
      ></Pagination>
    </div>
  );
};

export default UserView;
