import { reasonService } from "@/OLD/services/reason.service";
import { useQuery } from "infinity-forge";

export const useGetAllReasons = ({ enabled, params }) => {
  return useQuery({ queryKey: ["reasons", params], queryFn: () => reasonService.getReasons(params), enabled });
};
