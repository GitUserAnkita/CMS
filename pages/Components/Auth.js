import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Paper from '@material-ui/core/Paper';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Login from '../Components/Login/index'
import Signup from '../Components/SignUp/index'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Avatar, ListItemButton } from '@mui/material';
import Profile from './Profile';
import UserService from '../../Service/UserService';
import { Button, List, ListItem, ListItemText } from '@material-ui/core';
import { useRouter } from 'next/router';
import Navbar from '../Navbar';


const Auth = () => {
    const route = useRouter()

    const [value, setValue] = useState('1');
    const [loginuser, setLoginUser] = useState()
    const [loginUserImg, setLoginUserImg] = useState();
    const [pageArray, setPageArray] = useState([])


    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('loginUser'));
        const pic = u?.pic
        getPublishPages();
        setLoginUser(JSON.parse(localStorage.getItem('loginUser')));
        setLoginUserImg(pic)
    }, []);

    const getPublishPages = async () => {
        const accestoken = localStorage.getItem('accessToken');
        await UserService.getAllPages(accestoken).then(pages => {
            setPageArray(pages.data)
        })
    }


    const paperStyle = { width: 400, margin: "20px auto" }
    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    const accountFn = async () => {
       route.push('/')
    }

    const pageDEtailFn =(slug)=>{
        localStorage.setItem('viewFlag',slug);
     window.open(`/Editor/ViewPage/${slug}`);
    }

    return (
        <div>
            {/* <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                            CMS
                        </Typography>
                        {pageArray? <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {pageArray?.map((item) => {
                                if (item?.status === 'Published') {
                                    return (
                                        <Button key={item.name} sx={{ color: '#fff' }} onClick={()=>{pageDEtailFn(item.slug)}}>
                                            {item.name}
                                        </Button>
                                    )
                                }
                            })}
                        </Box>:''}
                       
                        <Typography color="inherit">
                            {loginuser ?
                                    <Profile>
                                        <Avatar alt="Remy Sharp" ></Avatar>
                                    </Profile>
                                    : <Button sx={{ color: '#fff' }} onClick={()=>{accountFn()}}>
                                        Account
                                    </Button>}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box> */}
           {/* <Navbar /> */}
            <Paper elevation={20} style={paperStyle}>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
                                <Tab label="SignIn" value="1" />
                                <Tab label="SignUp" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel value="1"><Login /></TabPanel>
                        <TabPanel value="2"><Signup /></TabPanel>
                    </TabContext>
                </Box>
            </Paper>
        </div>
    )
}

export default Auth