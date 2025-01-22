import { useQuery, useAuthAdmin } from "infinity-forge";
import { userService } from "@/OLD/services/user.service";

export const useProfile = (type = false, reload = false) => {
  const { data, isLoading } = useQuery({
    queryKey: ["profile", type, reload],
    queryFn: async () => {
      const res = await userService.getUser();
      return res?.data;
    },
    interval: 1000 * 60, 
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
  const cls = useAuthAdmin();

  return cls?.user?.cl?.includes(cl);
};
