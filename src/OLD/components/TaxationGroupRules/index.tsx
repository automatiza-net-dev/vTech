// @ts-nocheck
// Core
import { memo, useEffect, useState } from "react";

// Services
import { clinicService } from "@/OLD/services/clinic.service";
import { taxationGroupRulesService } from "@/OLD/services/taxation-group-rules.service";

// Utils
import moment from "moment";
import "moment/locale/pt-br";

// Icons
import { EditTwoTone } from "@ant-design/icons";
import { SearchIcon } from "@/OLD/common/icons";

// Components
import { Select, Table } from "antd";
import { Button } from "@/OLD/components/mini-components";
import { useQuery } from "react-query";
import AccessDenied from "@/OLD/components/AccessDenied";

import columns from "./Columns";
import CreateTaxationGroup from "./Create";
import { BR_STATES } from "./data/br_states";
import DeleteTaxationGroup from "./Delete";
import UpdateTaxationGroup from "./Edit";
import { Container, Input } from "./styles";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

const TaxationGroupRules = memo(function TaxationGroupRules() {
  const [filters, setFilters] = useState({ name: "", active: "true" });
  const [visible, setVisible] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);

  const listTaxationGroupPermission = useUserHasPermission("GIP00");
  const canCreateTaxationGroup = useUserHasPermission("GIP01");
  const canEditTaxationGroup = useUserHasPermission("GIP02");
  const canDeleteTaxationGroup = useUserHasPermission("GIP03");

  const { data } = useQuery(
    ["taxation-group-rules", filters],
    () => taxationGroupRulesService.listTaxationGroupRules(filters),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: 1000 * 60,
    }
  );

  const { data: units } = useQuery(
    ["units"],
    () => clinicService.getClinicsByUser(),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: 1000 * 60,
    }
  );

  return !listTaxationGroupPermission ||
    listTaxationGroupPermission === "loading" ? (
    <AccessDenied loading={listTaxationGroupPermission} />
  ) : (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">Controle de grupos de imposto</h3>
      <div className="uk-margin-right uk-flex uk-flex-between uk-margin-top">
        <div
          className="uk-flex uk-width-1-1 uk-margin-right"
          style={{ gap: "0.5rem", alignItems: "center" }}
        >
          <Input>
            <input
              type="search"
              placeholder="Nome"
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
            <SearchIcon />
          </Input>

          <Select
            placeholder={"Tipo de Empresa"}
            value={filters?.type}
            onChange={(value) => {
              setFilters({ ...filters, type: value });
            }}
            options={[
              { label: "Todos", value: null },
              { label: "Simples", value: "SIMPLES" },
              { label: "Não Simples", value: "NAO_SIMPLES" },
            ]}
            style={{ width: "200px" }}
          />

          <Select
            placeholder={"Tipo de Movimento"}
            value={filters?.movement}
            onChange={(value) => {
              setFilters({ ...filters, movement: value });
            }}
            options={[
              { label: "Todos", value: null },
              { label: "Entrada", value: "ENTRADA" },
              { label: "Saída", value: "SAIDA" },
            ]}
            style={{ width: "200px" }}
          />
          <Select
            placeholder={"UF Origem"}
            value={filters?.fromUf}
            onChange={(value) => {
              setFilters({ ...filters, fromUf: value });
            }}
            options={[
              {
                label: "Todos",
                value: "",
              },
              ...BR_STATES.map((_state) => ({
                label: _state,
                value: _state,
              })),
            ]}
            style={{ width: "200px" }}
          />

          <Select
            placeholder={"UF Destino"}
            value={filters?.toUf}
            onChange={(value) => {
              setFilters({ ...filters, toUf: value });
            }}
            options={[
              {
                label: "Todos",
                value: "",
              },
              ...BR_STATES.map((_state) => ({
                label: _state,
                value: _state,
              })),
            ]}
            style={{ width: "200px" }}
          />

          <Select
            placeholder={"Status"}
            value={filters?.active}
            onChange={(value) => {
              setFilters({ ...filters, active: value });
            }}
            options={[
              { label: "Todos", value: null },
              { label: "Ativos", value: "true" },
              { label: "Desativados", value: "false" },
            ]}
            style={{ width: "200px" }}
          />
        </div>

        <div className="uk-margin-small-top">
          <Button
            onClick={() => setVisible(true)}
            disabled={!canCreateTaxationGroup}
          >
            {" "}
            Cadastro{" "}
          </Button>
        </div>
      </div>
      <hr />
      <Table
        className="uk-margin-top"
        dataSource={data?.map((item) => ({
          group: item?.taxationGroup.name,
          company_type: item?.company_type,
          movement_type: item?.movement_type,
          movement_category: item?.movement_category,
          from_to: [item?.from_uf, item?.to_uf].join(" -> "),
          active: item?.active ? "Ativo" : "Inativo",
          createdAt: moment(item?.created_at).format("DD/MM/YYYY - HH:mm"),
          actions: (
            <div className="uk-flex uk-flex-around">
              {canEditTaxationGroup && (
                <EditTwoTone
                  size={15}
                  onClick={() => {
                    setSelectedRule({ id: item.id });
                  }}
                />
              )}
              {canDeleteTaxationGroup && (
                <DeleteTaxationGroup
                  id={item?.id}
                  close={() => setSelectedRule(null)}
                />
              )}
            </div>
          ),
        }))}
        columns={columns}
      />
      <CreateTaxationGroup
        visible={visible}
        hide={() => {
          setVisible(false);
        }}
      />
      <UpdateTaxationGroup
        visible={!!selectedRule}
        hide={() => setSelectedRule(null)}
        initialData={selectedRule}
      />
    </Container>
  );
});

export default TaxationGroupRules;
