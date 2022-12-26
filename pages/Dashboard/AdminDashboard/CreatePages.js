import React, { useEffect, useRef, useState } from 'react';
import EmailEditor from 'react-email-editor';
import dynamic from 'next/dynamic'
import { AppBar, Box, Button, FormControl, InputLabel, NativeSelect, TextField, Toolbar } from '@mui/material';
import UserService from '../../../Service/UserService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

const CreatePages = () => {
  
  const route = useRouter()
  const [user, SetUser] = useState()
  const [name, setName] = useState();

  const [status, setStatus] = useState('Published');
  const [slug, setSlug] = useState();

  const [nameErr, setNameErr] = useState(false);
  const [slugErr, setSlugErr] = useState(false);

  const emailEditorRef = useRef(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('loginUser'));
    if(u.role.title === 'Author'){
      setStatus('UnPublished')
    }
    SetUser(u);
  }, [])

  const exportHtml = async () => {
    emailEditorRef.current.editor.exportHtml((data) => {
      const { design, html } = data;
      if(!name){setNameErr(true)}
      if(!slug){setSlugErr(true)}
      
      if(!name || !slug){
        toast.error("please fill all fields", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
      }else{

        pageFn(html,design)
      }
    });
  };

  const pageFn = async (html,design) => {
    const s = await generateSlug(slug)
    const accestoken = localStorage.getItem('accessToken');
    const u = JSON.parse(localStorage.getItem('loginUser'));
  
    const pagedata = {
      name: name,
      description: ' ',
      author: u.id,
      status: status,
      slug: s,
      html: html,
      design:JSON.stringify(design)
    }
   
    await UserService.createPageApi(pagedata, accestoken).then((res) => {
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
        })
        route.push('/Dashboard/AdminDashboard/PageList')
      }
    })
  }

  const onLoad = () => {
    // editor instance is created
    // you can load your template here;
    // const templateJson = {};
    // emailEditorRef.current.editor.loadDesign(templateJson);
  }

  const onReady = () => {
    // editor is ready
    console.log('onReady');
  };

  const generateSlug = async (str) => {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to = "aaaaeeeeiiiioooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes


    return str;
  }

  return (
    <div>
      <ToastContainer />

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ backgroundColor: 'Silver' }}>
          <Toolbar>
            <Button onClick={exportHtml}>Create Page</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch', marginTop: '25px' },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField id="outlined-basic" label="name" variant="outlined" onChange={(e) => { setName(e.target.value) }} onKeyUp={()=>{setNameErr(false)}} />
        {/* {nameErr ? <span style={{ color: 'red' }}>Please fill Name </span> : ''} */}

        {user && user?.role?.title === 'Author' ? '' : <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Status
          </InputLabel>
          <NativeSelect onChange={(e) => setStatus(e.target.value)} >
            <option value='Published'>Published</option>
            <option value='UnPublished'>UnPublished</option>
          </NativeSelect>
        </FormControl>}

        <TextField id="standard-basic" label="slug" variant="outlined" onChange={(e) => { setSlug(e.target.value) }} onKeyUp={()=>{setSlugErr(false)}}/>
        {/* {slugErr ? <span style={{ color: 'red' }}>Please fill slug </span> : ''} */}
      </Box>
      <EmailEditor ref={emailEditorRef} onLoad={onLoad} onReady={onReady} />
    </div>

  );
}



export default CreatePages


