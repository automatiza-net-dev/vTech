import api from "@/OLD/services";

const getReasons = async (params) => {
  const { data } = await api.get("/reasons", {
    params
  });

  return data ?? [];
};

export const reasonService = {
  getReasons
};
