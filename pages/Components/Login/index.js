import React, { useState } from 'react'
import { Grid, Paper, Avatar, TextField, Button, Typography, Link } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import UserService from '../../../Service/UserService';
import { useRouter } from 'next/router';
import jwt from 'jwt-decode';
import jsonwebtoken from 'jsonwebtoken'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Stack } from '@mui/system';
import { styled } from '@mui/material/styles';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
}));

const Login = ({ handleChange }) => {
    const route = useRouter()
    const [isForgot, setIsForgot] = useState(false)

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const [emailErr, setEmailErr] = useState(false);
    const [passErr, setPassErr] = useState(false);

    const paperStyle = { padding: 20,  width: 300, margin: "0 auto" }
    const avatarStyle = { backgroundColor: '#1bbd7e' }
    const btnstyle = { margin: '8px 0' }

    const loginFn = async () => {

        if (!email) { setEmailErr(true) }
        if (!password) { setPassErr(true) }
        if (!email || !password) {
            toast.error("Please fill all fields", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",  
        })
        }
        else{
            const data = {
                email: email,
                password: password
            }
            await UserService.loginUser(data).then(res => {
                const token = res.data.accessToken
                const user = jwt(token);
    
                if (res.status === 200) {
                    toast.success('Login successfully ', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    localStorage.setItem("accessToken", res.data.accessToken)
                    localStorage.setItem("loginUser", JSON.stringify(user.data))
                    if (user.data.role.title === "Admin") {
                        // route.push('/Dashboard/AdminDashboard/admin')
                        window.location = '/Dashboard/AdminDashboard/admin'
                    }
                    else if (user.data.role.title === "Editor") {
                        // route.push('/Dashboard/EditorDashboard/editor')
                        window.location = '/Dashboard/EditorDashboard/editor'
                    }
                    else if (user.data.role.title === "Author") {
                        // route.push('/Dashboard/AuthorDashboard/Author')
                        window.location = '/Dashboard/AuthorDashboard/Author'
                    } else if (user.data.role.title === "Subscriber") {
                        // route.push('/Dashboard/SubscriberDashboard/Subscribe')
                        window.location = '/Dashboard/SubscriberDashboard/Subscribe'
                    }
                } else {
                    toast.error('Login Failed ', {
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
    
            }).catch(err => {
                toast.error('Oops ! something went wrong in login ! ', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            })
        }

        
    }

    const forgetPassFn = async () => {
        // const accestoken = localStorage.getItem('accessToken');
        const data = {
            email: email
        }

        const signingKey = process.env.SIGNING_KEY || 'cms_seceret';
        const jwt = jsonwebtoken.sign(
            { data: data },
            signingKey,
            { expiresIn: '1h' }
        );

        localStorage.setItem("resetAuth", jwt)
        await UserService.forgetPassLink(data).then((res) => {
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
            }
        })

    }



    return (
        <div>
            <ToastContainer />
            <Grid>
                {!isForgot ? <Paper style={paperStyle}>
                    <Grid align='center'>
                        <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                        <h2>Sign In</h2>
                    </Grid>
                    <TextField label='Username' placeholder='Enter username' fullWidth required onChange={(e) => { setEmail(e.target.value) }} onKeyUp={()=>{setEmailErr(false)}}/>
                    {emailErr?<span style={{color:'red'}}>Please fill valid email</span>:''}
                    <TextField label='Password' placeholder='Enter password' type='password' fullWidth required onChange={(e) => { setPassword(e.target.value) }} onKeyUp={()=>{setPassErr(false)}}/>
                    {passErr?<span style={{color:'red'}}>Please fill valid password</span>:''}
                    <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth onClick={() => { loginFn() }}>Sign in</Button>
                    <Typography >
                        <Link href="#" onClick={() => setIsForgot(true)} >
                            Forgot password ?
                        </Link>
                    </Typography>
                </Paper>
                    :
                    <Grid style={{ marginTop: "5px" }}>
                        <Paper style={paperStyle}>

                            <Stack style={{ marginBottom: '10px' }} direction="row" spacing={2}>
                                <Item>
                                    <Button onClick={() => { setIsForgot(!isForgot) }}> <KeyboardBackspaceIcon /></Button>
                                </Item>
                            </Stack>

                            <TextField label='Email' placeholder='Enter Email' type='text' fullWidth required onChange={(e) => setEmail(e.target.value)} />
                            <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth onClick={() => { forgetPassFn() }}>Send</Button>
                        </Paper>
                    </Grid>
                }

            </Grid>
        </div>
    )
}

export default Login
