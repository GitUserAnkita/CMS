import http from "./http-common";
class userService {

  loginUser(data) {
    return http.post("/api/user/signin", data);
  }

  addUser(userData) {
    return http.post("api/user/createuser", userData);
  }

  getAllUser(token) {
    return http.get('/api/user/getusers', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
  }

  addRole(data, token) {
    return http.post(`/api/role/createrole`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
  }

  getAllRole() {
    return http.get('/api/role/getrole');
  }

  deletRole(id, token) {
    return http.put(`/api/role/deleterole/${id}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
  }

  getUserProfile(id, token) {
    // return http.get(`api/user/${id}`);
    return http.get(`api/user/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
  }


  updateprofile(id, data, token) {
    return http.put(`api/user/${id}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      },

    })
  }

  removeUser(id, token) {
    return http.delete(`/api/user/deleteuser/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
  }

  forgetPassLink(data,) {
    return http.post('api/user/forgotpassword', data)
  }
  
  resetPassLink(data, token) {
    return http.post('api/user/resetPassword', data, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
  }

  createPageApi(data, token) {
    return http.post('/api/page/createpage', data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  getAllPages() {
    return http.get('api/page/getpages')
  }

  // getOnePages(slug, token) {
  //   return http.get(`/api/page/slug/${slug}`, {
  //     headers: {
  //       'Authorization': `Bearer ${token}`
  //     }
  //   })
  // }

  getOnePages(slug) {
    return http.get(`/api/page/slug/${slug}`)
  }
  
  updatePage(id, data,token) {
    return http.put(`api/page/updatepage/${id}`, data,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  removePage(id, token) {
    return http.delete(`api/page/deletepage/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }
}

export default new userService();

