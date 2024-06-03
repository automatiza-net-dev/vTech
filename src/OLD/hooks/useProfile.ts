import { useQuery } from "react-query";
import { userService } from "@/OLD/services/user.service";

export const useProfile = (type = false, reload = false) => {

  const { data, isLoading } = useQuery({
    queryKey: ["profile", type, reload],
    queryFn: async () => {
      const res = await userService.getUser();
      return res?.data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60, // 60s
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
