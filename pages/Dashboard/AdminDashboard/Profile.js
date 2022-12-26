import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import { Grid, Paper, Avatar, Typography, TextField, Button, NativeSelect, DialogTitle, Box } from '@material-ui/core'
import { Dialog, DialogActions, DialogContent, FormControl, InputLabel } from '@mui/material';
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import UserService from '../../../Service/UserService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Stack } from '@mui/system';

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
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
export default function Profile() {
    const [open, setOpen] = useState(false);
    const [loginuser, setLoginuser] = useState();
    const [myData, setMyData] = useState();
    const [roleArray, setRoleArray] = useState([])

    const [roleValue, setRoleValue] = useState();
    const [roleTitle, setRoleTitle] = useState();

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [status, setStatus] = useState();


    const [nameErr, setNameErr] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    const [statusErr, setStatusErr] = useState(false);
    const [phoneErr, setPhoneErr] = useState(false);
    const [isError, setIsError] = useState(false);
    const [validEmailError, setValidEmailError] = useState(null);

    const paperStyle = { padding: 20, width: 300, margin: "0 auto" }
    const avatarStyle = { backgroundColor: '#1bbd7e' }



    const classes = useStyles();

    const handleClickOpen = () => {
        setOpen(!open);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    useEffect(() => {
        setLoginuser(JSON.parse(localStorage.getItem('loginUser')));
        getallroles()
        myProfile()
    }, [])

    const getallroles = async () => {
        await UserService.getAllRole().then((roleData) => {
            setRoleArray(roleData?.data)
        })
    }

    const myProfile = async () => {
        const u = JSON.parse(localStorage.getItem('loginUser'))
        const accestoken = localStorage.getItem('accessToken');
        await UserService.getUserProfile(u?.id, accestoken).then((userData) => {
            setMyData(userData.data);

            setRoleValue(userData.data.role.id)
            setRoleTitle(userData.data.role.title)
            setName(userData.data.name)
            setEmail(userData.data.email)
            setPhone(userData.data.phone)
            setStatus(userData.data.status)
        })
    }

    const updateProfile = async () => {
        const u = JSON.parse(localStorage.getItem('loginUser'));
        const accestoken = localStorage.getItem('accessToken');

        if (!name) { setNameErr(true) }
        if (!email) { setEmailErr(true) }
        if (!phone) { setPhoneErr(true) }
        if (!status) { setStatusErr(true) }

        if (!name || !email || !phone ||!status) {
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
            const data = {
                name,
                email,
                phone,
                role: roleValue,
                status
            }
            await UserService.updateprofile(u.id, data, accestoken).then(data => {
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
                    setOpen(false);
                    myProfile()
                }
            })
        }
    }
    return (
        <div>
            <ToastContainer />
            {!open ? <Box>
                <Stack>
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: red[500] }} src={loginuser?.pic} aria-label="avatar" />
                        }
                        action={
                            <IconButton aria-label="settings">
                                <EditIcon onClick={handleClickOpen} />
                            </IconButton>
                        }
                    />

                    <Item>
                        <Stack direction="row" spacing={20}>

                            <Item style={{ marginTop: '20px', width: '25rem' }}>
                                <FormControl fullWidth >
                                    <TextField id="filled-helperText" value={roleTitle} variant="filled" helperText="Role" InputProps={{ readOnly: true, }} />
                                </FormControl>

                            </Item>
                            <Item style={{ marginTop: '20px', width: '25rem' }}>
                                <FormControl fullWidth >
                                    <TextField id="filled-helperText" value={name} helperText='Name' variant="filled" InputProps={{ readOnly: true, }} />
                                </FormControl>
                            </Item>
                        </Stack>
                        <Stack direction="row" spacing={20}>
                            <Item style={{ marginTop: '20px', width: '25rem' }}>
                                <FormControl fullWidth >
                                    <TextField id="filled-helperText" value={email} variant="filled" helperText="Email" InputProps={{ readOnly: true, }} />
                                </FormControl>

                            </Item>
                            <Item style={{ marginTop: '20px', width: '25rem' }}>
                                <FormControl fullWidth >
                                    <TextField id="filled-helperText" value={phone} helperText='Phone' variant="filled" InputProps={{ readOnly: true, }} />
                                </FormControl>
                            </Item>
                        </Stack>
                        <Stack direction="row" spacing={20}>
                            <Item style={{ marginTop: '20px', width: '25rem' }}>
                                <FormControl fullWidth >
                                    <TextField id="filled-helperText" value={status} variant="filled" helperText="Status" InputProps={{ readOnly: true, }} />
                                </FormControl>
                            </Item>
                        </Stack>
                    </Item>
                </Stack>
            </Box>
                :

                <Box>
                    <Stack>
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: red[500] }} src={loginuser?.pic} aria-label="avatar" />
                            }
                            action={
                                <IconButton aria-label="settings">
                                    <EditIcon onClick={handleClickOpen} />
                                </IconButton>
                            }
                        />

                        <Item>
                            <Stack direction="row" spacing={20}>
                                <Item style={{ marginTop: '20px', width: '25rem' }}>
                                    <FormControl fullWidth style={{ marginTop: '20px' }}>
                                        <NativeSelect
                                            value={roleTitle}
                                            inputProps={{
                                                name: 'age',
                                                id: 'uncontrolled-native',
                                            }}
                                            onChange={(e) => { setRoleValue(e.target.value) }}>
                                            <option value={roleValue}>{roleTitle}</option>
                                            {
                                                roleArray?.map((role) => {
                                                    return (
                                                        <option value={role?.id} key={role?.id}>{role?.title}</option>
                                                    )
                                                })
                                            }
                                        </NativeSelect>
                                    </FormControl>
                                </Item>

                                <Item style={{ marginTop: '20px', width: '25rem' }}>
                                    <FormControl fullWidth >
                                        <TextField id="outlined-helperText" defaultValue={name} helperText="Name" onChange={(e) => { setName(e.target.value) }} onKeyUp={() => { setNameErr(false) }} />
                                        {nameErr ? <span style={{ color: 'red' }}>Please fill Name </span> : ''}
                                    </FormControl>
                                </Item>
                            </Stack>


                            <Stack direction="row" spacing={20}>
                                <Item style={{ marginTop: '20px', width: '25rem' }}>
                                    <FormControl fullWidth >
                                        <TextField id="outlined-helperText" defaultValue={email} helperText="Email"
                                            onChange={(e) => { setEmail(e.target.value); if (!isValidEmail(e.target.value)) { setValidEmailError('Email is invalid'); } else { setValidEmailError(null); } }}
                                            onKeyUp={(e) => { setEmailErr(false); if (isValidEmail(e.target.value)) { setValidEmailError(null); } }}
                                        />
                                        {emailErr ? <span style={{ color: 'red' }}>Please fill valid email</span> : ''}
                                        {validEmailError ? <span style={{ color: 'red' }}>Invalid email</span> : ''}
                                    </FormControl>

                                </Item>

                                <Item style={{ marginTop: '20px', width: '25rem' }}>
                                    <FormControl fullWidth >
                                        <TextField id="outlined-helperText" defaultValue={phone} helperText="Phone"
                                            onChange={(e) => { setPhone(e.target.value); if (e.target.value.length > 10) { setIsError(true); } }}
                                            onKeyUp={(e) => { setPhoneErr(false); if (e.target.value.length === 10) { setIsError(false); } }}
                                        />
                                        {phoneErr ? <span style={{ color: 'red' }}>Please fill phone number</span> : ''}
                                        {isError ? <span style={{ color: 'red' }}>Phone number must be 10 digits</span> : ''}
                                    </FormControl>
                                </Item>
                            </Stack>


                            <Stack direction="row" spacing={20}>
                                <Item style={{ marginTop: '20px', width: '25rem' }}>
                                    <FormControl fullWidth style={{ marginTop: '20px' }}>
                                        
                                        <NativeSelect onChange={(e) => setStatus(e.target.value)} defaultValue={status}>
                                            <option value='verified'>verified</option>
                                            <option value='unverified'>unverified</option>
                                        </NativeSelect>
                                    </FormControl>
                                </Item>
                            </Stack>


                            <Stack direction="row" spacing={20}>
                                <Item style={{ marginTop: '20px', width: '25rem', cursor: 'pointer', fontSize: '20px' }} onClick={() => updateProfile()}>
                                    update
                                </Item>
                                <Item style={{ marginTop: '20px', width: '25rem', cursor: 'pointer', fontSize: '20px' }} onClick={() => handleClose()}>
                                    Cancel
                                </Item>
                            </Stack>
                        </Item>
                    </Stack>
                </Box>
            }

        </div>
    );
}