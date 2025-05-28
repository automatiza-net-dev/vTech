import { reasonService } from "@/OLD/services/reason.service";
import { useQuery } from "@/presentation/use-query";

export const useGetAllReasons = ({ enabled, params }) => {
  return useQuery({ queryKey: ["reasons", params], queryFn: () => reasonService.getReasons(params), enabled });
};
