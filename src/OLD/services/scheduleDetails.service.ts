import api from "@/OLD/services";

const changeStatus = async (data) => await api.put("/schedules/status", data);

export const scheduleDetailsService = {
  changeStatus,
};
