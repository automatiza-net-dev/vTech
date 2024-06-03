import Cookies from "js-cookie";
import { useQuery } from "react-query";
import { sessionService } from "@/OLD/services/session.service";
import { userService } from "@/OLD/services/user.service";
import { useRouter } from "next/router";

export const useProfile = (type = false, reload = false) => {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["profile", type, reload],
    queryFn: async () => {
      const cookie = Cookies.get("token");
      if (!cookie) {
        sessionService.logout();
        router.push("/");
        throw new Error("Token de login expirado");
      }
      const res = await userService.getUser();
      return res?.data;
    },
    onError: (err) => {
      // notification.error({
      //   message: "Erro",
      //   description: "Token de login expirado",
      // });
      // sessionService.logout();
      // router.push("/");
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
