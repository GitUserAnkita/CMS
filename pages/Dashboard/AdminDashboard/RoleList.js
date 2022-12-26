import React, { useEffect, useRef, useState } from 'react';
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


export default function RoleList() {
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

  const [roleArray, setRoleArray] = useState([]);

  const [state, setstate] = useState({ query: '', roleArray: [] })

  useEffect(() => {
    getallroles()
  }, []);

  const handleClickOpen = async (id) => {
    route.push(`/Dashboard/AdminDashboard/EditRole/${id}`)
  };

  const getallroles = async () => {
    await UserService.getAllRole().then((roleData) => {
      setRoleArray(roleData?.data)
    })
  }

  const removeFn = async (id) => {
    const accestoken = localStorage.getItem('accessToken');
    await UserService.deletRole(id, accestoken).then(data => {
      if (data.status === 200) {
        toast.success(data.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        getallroles()
      } else {
        toast.error(data.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    })
  }

  const handleChange = (e) => {
    const results = roleArray.filter(post => {
      if (e.target.value === "") return roleArray
      return post.title.toLowerCase().includes(e.target.value.toLowerCase()) 
    })
    setstate({
      query: e.target.value,
      roleArray: results
    })
  }

  return (
    <>
      <ToastContainer />
      <Box sx={{ flexGrow: 1 }}>
      <h1>Role List</h1>
        <AppBar position="static" style={{ backgroundColor: 'white', color: 'black', border: 'none' }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <Input onChange={handleChange} value={state.query} type="search" placeholder='search by role name'  />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>


        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: '800' }}>ID</TableCell>
                <TableCell style={{ fontWeight: '800' }}>Title</TableCell>      
                <TableCell style={{ fontWeight: '800' }}>Description</TableCell>
                <TableCell style={{ fontWeight: '800' }}>Remove</TableCell>
                {/* <TableCell style={{ fontWeight: '800' }}>Edit</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {
               state.query === '' ? roleArray?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell >{row.title}</TableCell>
                    <TableCell >{row.description}</TableCell>
                    <TableCell ><Button style={{ backgroundColor: 'silver', color: "black" }} onClick={() => { removeFn(row.id) }}>Remove</Button></TableCell>
                    {/* <TableCell >
                      <Button style={{ backgroundColor: 'silver', color: "black" }} onClick={() => { handleClickOpen(row.id) }}>Edit</Button></TableCell> */}
                  </TableRow>
                ))
                :
                 state.roleArray?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell >{row.title}</TableCell>
                    <TableCell >{row.description}</TableCell>
                    <TableCell ><Button style={{ backgroundColor: 'silver', color: "black" }} onClick={() => { removeFn(row.id) }}>Remove</Button></TableCell>
                    {/* <TableCell >
                      <Button style={{ backgroundColor: 'silver', color: "black" }} onClick={() => { handleClickOpen(row.id) }}>Edit</Button></TableCell> */}
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 20, 25]}
          component="div"
          count={roleArray.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
