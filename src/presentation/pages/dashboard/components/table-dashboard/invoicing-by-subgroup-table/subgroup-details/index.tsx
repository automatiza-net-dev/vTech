import { useState } from "react";
import { Modal, useTable } from "infinity-forge";

import { SubgroupsDetails } from "@/domain";
import { useLoadSubgroupDetails } from "@/presentation";

import { columns } from "./columns";

export function InvoicingBySubgroupTable({ id }) {
  
  const { data } = useLoadSubgroupDetails({ subgroup: id });

  const { Table } = useTable<SubgroupsDetails>({
    columnsConfiguration: {
      columns,
    },
    configs: {
      disablePagination: true,
      disableOrdenationTable: true,
      disableGetFilter: true,
      pagination: {
        endPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        page: 1,
        pages: [1],
        pageSize: 1,
        startPage: 1,
        totalItems: 3,
        totalPages: 1,
      },
      errorMessage: "Não há itens no momento",
      tableData: data,
    },
  });

  return Table;
}

export function SubgroupDetails(props) {
  const [visible, setVisible] = useState(false);

  return (
    <Modal
      children={<InvoicingBySubgroupTable {...props} />}
      style={{
        maxWidth: "800px",
        padding: "20px",
        overflow: "auto",
        maxHeight: "95vh",
      }}
      modal={visible}
      setModal={setVisible}
      trigger={<span className="custom-link"> {props.description}</span>}
      key="subgroup-details"
    />
  );
}
