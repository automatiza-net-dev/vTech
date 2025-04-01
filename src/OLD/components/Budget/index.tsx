//@ts-nocheck
import * as React from "react";
import { useEffect } from "react";

import { Modal as ModalInfinityForge } from "infinity-forge";

// Hooks
import { useFindPartialBudgets } from "@/OLD/hooks/useBudgets";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useColaborators } from "@/OLD/hooks/useColaborators";

// Utils
import { Columns, LiftColumns } from "./Columns";
import { normalizeStr } from "@/OLD/utils/normalizeString";

// Components
import { Modal, PageWrapper } from "infinity-forge";
import BudgetActions from "./Actions/Container";
import { DatePicker } from "@mui/x-date-pickers";
import { Container, Input, Label } from "./styles";
import AccessDenied from "@/OLD/components/AccessDenied";
import { Button, useAuthAdmin } from "infinity-forge";
import { Input as AntInput, Select, Table, AutoComplete } from "antd";

import moment from "moment/moment";

// Icons
import { MdOutlineClear } from "react-icons/md";
import { AddBudgetNew, TriggerModal, useConfigurationsSystem, useDictionary, useSystem } from "@/presentation";
import { AuthorizationBudget } from "./authorization-budget";

export const dateFormatter = (date) => {
  return moment(new Date(date)).format("HH:mm DD/MM/YYYY");
};

