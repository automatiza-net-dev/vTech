import api from "@/OLD/services";

const getReschedulingReasons = async () => await api.get("/reasons?type=RA");

export const reschedulingService = {
  getReschedulingReasons
};
