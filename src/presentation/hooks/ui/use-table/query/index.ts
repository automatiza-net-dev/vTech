import { useQuery } from "react-query";

import {
  configsQuery,
  getTableInformations,
  defaultResponseTableInformations,
  IResponseGetTableInformations,
} from "./service";

import { IUseQueryTable } from "./interfaces";

export function useQueryTable({ router, tableKey, configs }: IUseQueryTable) {

  const { data, isFetching } = useQuery({
    ...configsQuery,
    enabled: configs?.disableFetch ? false : !!(router?.isReady),
    queryKey: [`table-${tableKey}`, router?.query],
    queryFn: () =>
      getTableInformations({ params: router?.query, tableKey }),
  });

  return {
    tableIsFetching: isFetching,
    tableInformations: configs?.tableData
      ? { ...defaultResponseTableInformations, items: configs?.tableData } as IResponseGetTableInformations
      : data,
  };
}
