import { useQuery } from "infinity-forge";
import { userService } from "@/OLD/services/user.service";

export const useProfile = (type = false, reload = false) => {
  const { data, isLoading } = useQuery({
    queryKey: ["profile", type, reload],
    queryFn: async () => {
      const res = await userService.getUser();
      return res?.data;
    },
    interval: 1000 * 60, // 60s
    enableCache: true,
  });

  return {
    user: data?.user,
    clinic: data?.unit,
    loadingProfile: isLoading,
    cls: data?.cl ?? [],
  };
};

export const useUserHasPermission = (cl) => {
  const { cls, loadingProfile } = useProfile();
  return loadingProfile ? "loading" : cls.includes(cl);
};
