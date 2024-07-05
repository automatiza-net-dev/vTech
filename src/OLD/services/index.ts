// @ts-nocheck
import { TypesAutomatiza, container } from "@/container";
import axios from "axios";
import { Storage } from "infinity-forge";

const api = () => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
      "X-System": process.env.clientName as string,
    },
  });

  instance.interceptors.request.use(function (config: any) {
    const session = process.browser
      ? container.get<Storage>(TypesAutomatiza.storage).get("user")?.value
      : "";

    config.headers.Authorization = "Bearer " + session;

    return config;
  });

  return instance;
};

export default api();
