import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { Typography, TextField, Button, NativeSelect, DialogTitle, Box, Card, CardContent, CardActions } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useEffect, useRef, useState } from "react";
import UserService from "../../../Service/UserService";
import { useRouter } from 'next/router';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-number-input/style.css'


const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: "flex",
            flexWrap: "wrap",
            "& > *": {
                margin: '110px auto'
            },
        },
    })
);

const AddRolePage = () => {

    const route = useRouter()

    const classes = useStyles();
    const [roles, setRoles] = useState([]);
    const [description, setDescription] = useState();

    const [titleErr, settitleErr] = useState(false);
    const [descriptionErr, setDescriptionerr] = useState(false);

    const [roleValue, setRoleValue] = useState();
    const addRole = async () => {

        if (!roleValue) {
            settitleErr(true)
        }
        if (!description) {
            setDescriptionerr(true)
        }

        if (!roleValue) {
            toast.error("Please fill all fields", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            const accestoken = localStorage.getItem('accessToken');
            const data = {
                title: roleValue,
                description: description
            }
            await UserService.addRole(data, accestoken).then((data) => {
                console.log("datatatat", data)
                if (data.status === 200) {
                    toast.success('Role added successFully', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    route.push('/Dashboard/AdminDashboard/RoleList')
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
    }

    return (
        <>
            <ToastContainer />
            <Box className={classes.root} >
                <Card >
                    <CardContent>
                        <Typography variant="h5" style={{ textAlign: 'center' }}>Add New Role</Typography>

                        <form>
                            <TextField fullWidth label='Title' placeholder="Enter title" onChange={(e) => setRoleValue(e.target.value)} onKeyUp={() => { settitleErr(false) }} />
                            {titleErr ? <span style={{ color: 'red' }}>Please fill Title </span> : ''}
                            <TextField fullWidth label='Description' placeholder="Enter description" onChange={(e) => { setDescription(e.target.value) }} onKeyUp={() => { setDescriptionerr(false) }} />
                            {descriptionErr ? <span style={{ color: 'red' }}>Please fill Title </span> : ''}
                        </form>

                    </CardContent>
                    <CardActions>
                        <Button style={{ backgroundColor: 'silver' }} onClick={(e) => { addRole(e) }}>Add</Button>
                    </CardActions>
                </Card>
            </Box>
        </>
    )
}

export default AddRolePage