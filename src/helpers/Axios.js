import axios from "axios";

const Axios = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "accept": "application/json",
    "Authorization": localStorage.getItem("token"),
    "Project": localStorage.getItem("project_id"),
  },
});

export default Axios;
