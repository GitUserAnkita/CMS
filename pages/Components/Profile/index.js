import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Grid, Paper, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import UserService from '../../../Service/UserService';
import { Phone } from '@material-ui/icons';
import { useRouter } from 'next/router';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

const Profile = ({ children }) => {
    const route = useRouter()
    const paperStyle = { padding: 20, height: '25vh', width: 350, margin: "0 auto" }
    const avatarStyle = { backgroundColor: '#1bbd7e' }
    const [open, setOpen] = React.useState(false);
    const [loginuser, setLoginuser] = React.useState();
    const [myData, setMyData] = React.useState();


    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        setLoginuser(JSON.parse(localStorage.getItem('loginUser')));
        myProfile()
    }, [])

    const myProfile = async () => {
        const u = JSON.parse(localStorage.getItem('loginUser'))
        const accestoken = localStorage.getItem('accessToken');
        UserService.getUserProfile(u?.id, accestoken).then((userData) => {
            setMyData(userData.data)
        })
    }

    const logoutFn = async () => {
        localStorage.removeItem('loginUser');
        localStorage.removeItem('accessToken');
        window.location = '/'
        // route.push('/')
    }


    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                {children}
            </Button>
            <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} >
                <BootstrapDialogTitle id="customized-dialog-title" >
                    My Profile
                </BootstrapDialogTitle>
                <DialogContent dividers style={paperStyle}>
                    <Grid>
                        <Paper>
                            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                <nav aria-label="main mailbox folders">
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <InboxIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={myData?.name} />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <DraftsIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={myData?.email} />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <Phone />
                                                </ListItemIcon>
                                                <ListItemText primary={myData?.phone} />
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                </nav>
                                <Divider />
                            </Box>
                        </Paper>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Close
                    </Button>
                    <Button autoFocus onClick={() => { logoutFn(); handleClose() }}>
                        LogOut
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}

export default Profile