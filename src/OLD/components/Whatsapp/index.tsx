import { memo, useState } from "react";
import { useRouter } from "next/router";

import { useWhatsappConfig } from "@/OLD/hooks/useWhatsappConfig";
import { whatsappConfigService } from "@/OLD/services/whatsapp-config.service";

import { Container } from "./styles";
import { Table, Tag } from "antd";
import Filters from "./Filters";

import { whatsappColumns } from "./Columns";

import { Button, PageWrapper, Popconfirm, useMutation } from "infinity-forge";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { BsFillChatDotsFill } from "react-icons/bs";

const WhatsappConfig = memo(function WhatsappConfig() {
  const router = useRouter();

  const [filters, setFilters] = useState<Record<string, string>>({});
  const configsQuery = useWhatsappConfig(filters);
  const deleteConfig = useMutation({
    queryKey: ["delete-mutation"],
    queryFn: async (id: string) => {
      await whatsappConfigService.removeConfig(id);
      configsQuery.refetch();
    },
  });

  const data = configsQuery.data
    ? configsQuery.data.map((cfg) => ({
        id: cfg.id,
        phone: cfg.whatsappPhone,
        platform: cfg.platformIntegration,
        status: cfg.connectionStatus,
        statusDate: new Date(cfg.connectionStatusDate).toLocaleDateString(),
        active: (
          <Tag color={cfg.active ? "green" : "yellow"}>
            {cfg.active ? "Sim" : "Não"}
          </Tag>
        ),
        actions: (
          <section
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <BsFillChatDotsFill
              onClick={() => {
                router.push(`/dashboard/whatsapp/mensagens/${cfg.id}`);
              }}
              style={{ cursor: "pointer", fontSize: "1.2rem" }}
            />
            <FiEdit2
              onClick={() => {
                router.push(`/dashboard/whatsapp/editar/${cfg.id}`);
              }}
              style={{ cursor: "pointer", fontSize: "1.2rem" }}
            />
            <Popconfirm
              onConfirm={async () => {
                deleteConfig.mutate(cfg.id);
              }}
              idTooltip="a"
              title="Você deseja mesmo apagar esse item?"
              position="top-right"
            >
              <FiTrash2 style={{ cursor: "pointer", fontSize: "1.2rem" }} />
            </Popconfirm>
          </section>
        ),
      }))
    : [];

  return (
    <PageWrapper title="Configurações de Whatsapp">
      <Container>
        <Filters
          filters={filters}
          setFilters={setFilters}
          shouldRefetch={() => configsQuery.refetch()}
        />
        <div className="uk-flex uk-flex-right" style={{ gap: 20 }}>
          <Button
            onClick={() => router.push("/dashboard/whatsapp/novo")}
            text="Cadastrar"
          />
          <Button text="Filtrar" />
        </div>
        <hr />
        <Table columns={whatsappColumns} dataSource={data} />
      </Container>
    </PageWrapper>
  );
});

export default WhatsappConfig;
