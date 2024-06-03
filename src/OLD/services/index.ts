import axios from "axios";
import Cookies from "js-cookie";

const api = () => {

  const session = Cookies.get("token");

  const sessionParsed = session ? JSON.parse(session || "{value: null}") : null

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    headers: {
      Authorization: `Bearer ${sessionParsed?.value}`,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
    },
  });


  return instance;
};

export default api();
