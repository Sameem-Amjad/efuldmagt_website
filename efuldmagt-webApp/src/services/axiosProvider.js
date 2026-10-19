import axios from "axios";

function getAxiosInstance(token) {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    // baseURL: "http://localhost:8000",
    // withCredentials: true,
    // credentials: 'include'
  });

  instance.defaults.headers.common["Authorization"] = "Bearer " + token;

  return instance;
}

export default getAxiosInstance;
