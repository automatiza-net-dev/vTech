import Cookies from "js-cookie";
import api from "@/OLD/services";

const login = async (data) => await api.post("/auth/login", data);

const logout = () => {
  Cookies.remove("JB$S");
  window.location.replace("/");
}


export const sessionService = { login, logout };
