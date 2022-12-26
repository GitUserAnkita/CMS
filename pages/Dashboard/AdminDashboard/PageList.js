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


export default function PageList() {
    const route = useRouter()

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [pageArray, setPageArray] = useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const [state, setstate] = useState({ query: '', pageArray: [] })

    useEffect(() => {
        getAllPage();
    }, []);

    const handleClickOpen = async (slug) => {
        route.push(`/Editor/EditTextEditor/${slug}`)
    };

    const getAllPage = async () => {
        const accestoken = localStorage.getItem('accessToken');
        await UserService.getAllPages(accestoken).then((pagedata) => {
            setPageArray(pagedata?.data)
        })
    }

    const changeStatus = async (id, status) => {
        const data = {
            status: status
        }
        const accestoken = localStorage.getItem('accessToken');
        await UserService.updatePage(id, data, accestoken).then((data) => {
            if (data.status === 200) {
                getAllPage()
            }
        })
    }

        const removeFn = async (id) => {
        const accestoken = localStorage.getItem('accessToken');
        await UserService.removePage(id, accestoken).then((res) => {
            if (res.status === 200) {
                toast.success(res.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                getAllPage();
            } else {
                toast.error('somthing went wrong to delete page', {
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
        const results = pageArray.filter(post => {
            var a, b,c ;
            if (e.target.value === "") return pageArray
            a = post.name.toLowerCase().includes(e.target.value.toLowerCase());
            b = post.status.toLowerCase().includes(e.target.value.toLowerCase());
            c = post.author.title.toLowerCase().includes(e.target.value.toLowerCase());
            return a || b || c;

        })
        setstate({
            query: e.target.value,
            pageArray: results
        })
    }
    return (
        <>
            <ToastContainer />
            <Box sx={{ flexGrow: 1 }}>
            <h1>Page List</h1>
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
                                onChange={handleChange} value={state.query} type="search" placeholder='search here'
                            />
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
                                <TableCell style={{ fontWeight: '800' }}>Id</TableCell>
                                <TableCell style={{ fontWeight: '800' }}>Name</TableCell>
                                <TableCell style={{ fontWeight: '800' }}>Author</TableCell>
                                <TableCell style={{ fontWeight: '800' }}>Status</TableCell>
                                <TableCell style={{ fontWeight: '800' }}>Remove</TableCell>
                                <TableCell style={{ fontWeight: '800' }}>Edit</TableCell>
                                <TableCell style={{ fontWeight: '800' }}>Change Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                state.query === '' ? pageArray?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.id}
                                        </TableCell>
                                        <TableCell >{row.name}</TableCell>
                                        <TableCell >{row?.author.title}</TableCell>
                                        <TableCell >{row.status}</TableCell>
                                        <TableCell ><Button style={{ backgroundColor: 'silver', color: "black" }} onClick={() => { removeFn(row.id) }}>Remove</Button></TableCell>
                                        <TableCell >
                                            <Button style={{ backgroundColor: 'silver', color: "black" }} onClick={() => { handleClickOpen(row.id) }}>Edit</Button></TableCell>
                                        <TableCell >
                                        <Button style={{ backgroundColor: 'silver', color: "black" }} onClick={() => { changeStatus(row.slug, row.status === 'UnPublished' ? 'Published' : 'UnPublished') }} >
                                                {row.status === 'UnPublished' ? 'Published' : 'UnPublished'} 
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                                    :
                                    state.pageArray?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                        <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.id}
                                        </TableCell>
                                        <TableCell >{row.name}</TableCell>
                                        <TableCell >{row?.author.title}</TableCell>
                                        <TableCell >{row.status}</TableCell>
                                        <TableCell ><Button style={{ backgroundColor: 'silver', color: "black" }} onClick={() => { removeFn(row.id) }}>Remove</Button></TableCell>
                                        <TableCell >
                                            <Button style={{ backgroundColor: 'silver', color: "black" }} onClick={() => { handleClickOpen(row.slug) }}>Edit</Button></TableCell>
                                        <TableCell >
                                        <Button style={{ backgroundColor: 'silver', color: "black" }} onClick={() => { changeStatus(row.slug, row.status === 'UnPublished' ? 'Published' : 'UnPublished') }} >
                                                {row.status === 'UnPublished' ? 'Published' : 'UnPublished'} 
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
                    count={pageArray.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </>
    );
}