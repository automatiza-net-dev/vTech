import { useState, useEffect } from "react";
import { profileService } from "@/OLD/services/External/profileService";
import { adminService } from "@/OLD/services/admin.service";

export const useExternalProfiles = (reload) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    profileService
      .getAllProfiles()
      .then((res) => setProfiles(res.data))
      .catch((_err) => setLoading(false))
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [loading]);

  return {
    profiles,
    loadingProfiles: loading,
  };
};

export const useSearchProfileInfo = (params) => {
  const [info, setInfo] = useState<{ profiles: {id: string}[] }>({ profiles: [] });
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    adminService
      .searchInfo(params)
      .then((res) => setInfo(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  return {
    info,
    loadingInfo: loading,
    fetchInfo: fetchData,
  };
};
