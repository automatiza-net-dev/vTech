import { reasonService } from "@/OLD/services/reason.service";
import { useQuery } from "infinity-forge";

export const useGetAllReasons = ({ enabled, params }) => {
  return useQuery(["reasons", params], () => reasonService.getReasons(params), {
    enabled,
  });
};
