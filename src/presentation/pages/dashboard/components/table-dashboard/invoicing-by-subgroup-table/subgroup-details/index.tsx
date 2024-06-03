import { useState } from "react";
import { Modal } from "infinity-forge";
import { useTable } from "infinity-forge";

import { SubgroupsDetails } from "@/domain";

import { columns } from "./columns";

import * as S from "./styles";

import { useLoadSubgroupDetails } from "@/presentation/hooks";

export function InvoicingBySubgroupTable({
  details,
}: {
  details: SubgroupsDetails[] | [];
}) {
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
      tableData: details,
    },
  });

  return Table;
}

export function SubgroupDetails(props) {
  const [visible, setVisible] = useState(false);

  const { data } = useLoadSubgroupDetails({
    subgroupFilters: { subgroup: props.id },
  });

  return (
    <Modal
      children={<InvoicingBySubgroupTable details={data || []} />}
      style={{ maxWidth: "800px", padding: "20px" }}
      modal={visible}
      setModal={setVisible}
      trigger={<span className="custom-link"> {props.description}</span>}
      key="subgroup-details"
    />
  );
}
