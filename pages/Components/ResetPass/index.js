import React, { useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Grid, Paper, Avatar, Button, } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useRouter } from 'next/router';
import UserService from '../../../Service/UserService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

``
export default function ResetPass() {
    const route = useRouter()

    const paperStyle = { padding: 20, height: '40vh', width: 300, margin: "0 auto" }
    const avatarStyle = { backgroundColor: '#1bbd7e' }
    const btnstyle = { margin: '8px 0' }

    const [password, setpassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    const [values, setValues] = React.useState({
        password: '',
        showPassword: false,
    });

    useEffect(() => {
        const resettoken = localStorage.getItem('resetAuth')
        if (!resettoken) {
            route.push('/Components/Login')
        }
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

    const changeFn = async () => {
        const resettoken = localStorage.getItem('resetAuth')
        const data = {
            password: password,
            confirm_password: confirmPassword
        }
        await UserService.resetPassLink(data, resettoken).then(res => {
          
            if(res.status===200){
                route.push('/Components/Login')
                localStorage.removeItem('resetAuth')
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
            }else{
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

    return (
<div>
    <ToastContainer/>
        <Grid>
            <Paper style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                    <h2>Reset Password</h2>
                </Grid>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={values.showPassword ? 'text' : 'password'}
                        // value={values.password}
                        onChange={(e) => { setpassword(e.target.value) }}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                </FormControl>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Confirm password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        onChange={(e) => { setConfirmPassword(e.target.value) }}
                        type={values.showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                </FormControl>
                <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth onClick={() => { changeFn() }}>Change</Button>
            </Paper>
        </Grid>

        </div>
    );
}