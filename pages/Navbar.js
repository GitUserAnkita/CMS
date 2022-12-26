import React, { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar } from '@mui/material';
import Profile from './Components/Profile';
import UserService from '../Service/UserService';
import { useRouter } from 'next/router';

const Navbar = () => {
    const route = useRouter()
    const [loginuser, setLoginUser] = useState()
    const [loginUserImg, setLoginUserImg] = useState();
    const [pageArray, setPageArray] = useState([])

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('loginUser'));
        const pic = u?.pic
        getPublishPages()
        setLoginUser(JSON.parse(localStorage.getItem('loginUser')));
        setLoginUserImg(pic)
    }, [])

    const getPublishPages = async () => {
        await UserService.getAllPages().then(pages => {
            setPageArray(pages.data)
        })
    }
    const pageDEtailFn = (slug) => {
        localStorage.setItem('viewFlag', slug);
        window.open(`/Editor/ViewPage/${slug}`);
    }

    const accountFn = async () => {
     route.push('/')
    }

    return (
        <Box sx={{ flexGrow: 1 }}>

            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static"  style={{backgroundColor: 'white' ,color:'black',}}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                            CMS
                        </Typography>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {pageArray?.map((item) => {
                                if (item.status === 'Published') {
                                    return (
                                        <Button key={item.name} sx={{ color: '#3f51b5' }} onClick={() => { pageDEtailFn(item.slug) }}>
                                            {item.name}
                                        </Button>
                                    )
                                }
                            })}
                        </Box>
                        <Typography color="black">
                            {loginuser ?
                                <Profile>
                                    <Avatar alt="Remy Sharp" ></Avatar>
                                </Profile>
                                : <Button sx={{ color: '#3f51b5' }} onClick={() => { accountFn() }}>
                                    Account
                                </Button>}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
        </Box>
    )
}

export default Navbar