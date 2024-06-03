import api from "@/OLD/services";

const openAttendance = async (data) => await api.post("/attendances/open", data);

const closeAttendance = async (id) => await api.put(`/attendances/close/${id}`);

const showAttendance = async (id) => await api.get(`/attendances/show/${id}`);

const listAttendance = async ({ patient }) =>
  await api.get(
    `/attendances${patient ? `?patient=${patient}` : ""}`
  );

const updateAttendance = async (id, data) =>
  await api.put(`/attendances/update/${id}`, data);

export const attendanceService = {
  openAttendance,
  showAttendance,
  updateAttendance,
  closeAttendance,
  listAttendance
};
