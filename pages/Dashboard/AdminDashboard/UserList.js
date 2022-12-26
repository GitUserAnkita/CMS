import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import UserService from '../../../Service/UserService';
import { AppBar, Box, Button, IconButton, Input, Toolbar, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-number-input/style.css'
import { useRouter } from 'next/router';


export default function UserList() {
  const route = useRouter()

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [open, setOpen] = useState(false);
  const [query, setquery] = useState('')
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [users, setUsers] = useState([]);
  const [roleArray, setRoleArray] = useState([]);

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [roleValue, setRoleValue] = useState();
  const [roleName, setRoleName] = useState();
  const [userId, setUserId] = useState();
  const [status, setStatus] = useState();

  const [state, setstate] = useState({ query: '', list: [] })

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('loginUser'))
    getAlluser();
    getallroles()
  }, []);

  const handleClickOpen = async (id) => {
    route.push(`/Dashboard/AdminDashboard/EditUser/${id}`)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getAlluser = async () => {
    setLoading(true);
    const accestoken = localStorage.getItem('accessToken');
    await UserService.getAllUser(accestoken).then((res) => {
      setUsers(res.data)
      setLoading(false);

    })
  }

  const removeFn = async (id) => {
    const accestoken = localStorage.getItem('accessToken');
    await UserService.removeUser(id, accestoken).then((res) => {
      toast.success("user delete successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      getAlluser();
    })
  }

  const getallroles = async () => {
    await UserService.getAllRole().then((roleData) => {
      // console.log(roleData)
      setRoleArray(roleData?.data)
    })
  }

  const changeStatus = async (id, status) => {
    const data = {
      status: status
    }
    const accestoken = localStorage.getItem('accessToken');

    await UserService.updateprofile(id, data, accestoken).then((data) => {
      setLoading1(true);
      if (data.data.status === 200) {
        setLoading1(false)
      }
      getAlluser()
    })
  }

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleChange = (e) => {
    const results = users.filter(post => {
      if (e.target.value === "") return users
      return post.name.toLowerCase().includes(e.target.value.toLowerCase()) 
    })
    setstate({
      query: e.target.value,
      users: results
    })
  }
  return (
    <>
      <ToastContainer />
      <Box sx={{ flexGrow: 1 }}>
      <h1>User List</h1>
        <AppBar position="static" style={{ backgroundColor: 'white', color: 'black', border: 'none' }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <Input
                onChange={handleChange} value={state.query} type="search"
              />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {/* <Button onClick={handleSearch} style={{ color: 'black', fontWeight: '800' }}>Go</Button> */}
            </Typography>


            {/* <Button variant="contained" style={{backgroundColor:'silver',color:"black",fontWeight:'800'}} onClick={()=>{adduserFn()}}>
               Add New User
             </Button> */}
          </Toolbar>
        </AppBar>
      </Box>

      
      
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: '800' }}>name</TableCell>
                <TableCell style={{ fontWeight: '800' }}>Phone</TableCell>
                <TableCell style={{ fontWeight: '800' }}>Email</TableCell>
                <TableCell style={{ fontWeight: '800' }}>Role</TableCell>
                <TableCell style={{ fontWeight: '800' }}>Status</TableCell>
                <TableCell style={{ fontWeight: '800' }}>Remove</TableCell>
                <TableCell style={{ fontWeight: '800' }}>Edit</TableCell>
                <TableCell style={{ fontWeight: '800' }}>Change Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
               state.query === '' ? users?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell >{row.phone}</TableCell>
                    <TableCell >{row.email}</TableCell>
                    <TableCell >{row?.role?.title}</TableCell>

                    <TableCell >{row.status}</TableCell>
                    <TableCell ><Button style={{ backgroundColor: 'silver', color: "black" }} onClick={() => { removeFn(row.id) }}>Remove</Button></TableCell>
                    <TableCell >
                      <Button style={{ backgroundColor: 'silver', color: "black" }} onClick={() => { handleClickOpen(row.id) }}>Edit</Button></TableCell>
                    <TableCell >
                      <Button style={{ backgroundColor: 'silver', color: "black" }} onClick={() => { changeStatus(row.id, row.status === 'verified' ? 'unverified' : 'verified') }}>
                        {row.status === 'verified' ? 'unverified' : 'verified'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
                :
                 state.users?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell >{row.phone}</TableCell>
                    <TableCell >{row.email}</TableCell>
                    <TableCell >{row?.role?.title}</TableCell>

                    <TableCell >{row.status}</TableCell>
                    <TableCell ><Button style={{ backgroundColor: 'silver', color: "black" }} onClick={() => { removeFn(row.id) }}>Remove</Button></TableCell>
                    <TableCell >
                      <Button style={{ backgroundColor: 'silver', color: "black" }} onClick={() => { handleClickOpen(row.id) }}>Edit</Button></TableCell>
                    <TableCell >
                      <Button style={{ backgroundColor: 'silver', color: "black" }} onClick={() => { changeStatus(row.id, row.status === 'verified' ? 'unverified' : 'verified') }}>
                        {row.status === 'verified' ? 'unverified' : 'verified'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 20, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
