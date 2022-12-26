import axios from "axios";

export default axios.create({
    baseURL:"http://192.168.168.29:8080",
    // baseURL:"https://curious-veil-frog.cyclic.app/",

    headers: {
        "Content-type": "application/json"
      }
}); 
