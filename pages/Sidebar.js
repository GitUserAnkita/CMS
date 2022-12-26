import React, { useEffect, useState } from 'react'
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Icon from '@material-ui/core/Icon'
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Profile from './Components/Profile';
import { Avatar } from '@mui/material';
import UserService from '../Service/UserService';
import { Button } from '@material-ui/core';



import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function Sidebar({ children }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const [loginuser, setLoginUser] = useState()
  const [accessToken, setAccesstoken] = useState();
  const [menuLink, setMenuLink] = useState([])
  const [show, setShow] = useState('home');
  const [pageArray, setPageArray] = useState([]);



  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('loginUser'));
    setAccesstoken(localStorage.getItem('accessToken'));
    getPublishPages();
    if (u && u?.role?.title === 'Admin') {
      setShow(u?.role?.title)
    }
    else if (u && u?.role?.title === 'Editor') {
      setShow(u?.role?.title)
    }
    else if (u && u?.role?.title === 'Author') {
      setShow(u?.role?.title)
    }
    else if (u && u?.role?.title === 'Subscriber') {
      setShow(u?.role?.title)
    }
    else {
      setShow('home')
    }
  }, [show])

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getPublishPages = async () => {
    const accestoken = localStorage.getItem('accessToken');
    await UserService.getAllPages(accestoken).then(pages => {
      setPageArray(pages.data)
    })
  }

  const pageFn = async (slug) => {
    localStorage.setItem('viewFlag', slug);
    window.open(`/Editor/ViewPage/${slug}`);
  }

  const LinkItems = [

    { name: 'My profile', href: '/Dashboard/AdminDashboard/Profile', show: 'Admin' },
    { name: 'Users', href: '/Dashboard/AdminDashboard/UserList', show: 'Admin' },
    { name: 'Add User', href: '/Dashboard/AdminDashboard/addUserPage', show: 'Admin' },
    { name: 'Roles', href: '/Dashboard/AdminDashboard/RoleList', show: 'Admin' },
    { name: 'Add Role', href: '/Dashboard/AdminDashboard/addRolePage', show: 'Admin' },
    { name: 'Create Page', href: '/Editor/RichTextEditor', show: 'Admin' },
    { name: 'Pages', href: '/Dashboard/AdminDashboard/PageList', show: 'Admin' },

    { name: 'My profile', href: '/Dashboard/AdminDashboard/Profile', show: 'Editor' },
    { name: 'Pages', href: '/Dashboard/AdminDashboard/PageList', show: 'Editor' },
    { name: 'Create Page', href: '/Editor/RichTextEditor', show: 'Editor' },


    { name: 'My profile', href: '/Dashboard/AdminDashboard/Profile', show: 'Author' },
    { name: 'Pages', href: '/Dashboard/AdminDashboard/PageList', show: 'Author' },
    { name: 'Create Page', href: '/Editor/RichTextEditor', show: 'Author' },

    { name: 'My profile', href: '/Dashboard/AdminDashboard/Profile', show: 'Subscriber' },
    { name: 'Pages', href: '/Dashboard/SubscriberDashboard/page', show: 'Subscriber' },

    { name: 'Home', href: '/', show: 'home' },
    { name: 'Services', href: '/', show: 'home' },
    { name: 'Terms and condition', href: '/', show: 'home' },
    { name: 'About us', href: '/', show: 'home' },
    { name: 'Help', href: '/', show: 'home' },

  ]
  const logoutFn = async () => {
    localStorage.removeItem('loginUser');
    localStorage.removeItem('accessToken');
    window.location = '/'
    // route.push('/')
}

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} style={{ backgroundColor: 'white', color: 'black', border: 'none' }}>
        <Toolbar>
          {/* <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon >{children}</MenuIcon>
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} style={{ color: 'black' }}>

          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {pageArray?.map((item) => {
              if (item.status === 'Published') {
                return (
                  <Button key={item.name} sx={{ color: '#3f51b5' }} onClick={() => { pageFn(item.slug) }}>
                    {item.name}
                  </Button>
                )
              }
            })}
          </Box>
          {/* <Typography color="inherit">
            {
              accessToken ?
                <Profile>
                  <Avatar alt="Remy Sharp" ></Avatar>
                </Profile>
                : 'Account'}
          </Typography> */}

          <Typography color="inherit">  
            {
              accessToken ?
               <Button onClick={()=>{logoutFn()}}>Logout</Button>
                : 'Account'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} style={{ border: 'none' }}>
        <DrawerHeader>
          <Typography style={{ marginRight: '150px', fontWeight: 'bold' }}>CMS</Typography>
          {/* <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton> */}
        </DrawerHeader>
        <List>
          {LinkItems?.map((text, index) => (
            text.show === show &&
            <ListItem disablePadding sx={{ display: 'block' }} key={text.name}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                href={text.href}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  {/* <Icon>{text.icon}</Icon> */}
                </ListItemIcon>
                <ListItemText primary={text.name} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>


      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <div >
          {children}
        </div>
      </Box>
    </Box>
  );
}


