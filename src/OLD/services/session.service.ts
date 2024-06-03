import api from "@/OLD/services";

const login = async (data) => await api.post("/auth/login", data);

export const sessionService = { login };
