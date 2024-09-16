// @ts-nocheck
import { Table } from "antd";
import { memo, useMemo } from "react";
import { columns } from "./columns";
import { Create } from "./Create";
import { useQuery } from "react-query";
import { metasService } from "@/OLD/services/metas.service";
import { Edit } from "./Edit";
import { Delete } from "./Delete";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { PageWrapper } from "infinity-forge";

const MetasManagement = memo(() => {
  const { data, isLoading } = useQuery({
    queryKey: ["metas"],
    queryFn: () => metasService.getAll(),
  });

  const createMeta = useUserHasPermission("MET01");
  const updateMeta = useUserHasPermission("MET02");
  const deleteMeta = useUserHasPermission("MET03");

  const mappedData = useMemo(() => {
    if (!data) {
      return [];
    }

    return data?.data.map((item) => ({
      id: item.id,
      description: item.description,
      type: item.type,
      active: item.active ? "Sim" : "Não",
      createdAt: item.created_at,
      actions: (
        <div className="uk-flex" style={{ gap: "10px" }}>
          <Edit item={item} canUpdate={updateMeta} />
          <Delete id={item.id} canDelete={deleteMeta} />
        </div>
      ),
    }));
  }, [JSON.stringify(data)]);

  return (
    <PageWrapper title="Controle de metas">
      <div style={{ padding: "20px" }}>
        <div>
          <Create canCreate={createMeta} />
        </div>
        <div>
          <Table
            locale={{
              emptyText: "Nenhum registro encontrado para essa pesquisa",
            }}
            dataSource={mappedData}
            loading={isLoading}
            columns={columns()}
          />
        </div>
      </div>
    </PageWrapper>
  );
});

export default MetasManagement;
