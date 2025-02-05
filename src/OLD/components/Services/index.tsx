// @ts-nocheck
import React, { memo, useState, useEffect } from "react";
import { useRouter } from "next/router";

// Hooks
import { useServices } from "@/OLD/hooks/useServices";

import { Container } from "./styles";
import { Button, PageWrapper, formatNumberToCurrency } from "infinity-forge";
import { Table, Modal } from "antd";
import Filters from "./Filters";
import Actions from "./Actions";
import AccessDenied from "@/OLD/components/AccessDenied";
import CreateServices from "./Create";

import { servicesColumns } from "./Columns";
import moment from "moment";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

const Services = memo(function Services() {
  const [filters, setFilters] = useState({ noSearch: true });
  const [formatedServices, setFormatedServices] = useState([]);
  const [reload, setReload] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);

  const listServicesPermission = useUserHasPermission("SRV00");
  const canCreateService = useUserHasPermission("SRV01");

  const { services } = useServices(filters, reload);

  const router = useRouter();

  const serviceMaper = () => {
    services.length > 0 || Object.keys(filters).length !== 0
      ? setFormatedServices(
          services.map((service) => {
            return {
              courtesy: service?.courtesy ? "Sim" : "Não",
              description: service?.description,
              code: service?.referenceCode,
              type: service?.type === "service" ? "Serviço" : service?.type,
              status: service?.active ? "Ativo" : "Inativo",
              createdAt: moment(service?.created_at).format("DD/MM/YYYY"),
              actions: <Actions service={service} setReload={setReload} />,
              subgroup: service?.subgroup?.description,
              type: service?.type,
              value: formatNumberToCurrency(service?.price?.value) || "-",
            };
          })
        )
      : setFormatedServices([]);
  };

  useEffect(() => {
    serviceMaper();
  }, [services]);

  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        setFilters((prv) => ({ ...prv, noSearch: false }));
        setReload((prv) => !prv);
      }
    });
  }, []);

  return !listServicesPermission || listServicesPermission === "loading" ? (
    <AccessDenied loading={listServicesPermission} />
  ) : (
    <PageWrapper title="Controle de serviços">
      <Container>
        <Filters filters={filters} setFilters={setFilters} />
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
            marginTop: "5px",
          }}
        >
          <Button
            text="Filtrar"
            onClick={() => setFilters({ ...filters, noSearch: false })}
          />

          <Button
            onClick={() => {
              setCreateVisible(true);
            }}
            disabled={!canCreateService}
            text="Cadastrar"
          />
        </div>
        <hr />
        <section>
          <Table
            columns={servicesColumns}
            dataSource={formatedServices}
            locale={{
              emptyText:
                Object.keys(filters).length === 0 ? (
                  <>Pesquise acima para exibir o resultado</>
                ) : (
                  <>Nenhum resultado encontrado</>
                ),
            }}
          />
        </section>
        {createVisible && (
          <Modal
            visible={createVisible}
            onCancel={() => setCreateVisible(false)}
            width={1200}
            footer={null}
          >
            <CreateServices setVisible={setCreateVisible} />
          </Modal>
        )}
      </Container>
    </PageWrapper>
  );
});

export default Services;
