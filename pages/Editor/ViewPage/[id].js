import React, { useEffect, useState } from 'react'
import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import UserService from '../../../Service/UserService';
import Navbar from '../../Navbar';

const ViewPage = () => {
  const router = useRouter()
 const { slug } = router.query 

  const [html, setHtml] = useState('');
  const [accesstoken, setAccessToken] = useState()


  useEffect(() => {
    setAccessToken(localStorage.getItem('accessToken'))
    getPage()
  }, [])


  const getPage = async () => {

    const slug = localStorage.getItem('viewFlag');
    await UserService.getOnePages(slug).then((data) => {
      setHtml(data?.data?.html)
    })
  }

  const options = {
    replace: (domNode) => {
      if (domNode.attribs && domNode.attribs.class === 'remove') {
        return <></>;
      }
    },
  };

  if (!accesstoken) {
    return <>
      <Navbar />
      {parse(html, options)}
    </>
  } else {
    return parse(html, options);
  }
}


export default ViewPage

