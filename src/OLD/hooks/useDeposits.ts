// @ts-nocheck
import { useQuery } from "@/presentation/use-query";
import { depositService } from "@/OLD/services/deposit.service";

import moment from "moment";

export const useDeposits = (origin, params) => {
  return useQuery({
    queryKey: ["deposits", origin, params],
    queryFn: () =>
      depositService.searchDeposits(params).then(({ data }) => data),
   enableCache: true
  });
};

export const useDepositMovements = (params, reload) => {
  if (!params?.from) {
    delete params?.from;
    delete params?.to;
  }

  const keys = Object.keys(params);
  let newObj = { ...params };

  if (keys.includes("from")) {
    newObj = {
      ...newObj,
      from: moment(params?.from).format("YYYY-MM-DD"),
      to: moment(params.to).format("YYYY-MM-DD"),
    };
  }

  return useQuery({
    queryKey: ["deposit-movements", params, reload],
    queryFn: () => {
      if (params?.noSearch) {
        return (data = []);
      }
      return depositService
        .searchDepositMovements(newObj)
        .then(({ data }) => data);
    },
    enableCache: true
  });
};
