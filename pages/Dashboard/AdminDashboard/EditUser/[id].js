import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {  createStyles, makeStyles } from "@material-ui/core/styles";
import { Typography, Button, NativeSelect, Box, Card, CardContent, CardActions } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import UserService from '../../../../Service/UserService';
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

const Edituser = () => {
    var a, b, c, d;
    const router = useRouter()

    const classes = useStyles();

    const [roleArray, setRoleArray] = useState([]);

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [role, setRole] = useState();
    const [roleValue, setRoleValue] = useState();

    const [nameErr, setNameErr] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    const [phoneErr, setPhoneErr] = useState(false);
    const [isError, setIsError] = useState(false);
    const [validEmailError, setValidEmailError] = useState(null);

    const { id } = router.query;
    
    useEffect(() => {
        getallroles();
        getUserprofile()
    }, []);


    const getallroles = async () => {
        await UserService.getAllRole().then((roleData) => {
            setRoleArray(roleData?.data)
        })
    }
    function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    const getUserprofile = async () => {
        if (id) {
            const accestoken = localStorage.getItem('accessToken');
            await UserService.getUserProfile(id, accestoken).then(data => {
                setRoleValue(data?.data?.role?.id)
                setName(data?.data?.name)
                setEmail(data?.data?.email)
                setPhone(data?.data?.phone)
                setRole(data?.data?.role?.title)
            })
        }

    }

    const updateFn = async () => {

        if (!name) { setNameErr(true) }
        if (!email) { setEmailErr(true) }
        if (!phone) { setPhoneErr(true) }
    
        if (!name || !email || !phone) {
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
            name: name,
            email: email,
            phone: phone,
            role: roleValue,
          }
          const accestoken = localStorage.getItem('accessToken');
    
          await UserService.updateprofile(id, data, accestoken).then((data) => {
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
              window.location = '/Dashboard/AdminDashboard/UserList'
            } else {
              toast.error("somting went wrong to update user", {
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

    const cancelFn =() =>{
        router.push('/Dashboard/AdminDashboard/UserList')
    }

    return (
        <>
            <ToastContainer />
            <Box className={classes.root} >
                <Card >
                    <CardContent>
                        <Typography variant="h5" style={{ textAlign: 'center' }}>Update User Details</Typography>

                        <form>
                            <FormControl fullWidth style={{ marginTop: '20px' }}>
                                <NativeSelect
                                    value={role}
                                    inputProps={{
                                        name: 'age',
                                        id: 'uncontrolled-native',
                                    }}
                                    onChange={(e) => { setRole(e.target.value) }}>
                                          <option value={roleValue}>{role}</option>
                                    {
                                        roleArray?.map((role) => {
                                            return (
                                                <option value={role?.id} key={role?.id}>{role?.title}</option>
                                            )
                                        })
                                    }
                                </NativeSelect>
                                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                    Role
                                </InputLabel>
                            </FormControl>

                            <FormControl fullWidth style={{ marginTop: '20px' }}>
                                <TextField id="filled-helperText" value={name} helperText='Name' variant="filled" onChange={(e) => { setName(e.target.value) }} onKeyUp={() => { setNameErr(false) }}  />
                                {nameErr ? <span style={{ color: 'red' }}>Please fill Name </span> : ''}
                            </FormControl>

                            <FormControl fullWidth style={{ marginTop: '20px' }}>
                                <TextField id="filled-helperText" value={email} helperText='Email' variant="filled"  onChange={(e) => { setEmail(e.target.value); if (!isValidEmail(e.target.value)) { setValidEmailError('Email is invalid'); } else { setValidEmailError(null); } }}
                                onKeyUp={(e) => { setEmailErr(false); if (isValidEmail(e.target.value)) { setValidEmailError(null); } }} />
                                {emailErr ? <span style={{ color: 'red' }}>Please fill valid email</span> : ''}
                                {validEmailError ? <span style={{ color: 'red' }}>Invalid email</span> : ''}
                            </FormControl>

                            <FormControl fullWidth style={{ marginTop: '20px' }}>
                                <TextField id="filled-helperText" value={phone} helperText='Phone' variant="filled" type="tel" error={isError} fullWidth 
                                onChange={(e) => { setPhone(e.target.value); if (e.target.value.length > 10) { setIsError(true); } }}
                                onKeyUp={(e) => { setPhoneErr(false); if (e.target.value.length === 10) { setIsError(false); } }}/>
                                {phoneErr ? <span style={{ color: 'red' }}>Please fill phone number</span> : ''}
                                {isError ? <span style={{ color: 'red' }}>Phone number must be 10 digits</span> : ''}
                            </FormControl>

                        </form>
                    </CardContent>
                    <CardActions>
                        <Button style={{ backgroundColor: 'silver' }} onClick={(e) => { updateFn(e) }}>Update</Button>
                        <Button style={{ backgroundColor: 'silver' }} onClick={()=>{cancelFn()}}>Cancel</Button>
                    </CardActions>
                </Card>
            </Box>
        </>
    )
}

export default Edituser