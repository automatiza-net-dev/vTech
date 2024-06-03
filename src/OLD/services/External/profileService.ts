import api from "@/OLD/services";

// GET
const getAllProfiles = async () => await api.get("/external/profiles");

const checkProfile = async () => await api.get("/external/check-profile");

// POST
const syncProfileConfig = async (data) =>
  await api.post("/external/sync", data);

export const profileService = {
  getAllProfiles,
  syncProfileConfig,
  checkProfile
};
