import { Table, SearchBar } from "./components";

import { IUseTableProps } from "./interfaces";

export function useTable(props: IUseTableProps) {
  return {
    Table: (
      <Table
        {...props}
        tableInformations={{
          items: props.configs?.tableData,
          hasNextPage: true,
          hasPreviousPage: true,
          pageIndex: 0,
          pageSize: 10,
          totalCount: 0,
          totalPages: 10,
        }}
      />
    ),
    SearchBar: <SearchBar isFetching={false} options={[]} />,
  };
}
