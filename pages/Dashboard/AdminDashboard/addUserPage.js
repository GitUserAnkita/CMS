import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { Typography, TextField, Button, NativeSelect, DialogTitle,Box,Card,CardContent ,CardActions} from '@material-ui/core'
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

function AddUserPage() {
    const route = useRouter()

    const classes = useStyles();

    const [roleArray, setRoleArray] = useState([]);

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [phone, setPhone] = useState();
    const [role, setRole] = useState();

    const [nameErr, setNameErr] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    const [passErr, setPassErr] = useState(false);
    const [phoneErr, setPhoneErr] = useState(false);
    const [isError, setIsError] = useState(false);
    const [validEmailError, setValidEmailError] = useState(null);

    useEffect(() => {
        getallroles()
    }, []);


    const getallroles = async () => {
        await UserService.getAllRole().then((roleData) => {
            setRoleArray(roleData?.data)
        })
    }
    function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }
    const addUserFn = async (e) => {
        e.preventDefault();

        const data = {
            name: name,
            email: email,
            password: password,
            phone: phone,
            role: role
        }

        if (!name) { setNameErr(true) }
        if (!email) { setEmailErr(true) }
        if (!password) { setPassErr(true) }
        if (!phone) { setPhoneErr(true) }

        if (!name || !email || !phone || !password) {
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
            await UserService.addUser(data).then(res => {
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
                    route.push('/Dashboard/AdminDashboard/UserList')
                } else {
                    toast.error(res.data.message, {
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

    const getAlluser = async () => {
        const accestoken = localStorage.getItem('accessToken');
        await UserService.getAllUser(accestoken).then((res) => {

        })
    }

    return (
        <>
        <ToastContainer />
        <Box className={classes.root} >
            <Card >
                <CardContent>
                    <Typography variant="h5" style={{ textAlign: 'center' }}>Add User</Typography>

                    <form>
                        <FormControl fullWidth style={{marginTop:'20px'}}>
                            <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                Role
                            </InputLabel>
                            <NativeSelect
                                defaultValue={'Admin'}
                                inputProps={{
                                    name: 'age',
                                    id: 'uncontrolled-native',
                                }}
                                onChange={(e) => { setRole(e.target.value) }}>
                                {
                                    roleArray?.map((role) => {
                                        return (
                                            <option value={role?.id} key={role?.id}>{role?.title}</option>
                                        )
                                    })
                                }
                            </NativeSelect>
                        </FormControl>
                        <TextField fullWidth label='Name' placeholder="Enter your name" onChange={(e) => { setName(e.target.value) }} onKeyUp={() => { setNameErr(false) }}/>
                        {nameErr ? <span style={{ color: 'red' }}>Please fill Name </span> : ''}

                        <TextField fullWidth label='Email' placeholder="Enter your email"
                            onChange={(e) => { setEmail(e.target.value); if (!isValidEmail(e.target.value)) { setValidEmailError('Email is invalid'); } else { setValidEmailError(null); } }}
                            onKeyUp={(e) => { setEmailErr(false); if (isValidEmail(e.target.value)) { setValidEmailError(null); } }}/>
                        {emailErr ? <span style={{ color: 'red' }}>Please fill valid email</span> : ''}
                        {validEmailError ? <span style={{ color: 'red' }}>Invalid email</span> : ''}

                        <TextField type="tel" error={isError} fullWidth label='Phone' placeholder="Enter your Phone"
                            onChange={(e) => { setPhone(e.target.value); if (e.target.value.length > 10) { setIsError(true); } }}
                            onKeyUp={(e) => { setPhoneErr(false); if (e.target.value.length === 10) { setIsError(false); } }} />
                        {phoneErr ? <span style={{ color: 'red' }}>Please fill phone number</span> : ''}
                        {isError ? <span style={{ color: 'red' }}>Phone number must be 10 digits</span> : ''}

                        <TextField fullWidth label='Password' placeholder="Enter your password" onChange={(e) => { setPassword(e.target.value) }} />
                    </form>
                    
                </CardContent>
                <CardActions>
                    <Button style={{backgroundColor:'silver'}} onClick={(e)=>{addUserFn(e)}}>Add</Button>
                </CardActions>
            </Card>
        </Box>
        </>
    );
}

export default AddUserPage;