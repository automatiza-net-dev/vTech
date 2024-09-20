import api from "@/OLD/services";

const getAllProfiles = async () => await api.get("/external/profiles");

const checkProfile = async () => await api.get("/external/check-profile");

export const profileService = {
  getAllProfiles,
  checkProfile,
};
