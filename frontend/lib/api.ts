import axios from "axios";

const API = axios.create({
  baseURL: "https://college-discovery-production-5125.up.railway.app",
});

export default API;