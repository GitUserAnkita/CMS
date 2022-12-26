import React, { useEffect, useRef, useState } from 'react';
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { Typography, Button, NativeSelect, Box, Card, CardContent, CardActions } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-number-input/style.css';
import UserService from '../../../../Service/UserService';

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


const EditRole = () => {
    const router = useRouter()
    const classes = useStyles();

    const [roles, setRoles] = useState([]);
    const [description, setDescription] = useState();
    const [roleValue, setRoleValue] = useState();

    const [titleErr, settitleErr] = useState(false);
    const [descriptionErr, setDescriptionerr] = useState(false);

    const { id } = router.query;

    useEffect(() => {
        getallroles()
    }, [])
    const updateFn = async (id) => {

    }

    const getallroles = async () => {
        console.log("id",id)
        await UserService.getAllRole().then((roleData) => {
            //   setRoleArray(roleData?.data)
            roleData?.data.map((e)=>{
                console.log(";;;;;",e)
            })
        })
    }

    const cancelFn = async () => {
        router.push('/Dashboard/AdminDashboard/RoleList')
    }

    return (
        <>
            <ToastContainer />
            <Box className={classes.root} >
                <Card >
                    <CardContent>
                        <Typography variant="h5" style={{ textAlign: 'center' }}>Update Role</Typography>

                        <form>
                            <TextField fullWidth label='Title' style={{ marginTop: '10px' }} placeholder="Enter title" onChange={(e) => setRoleValue(e.target.value)} onKeyUp={() => { settitleErr(false) }} />
                            {titleErr ? <span style={{ color: 'red' }}>Please fill Title </span> : ''}
                            <TextField fullWidth label='Description' style={{ marginTop: '10px' }} placeholder="Enter description" onChange={(e) => { setDescription(e.target.value) }} onKeyUp={() => { setDescriptionerr(false) }} />
                            {descriptionErr ? <span style={{ color: 'red' }}>Please fill Title </span> : ''}
                        </form>

                    </CardContent>
                    <CardActions>
                        <Button style={{ backgroundColor: 'silver' }} onClick={(e) => { updateFn(e) }}>Update</Button>
                        <Button style={{ backgroundColor: 'silver' }} onClick={() => { cancelFn() }}>Cancel</Button>
                    </CardActions>
                </Card>
            </Box>
        </>
    )
}

export default EditRole