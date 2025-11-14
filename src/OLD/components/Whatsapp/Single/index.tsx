import { memo, useState } from "react";
import { Button, PageWrapper, useQuery } from "infinity-forge";
import { useParams } from "next/navigation";
import { whatsappConfigService } from "@/OLD/services/whatsapp-config.service";
import { Input as AntdInput, DatePicker, Modal, Table } from "antd";
import { BsFillChatDotsFill } from "react-icons/bs";
import { InputBox, Input } from "../styles";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { MdOutlineClear } from "react-icons/md";
import moment from "moment";

const WhatsappSingle = memo(function WhatsappSingle() {
  const params = useParams();

  const [jsonMessage, setJsonMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    platformIntegration: "",
    whatsappPhone: "",
    startDate: moment().startOf("day").format("YYYY-MM-DD"),
    endDate: moment().endOf("day").format("YYYY-MM-DD"),
  });

  const messages = useQuery({
    queryKey: ["whatsapp", params.id ?? "0", "messages"],
    queryFn: async () => {
      const result = await whatsappConfigService.searchMessages(
        params.id as string,
        filters,
      );
      return result.data;
    },
  });

  const shouldRefetch = () => messages.refetch();

  const tableData =
    messages.data?.map((msg) => ({
      id: msg.id,
      event_created: msg.event_created,
      phone: msg.phone,
      platformIntegration: msg.platformIntegration,
      processed: msg.processed ? "Sim" : "Não",
      created_at: msg.created_at,
      actions: (
        <section style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <BsFillChatDotsFill
            onClick={() => {
              setJsonMessage(JSON.stringify(msg.payload, null, 2));
            }}
            style={{ cursor: "pointer", fontSize: "1.2rem" }}
          />
        </section>
      ),
    })) ?? [];

  return (
    <PageWrapper title="Configurações de Whatsapp">
      <Modal
        open={!!jsonMessage}
        onCancel={() => setJsonMessage(null)}
        width={800}
      >
        <pre>{jsonMessage}</pre>
      </Modal>
      <div
        className=""
        style={{
          marginTop: "50px",
        }}
      >
        <section className="uk-margin-top uk-margin-bottom">
          <section style={{ display: "flex", width: "100%" }}>
            <div style={{ width: "25%" }}>
              <Input style={{ width: "100%" }}>
                <label htmlFor="">Datas</label>
                <DatePicker.RangePicker
                  onCalendarChange={(_, [from, to]) => {
                    setFilters((prv) => ({
                      ...prv,
                      startDate: from,
                      endDate: to,
                    }));
                  }}
                />

                <MdOutlineClear
                  size={20}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setFilters((prv) => ({
                      ...prv,
                      startDate: "",
                      endDate: "",
                    }));
                  }}
                />
              </Input>
            </div>

            <div style={{ width: "25%" }}>
              <label htmlFor="phone">Telefone</label>
              <InputBox>
                <AntdInput
                  placeholder="Telefone"
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      whatsappPhone: normalizeStr(e.target.value),
                    })
                  }
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter") {
                      shouldRefetch();
                    }
                  }}
                />
              </InputBox>
            </div>

            <div style={{ width: "25%" }}>
              <label htmlFor="platformIntegration">Plataforma</label>
              <InputBox>
                <AntdInput
                  placeholder="Plataforma"
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      platformIntegration: normalizeStr(e.target.value),
                    })
                  }
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter") {
                      shouldRefetch();
                    }
                  }}
                />
              </InputBox>
            </div>

            <Button
              text="Filtrar"
              onClick={() => {
                shouldRefetch();
              }}
            />
          </section>
        </section>

        <Table
          columns={[
            {
              title: "ID",
              key: "id",
              dataIndex: "id",
            },
            {
              title: "Criação",
              key: "event_created",
              dataIndex: "event_created",
            },

            {
              title: "Nro. Origem",
              key: "phone",
              dataIndex: "phone",
            },
            {
              title: "Plataforma",
              key: "platformIntegration",
              dataIndex: "platformIntegration",
            },
            {
              title: "Processado",
              key: "processed",
              dataIndex: "processed",
            },
            {
              title: "Data Processamento",
              key: "created_at",
              dataIndex: "created_at",
            },
            {
              title: "Ações",
              key: "actions",
              dataIndex: "actions",
            },
          ]}
          dataSource={tableData}
        />
      </div>
    </PageWrapper>
  );
});

export default WhatsappSingle;
