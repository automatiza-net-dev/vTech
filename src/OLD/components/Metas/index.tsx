// @ts-nocheck
import { Table } from "antd";
import { memo, useMemo } from "react";
import { columns } from "./columns";
import { Create } from "./Create";
import { useQuery } from "infinity-forge";
import { metasService } from "@/OLD/services/metas.service";
import { Edit } from "./Edit";
import { Delete } from "./Delete";
import { Details } from "./Details";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { PageWrapper, useTable } from "infinity-forge";
import { useLoadAllMetas } from "@/presentation";
import { IMeta } from "@/domain";
import { useTableMetasActions } from "./table";

const MetasManagement = memo(() => {
  const { data, isLoading, mutate } = useLoadAllMetas();

  const actions = useTableMetasActions({ mutate });

  const { Table } = useTable<IMeta>({
    columnsConfiguration: {
      columns,
      actions,
    },
    configs: {
      disableRoutingUpdateFilters: true,
      errorMessage: "Não há itens no momento",
      tableData: data || [],
    },
  });

  return <PageWrapper title="Controle de metas">{Table}</PageWrapper>;
});

export default MetasManagement;
