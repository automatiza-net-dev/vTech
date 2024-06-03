import { Table, SearchBar } from "./components";

import { IUseTableProps } from "./interfaces";

export function useTable(props: IUseTableProps) {
  return {
    Table: (
      <Table
        {...props}
        tableInformations={{
          items: props.configs?.tableData,
          hasNextPage: false,
          hasPreviousPage: false,
          pageIndex: 0,
          pageSize: 0,
          totalCount: 0,
          totalPages: 0,
        }}
      />
    ),
    SearchBar: <SearchBar isFetching={false} options={[]} />,
  };
}