export const currencyFormatter = (value) => {
  return Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const budgetStatusFormatter = (budget, setReload) => {
  if (!budget) {
    return;
  }

  if (budget?.status === "ABERTO" && budget?.pending) {
    return (
      <TriggerModal
        title="Autorização de Orçamento"
        triggerContent="Pendente"
        content={
          <AuthorizationBudget budgetId={budget?.id} setReload={setReload} />
        }
        width={1400}
        footer={null}
      />
    );
  }

  const statusStyles = {
    ABERTO: <span style={{ color: "red" }}>Aberta</span>,
    EXTORNADA: "Extornada",
    CONFIRMADO: "Confirmado",
    NAO_CONFIRMADO__CANCELADO: "Não confirmado - cancelado",
    CONFIRMADO_PARCIAL: "Confirmado parcial",
    BAIXADA: <span style={{ color: "green" }}>Baixada</span>,
  };

  return statusStyles[budget?.status] || budget?.status;
};

const mapper = (data = [], setReload) => {
  return data?.map((budget) => {
    return {
      id: budget?.id,
      internalCode: budget?.internalCode,
      evaluator: budget?.reviewer?.name || "-",
      budget_date: dateFormatter(budget.budget_date),
      expiration_date: dateFormatter(budget.expiration_date),
      tag: budget.tag ?? "-",
      finished_at: budget.finished_at ? dateFormatter(budget.finished_at) : "-",
      client_name: budget?.client?.name || budget?.client_name,
      pet_name: budget.patient?.name ?? "-",
      seller_name: budget?.seller?.name,
      total_value: currencyFormatter(budget.total_value),
      status: budgetStatusFormatter(budget, setReload),
      actions: (
        <>
          <BudgetActions key={budget.id} budget={budget} />
        </>
      ),
    };
  });
};

function Budgets() {
  const [filters, setFilters] = React.useState({
    noSearch: true,
  });
  const [reload, setReload] = React.useState(false);
  const [modalCriar, setModalCriar] = React.useState(false);
  const { data } = useFindPartialBudgets(filters, reload);

  const { colaborators } = useColaborators();


  const [values, setValues] = React.useState({});

  const listBudgetPermission = useUserHasPermission("ORC00");

  useEffect(() => {
    setFilters({
      ...filters,
      status: "ABERTO",
      fromCreation: moment(),
      toCreation: moment(),
    });
  }, []);

  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        setFilters((prv) => ({ ...prv, noSearch: false }));
        setReload((prv) => !prv);
      }
    });
  }, []);

  const listCreated = (id) => {
    setFilters((prv) => ({ ...prv, budget_id: id, noSearch: false }));
    setReload((prv) => !prv);
  };


  const { unit } = useSystem()
  const { type } = useConfigurationsSystem()

  const hasInternalCode = unit?.configs?.businessUnits?.internalCode;
  const { getWord } = useDictionary();

  const columns =
    type === "Vet" ? Columns(hasInternalCode, getWord("Orçamento")) : LiftColumns(hasInternalCode, getWord("Orçamento"));

  const userIsReviewer = unit?.unitConfig?.reviewer !== "N";

  return !listBudgetPermission || listBudgetPermission === "loading" ? (
    <AccessDenied loading={listBudgetPermission} />
  ) : (
    <PageWrapper title={getWord("Orçamentos")}>
      <Container>
        <section className="uk-margin-top uk-width-1-1">
          <div className="uk-flex uk-flex-middle" style={{ gap: "1rem" }}>
            <Input style={{ width: "100%" }}>
              <Label>Criação</Label>
              <DatePicker
                slotProps={{ textField: { variant: "standard" } }}
                onChange={(val) => {
                  setFilters({
                    ...filters,
                    fromCreation: val,
                  });
                }}
                value={filters?.fromCreation}
              />
              à
              <DatePicker
                slotProps={{ textField: { variant: "standard" } }}
                onChange={(val) => {
                  setFilters({
                    ...filters,
                    toCreation: val,
                  });
                }}
                value={filters?.toCreation}
              />
              <MdOutlineClear
                size={40}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setFilters((prv) => ({
                    ...prv,
                    fromCreation: null,
                    toCreation: null,
                  }));
                }}
              />
            </Input>

            <Input style={{ width: "100%" }}>
              <Label>Expiração</Label>
              <DatePicker
                slotProps={{ textField: { variant: "standard" } }}
                onChange={(val) => {
                  setFilters({
                    ...filters,
                    fromExpiration: val,
                  });
                }}
                value={filters?.fromExpiration}
              />
              à
              <DatePicker
                slotProps={{ textField: { variant: "standard" } }}
                onChange={(val) => {
                  setFilters({
                    ...filters,
                    toExpiration: val,
                  });
                }}
                value={filters?.toExpiration}
              />
              <MdOutlineClear
                size={40}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setFilters((prv) => ({
                    ...prv,
                    fromExpiration: null,
                    toExpiration: null,
                  }));
                }}
              />
            </Input>

            <Input style={{ width: "100%" }}>
              <Label>Status</Label>
              <Select
                className="uk-width-1-1"
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e });
                }}
              >
                <Select.Option value={null}>Todos</Select.Option>
                <Select.Option value="ABERTO">Aberto</Select.Option>
                <Select.Option value="CONFIRMADO">Confirmado</Select.Option>
                <Select.Option value="NAO_CONFIRMADO__CANCELADO">
                  Não confirmado / Cancelado
                </Select.Option>
                <Select.Option value="CONFIRMADO_PARCIAL">
                  Confirmado parcial
                </Select.Option>
              </Select>
            </Input>

            {hasInternalCode && (
              <Input style={{ width: "100%" }}>
                <label>Código interno</label>
                <AntInput
                  value={filters.internalCode}
                  onChange={(e) =>
                    setFilters({ ...filters, internalCode: e.target.value })
                  }
                />
              </Input>
            )}

            <Input style={{ width: "100%" }}>
              <label>Código</label>
              <AntInput
                value={filters.tag}
                onChange={(e) =>
                  setFilters({ ...filters, tag: e.target.value })
                }
              />
            </Input>
          </div>
          <div
            className="uk-flex uk-flex-middle uk-margin-small-top"
            style={{ gap: "1rem" }}
          >
            <Input style={{ width: "100%" }}>
              <Label>Cliente</Label>
              <AntInput
                value={filters.clientName}
                onChange={(e) =>
                  setFilters({ ...filters, clientName: e.target.value })
                }
              />
            </Input>
            {type === "Vet" && (
              <Input style={{ width: "100%" }}>
                <Label>Paciente</Label>
                <AntInput
                  value={filters.patientName}
                  onChange={(e) =>
                    setFilters({ ...filters, patientName: e.target.value })
                  }
                />
              </Input>
            )}
            {type !== "Vet" && userIsReviewer && (
              <Input style={{ width: "100%" }}>
                <label>Avaliador</label>
                <AutoComplete
                  value={values?.reviewerName}
                  className="uk-width-1-1"
                  options={colaborators?.map((colab) => ({
                    ...colab,
                    value: colab?.name,
                    key: colab?.id,
                  }))}
                  onChange={(val) =>
                    setValues((prv) => ({ ...prv, reviewerName: val }))
                  }
                  onSelect={(_, opt) => {
                    setValues((prv) => ({ ...prv, reviewerName: opt?.value }));
                    setFilters({ ...filters, reviewerId: opt?.id });
                  }}
                  filterOption={(val, opt) =>
                    normalizeStr(opt?.value.toUpperCase()).includes(
                      normalizeStr(val.toUpperCase())
                    )
                  }
                />
              </Input>
            )}
            <Input style={{ width: "100%" }}>
              <label>Vendedor</label>
              <AutoComplete
                value={values?.sellerName}
                className="uk-width-1-1"
                options={colaborators?.map((colab) => ({
                  ...colab,
                  value: colab?.name,
                  key: colab?.id,
                }))}
                onChange={(val) =>
                  setValues((prv) => ({ ...prv, sellerName: val }))
                }
                onSelect={(_, opt) => {
                  setValues((prv) => ({ ...prv, sellerName: opt?.value }));
                  setFilters({ ...filters, sellerId: opt?.id });
                }}
                filterOption={(val, opt) =>
                  normalizeStr(opt?.value.toUpperCase()).includes(
                    normalizeStr(val.toUpperCase())
                  )
                }
              />
            </Input>

            <Input style={{ width: "max-content" }}>
              <Label>Pendências</Label>
              <Select
                className="uk-width-1-1"
                placeholder="Pendências"
                value={filters.pending}
                onChange={(e) => {
                  setFilters({ ...filters, pending: e });
                }}
              >
                <Select.Option value="">Todos</Select.Option>
                <Select.Option value={true}>Sim</Select.Option>
                <Select.Option value={false}>Não</Select.Option>
              </Select>
            </Input>
          </div>
        </section>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "5px",
          }}
        >
          <Button
            onClick={() => setModalCriar(true)}
            text={`Novo ${getWord("Orçamento")}`}
          />

          <ModalInfinityForge
            styles={{
              overflow: "auto",
              height: "95vh",
              maxWidth: "1400px",
              minHeight: "600px",
            }}
            stylesContent={{ height: "100%", width: "100%" }}
            open={modalCriar}
            onClose={() => setModalCriar(false)}
          >
            <AddBudgetNew setModal={setModalCriar} listCreated={listCreated} />
          </ModalInfinityForge>

          <Button
            onClick={() => {
              const newObj = { ...filters };
              delete newObj?.budget_id;

              setFilters(() => {
                setReload((prv) => !prv);
                return { ...newObj, noSearch: false };
              });
            }}
            text="Filtrar"
          />
        </div>
        <hr />
        <div className="uk-margin-top">
          <Table
            columns={
              userIsReviewer
                ? columns
                : columns.filter((column) => column.key !== "evaluator")
            }
            dataSource={mapper(data, setReload)}
            footer={() =>
              data?.length > 0 && (
                <section className="uk-flex uk-flex-right footer-box">
                  <strong>Total:&nbsp;</strong>
                  {currencyFormatter(
                    data?.reduce((acc, current) => acc + current.total_value, 0)
                  )}
                </section>
              )
            }
          />
        </div>
      </Container>
    </PageWrapper>
  );
}

export default Budgets;
