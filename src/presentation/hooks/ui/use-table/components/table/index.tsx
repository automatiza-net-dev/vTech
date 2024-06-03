import { useRouter } from "next/router";
import Pagination from "@mui/material/Pagination";

import { updateRoute, Error, Skeleton } from "@/presentation";

import { THeadItem } from "./thead-item";
import { ScreenNotFound } from "@/presentation";
import { LoaderTable } from "./loader-table";

import { ITableProps } from "./interfaces";

import * as S from "./styles";

export function Table({
  configs,
  columnsTable,
  tableInformations,
}: ITableProps) {
  const router = useRouter();

  const handleChange = (_, page: number) => {
    updateRoute({ params: { page }, router });
  };

  const paramToSearch =
    ((router.query?.search as string) || "")?.toLowerCase() || "";

  const tableFilered = configs?.enableSearchInSelf
    ? tableInformations?.items && tableInformations?.items.length > 0
      ? tableInformations?.items?.filter((item) => {
          const stringfyItem = item ? JSON.stringify(item) : "";

          return stringfyItem?.toLowerCase()?.includes(paramToSearch);
        })
      : null
    : null;

  const tableData = tableFilered || tableInformations?.items || [];

  if (configs.isFetching) {
    return <LoaderTable />;
  }

  if (tableData?.length === 0) {
    return <ScreenNotFound text={configs?.errorMessage} disableBack />;
  }

  return (
    <Error name="table-component">
      <S.Table $tableFullWidth={!!configs?.tableFullWidth} $widthHeader={0}>
        <div>
          <table>
            <thead>
              <tr>
                {columnsTable?.map((colunm, index) => {
                  return (
                    <THeadItem
                      key={colunm.id + index}
                      index={index}
                      colunm={colunm}
                      disableOrdenationTable={configs?.disableOrdenationTable}
                    />
                  );
                })}
              </tr>
            </thead>

            {!configs?.isFetching &&
              tableInformations?.items &&
              tableInformations?.items?.length !== 0 && (
                <Error name="Error_tbody">
                  <tbody>
                    {tableData?.map((table, index) => {
                      return (
                        <tr key={table.id + String(index)}>
                          {columnsTable?.map((e, i) => {
                            function getProps() {
                              const props = Object.keys(
                                e.Component?.props || {}
                              ).reduce((reducer, propriedade) => {
                                let newReducer = reducer;

                                newReducer[propriedade] =
                                  table[e.Component?.props[propriedade]];

                                return { ...newReducer };
                              }, {});

                              return props;
                            }

                            const props = e.Component?.allProps
                              ? table
                              : e.Component?.props
                              ? getProps()
                              : {};

                            const defaultProps = e.Component?.defaultProps
                              ? e.Component?.defaultProps
                              : {};

                            return (
                              <Error
                                name="Error_td"
                                key={String(index) + String(i)}
                              >
                                <td key={String(index) + String(i)}>
                                  {e.Component ? (
                                    <e.Component.Element
                                      {...props}
                                      {...defaultProps}
                                    />
                                  ) : (
                                    table[e.id]
                                  )}
                                </td>
                              </Error>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </Error>
              )}
          </table>

          {configs?.isFetching && (
            <Error name="Skeleton">
              <Skeleton type="table" spacing={0} />
            </Error>
          )}
        </div>

        {!configs?.disablePagination && (
          <Error name="Pagination">
            <div className="pagination">
              <Pagination
                count={tableInformations?.totalPages || 1}
                page={Number(router.query.page || 1)}
                onChange={handleChange}
              />
            </div>
          </Error>
        )}
      </S.Table>
    </Error>
  );
}
