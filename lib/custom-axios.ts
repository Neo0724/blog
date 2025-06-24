import axios from "axios";

const customAxios = axios.create({
  timeout: 10_000,
  withCredentials: true,
});

export default customAxios;
