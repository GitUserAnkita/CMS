import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/system';
import { AppBar, Button, IconButton, Input, Toolbar, Typography } from '@mui/material';
import UserService from '../../../Service/UserService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import { useRouter } from 'next/router';

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
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },

    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


const Page = () => {
    const route = useRouter()
    const [pageArray, setPageArray] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        getAllPage()
    }, [])

    const getAllPage = async () => {
        const accestoken = localStorage.getItem('accessToken');
        await UserService.getAllPages(accestoken).then((pagedata) => {
            setPageArray(pagedata.data)
        })
    }

    const handleClickOpen = async () => {
        route.push('/Editor/RichTextEditor')
    }

    const detailsFn = async (id,slug) => {
        // route.push(`/Editor/ViewPage/${id}`)
        window.open(`/Editor/ViewPage/${slug}`, "_blank");
    }

    const handleSearch = async () => {
        const accestoken = localStorage.getItem('accessToken');
        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${accestoken}`,
            },
        };
        const { data } = await axios.get(`http://192.168.168.29:8080/api/page/getpages?search=${search}`, config);
        setLoading(false);
        setPageArray(data)
    };

    const editPageFn = async (id) => {
        route.push(`/Editor/EditPage/${id}`)
    }

    const removeFn = async (id) => {
        const accestoken = localStorage.getItem('accessToken');
        await UserService.removePage(id, accestoken).then((res) => {
            if (res.status === 200) {
            }
        })
    }

  
    return (
        <div>
           
            <TableContainer component={Paper} style={{ marginTop: '10px' }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Id</StyledTableCell>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Author</StyledTableCell>
                            <StyledTableCell>description</StyledTableCell>
                            <StyledTableCell>status</StyledTableCell>
                            <StyledTableCell>Actions</StyledTableCell>



                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            pageArray?.map((row) => (
                               
                                <StyledTableRow key={row.name}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.id}
                                    </StyledTableCell>
                                    <StyledTableCell>{row.name}</StyledTableCell>
                                    <StyledTableCell>{row.author.title}</StyledTableCell>

                                    <StyledTableCell>
                                        {row.description}
                                    </StyledTableCell>
                                    <StyledTableCell>{row.status}</StyledTableCell>
                                    <StyledTableCell>
                                        <Button onClick={() => { detailsFn(row.id,row.slug) }}>view</Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Page