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
    <div className="uk-margin-medium-top uk-container">
      <div className="uk-flex uk-flex-between uk-margin-medium">
        <h3 className="uk-line uk-margin-remove">Controle de Metas</h3>
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
  );
});

export default MetasManagement;
