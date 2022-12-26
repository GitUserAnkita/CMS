import React, { useEffect, useRef, useState } from 'react'
import { Grid, Paper, Avatar, Typography, TextField, Button, NativeSelect, OutlinedInput, InputAdornment, IconButton, FilledInput, Input, } from '@material-ui/core'
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import UserService from '../../../Service/UserService';
import InputLabel from '@mui/material/InputLabel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { Visibility, VisibilityOff } from '@material-ui/icons';


const Signup = () => {
    const paperStyle = { padding: 20, width: 300, margin: "0 auto" }
    const headerStyle = { margin: 0 }
    const avatarStyle = { backgroundColor: '#1bbd7e' }
    const marginTop = { marginTop: 5 }

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [phone, setPhone] = useState();
    const [confirmPassword, setConfirmPassword] = useState()
    const [role, setRole] = useState();

    const [nameErr, setNameErr] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    const [passErr, setPassErr] = useState(false);
    const [phoneErr, setPhoneErr] = useState(false);
    const [confirmPasErr, setConfirmPasErr] = useState(false);
    const [isError, setIsError] = useState(false);
    const [validEmailError, setValidEmailError] = useState(null);

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const phoneRef = useRef(null);

    const [roleArray, setRoleArray] = useState([]);
    const route = useRouter()

    useEffect(() => {
        getallroles()
    }, []);


    const getallroles = async () => {
        await UserService.getAllRole().then((roleData) => {
            // setRole(roleData?.data[0].id)
            setRoleArray(roleData?.data)
            roleData?.data?.map((role) => {
                if (role.title === 'Subscriber') {
                    setRole(role?.id)
                }
            })
        })
    }

    const [values, setValues] = React.useState({
        password: '',
        showPassword: false,
    });
    
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
      };
    
      const handleClickShowPassword = () => {
        setValues({
          ...values,
          showPassword: !values.showPassword,
        });
      };
    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };

      function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
      }

    const signUpFn = async (e) => {
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
        if (password !== confirmPassword) {
            setConfirmPasErr(true)
        }

        if (!name || !email || !password || !phone) {
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
                    route.push('/Components/Auth')
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
            }).catch(err => {
                toast.error("Somthing went wrong to registration", {
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

    return (
        <div>

            <ToastContainer />
            <Grid>
                <Paper style={paperStyle}>
                    <Grid align='center'>
                        <Avatar style={avatarStyle}>
                            <AddCircleOutlineOutlinedIcon />
                        </Avatar>
                        <h2 style={headerStyle}>Sign Up</h2>
                    </Grid>
                    <form>
                
                        <TextField fullWidth label='Name' placeholder="Enter your name" ref={nameRef} onChange={(e) => { setName(e.target.value) }} onKeyUp={() => { setNameErr(false) }} />
                        {nameErr ? <span style={{ color: 'red' }}>Please fill Name </span> : ''}

                        <TextField fullWidth label='Email' placeholder="Enter your email" ref={emailRef} 
                        onChange={(e) => { setEmail(e.target.value);if (!isValidEmail(e.target.value)) { setValidEmailError('Email is invalid');} else {setValidEmailError(null);}  }} 
                        onKeyUp={(e) => { setEmailErr(false) ;if (isValidEmail(e.target.value)) {setValidEmailError(null); }}} />
                        {emailErr ? <span style={{ color: 'red' }}>Please fill valid email</span> : ''}
                        {validEmailError ? <span style={{ color: 'red' }}>Invalid email</span> : ''}


                        <TextField fullWidth label='Phone' placeholder="Enter your Phone" ref={phoneRef}
                         onChange={(e) => { setPhone(e.target.value);if (e.target.value.length > 10) {setIsError(true);} }} 
                         onKeyUp={(e) => { setPhoneErr(false); if (e.target.value.length === 10) {setIsError(false);} }} />
                        { phoneErr ? <span style={{ color: 'red' }}>Please fill Phone number</span> : '' }
                        { isError ? <span style={{ color: 'red' }}>Phone number must be 10 digits</span> : '' }

                        {/* <TextField fullWidth label='Passwordd' placeholder="Enter your password" ref={passwordRef} onChange={(e) => { setPassword(e.target.value) }} onKeyUp={()=>{setPassErr(false)}}/>
                        {passErr?<span style={{color:'red'}}>Please fill valid password</span>:''}

                        <TextField fullWidth label='Confirm Password' placeholder="Confirm your password"/>
                        {confirmPasErr?<span style={{color:'red'}}>password and confirm password is not same</span>:''} */}

                            <InputLabel htmlFor="standard-adornment-password" style={{marginTop:'15px'}}>Password</InputLabel>
                            <Input
                                id="standard-adornment-password"
                                type={values.showPassword ? 'text' : 'password'}
                                onChange={(e)=>{handleChange('password');setPassword(e.target.value)}}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        <Button type='submit' variant='contained' color='primary' style={{marginTop:'15px'}} onChange={(e) => { setConfirmPassword(e.target.value) }} onClick={(e) => { signUpFn(e) }}>Sign up</Button>
                    </form>
                </Paper>
            </Grid>
        </div>
    )
}

export default Signup;
