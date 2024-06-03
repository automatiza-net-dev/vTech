import { ParsedUrlQuery } from "querystring";

import { AxiosHttpClient } from "infinity-forge";
import { fromBase64ToString } from "../utils/buffer";

interface IGetTableService {
  params?: ParsedUrlQuery;
  tableKey: string | null;
}

function formatFilterParams(params: string | string[] | undefined) {
  const filterDecoded = fromBase64ToString(params);

  const formatedParams = Object.keys(filterDecoded).reduce((reducer, param) => {
    const valueParam = Object.keys(filterDecoded[param]).reduce((r, value) => {
      return r ? r + "," + value : value;
    }, "");

    const obj = { [param]: valueParam };

    return { ...reducer, ...obj };
  }, {});

  return formatedParams;
}

export function getTablePayload(params: ParsedUrlQuery | undefined): any {
  const ord = {
    asc: undefined,
    ordIndex: undefined,
    ord: params?.ordIndex
      ? String(params?.ordIndex + (params?.asc === "true" ? ":asc" : ""))
      : undefined,
  };

  const formatedFilterParams = formatFilterParams(params?.filter);

  const queryParamsPayload = {
    ...params,
    filter: undefined,
  };

  return {
    ...ord,
    limit: "10",
    ...queryParamsPayload,
    ...formatedFilterParams,
    init: undefined,
  };
}

export interface IResponseGetTableInformations {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items: any[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export const defaultResponseTableInformations: IResponseGetTableInformations = {
  hasNextPage: false,
  hasPreviousPage: false,
  items: [],
  pageIndex: 1,
  pageSize: 1,
  totalCount: 1,
  totalPages: 1,
};

async function getTableInformations({
  params,
  tableKey,
}: IGetTableService): Promise<IResponseGetTableInformations | undefined> {
  try {
    const payload = getTablePayload(params);

    const response = await new AxiosHttpClient().request({
      method: "get",
      url: `/${tableKey}`,
      body: payload,
    });

    return response.data;
  } catch {
    return defaultResponseTableInformations;
  }
}

const configsQuery = {
  retry: 0,
  staleTime: 0,
  refetchInterval: 0,
  refetchOnWindowFocus: false,
};

export { configsQuery, getTableInformations };
