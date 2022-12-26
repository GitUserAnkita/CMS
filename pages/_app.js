
import React, { useEffect, useState } from 'react';
import '../styles/globals.css'
import Viewpage from './Editor/ViewPage/[id]';
import Navbar from './Navbar';

import Sidebar from './Sidebar';

function MyApp({ Component, pageProps }) {
  const [loginuser, setLoginUser] = useState();
  const [viewFlag,setViewFlag] = useState();

  useEffect(() => {
    setLoginUser(JSON.parse(localStorage.getItem('loginUser')));
    setViewFlag(localStorage.getItem('viewFlag'))
  }, []);
  
  return (
    <React.StrictMode>
    <div>
      
      {loginuser ? 
        <Sidebar>
         <Component {...pageProps} />
        </Sidebar>
        :  <Component {...pageProps} />
      }
      
    </div> 
    </React.StrictMode>
  )
}

export default MyApp;
