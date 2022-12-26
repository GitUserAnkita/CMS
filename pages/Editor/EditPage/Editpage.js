import React, { useEffect, useRef, useState } from 'react';
import EmailEditor from 'react-email-editor';
import { AppBar, Box, Button, FormControl, InputLabel, NativeSelect, TextField, Toolbar } from '@mui/material';
import UserService from '../../../Service/UserService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import sample from "../sample.json";
// import fs from 'fs'
const EditPage = () => {
  var replaced

  const router = useRouter()

  const [user, SetUser] = useState()
  const [name, setName] = useState();
  const [status, setStatus] = useState('Published');
  const [slug, setSlug] = useState();
  const [onLoadData, setOnLoadData] = useState()
  const [data, setData] = useState('')
  const [sampleDesign, setSampleDesign] = useState({})
  const [pageId, setPageId] = useState('')

  const [nameErr, setNameErr] = useState(false);
  const [slugErr, setSlugErr] = useState(false);

  const emailEditorRef = useRef(null);
  const { id } = router.query

  useEffect(() => {
    getPage()
    const u = JSON.parse(localStorage.getItem('loginUser'));
    if (u.role.title === 'Author') {
      setStatus('UnPublished')
    }
    SetUser(u);
  }, [])

  const exportHtml = async () => {
    emailEditorRef.current.editor.exportHtml((data) => {
      const { design, html } = data;
      pageFn(html, design)
    });
  };

  const getPage = async () => {
    const accestoken = localStorage.getItem('accessToken');
    await UserService.getOnePages(id).then((data) => {

      setPageId(data?.data?.id)
      setStatus(data?.data?.status)
      setName(data?.data?.name)
      setSlug(data?.data?.slug)
      setSampleDesign(data?.data?.design)
      setOnLoadData(data?.data)
      setData(data?.data?.html)



    //   fs.writeFile('../sample.json', sampleDesign, (err) => {
    //     if (err) console.log('Error writing file:', err);
    // })
    })
  }

  const pageFn = async () => {

    emailEditorRef.current.editor.exportHtml((data) => {
      const { design, html } = data;

      const s = generateSlug(slug)
      if (!name || !slug) {
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
        const accestoken = localStorage.getItem('accessToken');
        const pagedata = {
          name: name,
          status: status,
          slug: s,
          html: html,
          design: JSON.stringify(design)
        }

        UserService.updatePage(id, pagedata, accestoken).then((res) => {
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
            // router.push('/Dashboard/AdminDashboard/PageList');
            window.location = '/Dashboard/AdminDashboard/PageList'
          }
        })
      }
    });

  }

  const onDesignLoad = (data) => {
    console.log("onDesignLoad", data);
  };

  const onLoad = () => {
   
    emailEditorRef.current.editor.addEventListener(
      "onDesignLoad",
      onDesignLoad
    );
    emailEditorRef.current.editor.loadDesign(sample);
  };

  const onReady = () => {
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
            <Button onClick={() => { pageFn() }}>Update Page</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch', marginTop: '25px' }, }} noValidate autoComplete="off">
        <TextField id="outlined-basic" label="name" variant="outlined" defaultValue={name} onChange={(e) => { setName(e.target.value) }} onKeyUp={() => { setNameErr(false) }} />
        {nameErr ? <span style={{ color: 'red' }}>Please fill Name </span> : ''}

        {user && user?.role?.title === 'Author' ? '' : <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Status
          </InputLabel>
          <NativeSelect onChange={(e) => setStatus(e.target.value)} defaultValue={status}>
            <option value='Published'>Published</option>
            <option value='UnPublished'>UnPublished</option>
          </NativeSelect>
        </FormControl>}

        <TextField id="standard-basic" label="slug" variant="outlined" defaultValue={slug} onChange={(e) => { setSlug(e.target.value) }} onKeyUp={() => { setSlugErr(false) }} />
        {slugErr ? <span style={{ color: 'red' }}>Please fill Name </span> : ''}
      </Box>
      <EmailEditor ref={emailEditorRef} onLoad={onLoad} onReady={onReady} />
    </div>
  );
}

export default EditPage


