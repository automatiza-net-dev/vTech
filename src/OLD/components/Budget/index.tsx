// @ts-nocheck
// Core
import * as React from "react";
import { memo, useEffect } from "react";

// Hooks

import { Modal as ModalInfinityForge } from "infinity-forge";

import { useFindPartialBudgets } from "@/OLD/hooks/useBudgets";
import { usePatients } from "@/OLD/hooks/usePatients";
import { useTutor } from "@/OLD/hooks/useTutor";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useColaborators } from "@/OLD/hooks/useColaborators";

// Utils
import { Columns, LiftColumns } from "./Columns";
import { normalizeStr } from "@/OLD/utils/normalizeString";

// Components
import CreateBudget from "./Create";
import { Modal } from "infinity-forge";
import BudgetActions from "./Actions/Container";
import { DatePicker } from "@mui/x-date-pickers";
import { Container, Input, Label } from "./styles";
import AccessDenied from "@/OLD/components/AccessDenied";
import { Button } from "@/OLD/components/mini-components/Button";
import { Input as AntInput, Select, Table, AutoComplete } from "antd";

import moment from "moment/moment";

// Icons
import { MdOutlineClear } from "react-icons/md";
import { AddBudgetNew, useDictionary } from "@/presentation";

export const dateFormatter = (date) => {
  return moment(new Date(date)).format("HH:mm DD/MM/YYYY");
};

export const currencyFormatter = (value) => {
  return Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const budgetStatusFormatter = (status) => {
  switch (status) {
    case "ABERTO":
      return "Aberto";
    case "CONFIRMADO":
      return "Confirmado";
    case "NAO_CONFIRMADO__CANCELADO":
      return "Não confirmado";
    case "CONFIRMADO_PARCIAL":
    default:
      return "Confirmado parcial";
  }
};

const mapper = (data = []) => {
  return data.map((budget) => {
    return {
      id: budget.id,
      evaluator: budget?.reviewer?.name || "-",
      budget_date: dateFormatter(budget.budget_date),
      expiration_date: dateFormatter(budget.expiration_date),
      tag: budget.tag ?? "-",
      finished_at: budget.finished_at ? dateFormatter(budget.finished_at) : "-",
      client_name: budget?.client?.name || budget?.client_name,
      pet_name: budget.patient?.name ?? "-",
      seller_name: budget?.seller?.name,
      total_value: currencyFormatter(budget.total_value),
      status: budgetStatusFormatter(budget.status),
      actions: (
        <>
          <BudgetActions key={budget.id} budget={budget} />
        </>
      ),
    };
  });
};

const handleDateInput = (data) => {
  if (!data) return null;

  if (!Array.isArray(data)) return null;

  return data;
};

const Budgets = memo(function Budgets() {
  const [filters, setFilters] = React.useState({
    noSearch: true,
  });
  const [reload, setReload] = React.useState(false);
  const [modalCriar, setModalCriar] = React.useState(false);
  const { data, refetch } = useFindPartialBudgets(filters, reload);
  const { patients } = usePatients();
  const { tutors } = useTutor();
  const { colaborators } = useColaborators();

  const [patientSearch, setPatientSearch] = React.useState("");
  const [openCreate, setOpenCreate] = React.useState(false);
  const [values, setValues] = React.useState({});

  const createBudgetPermission = useUserHasPermission("ORC01");
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
    setFilters({ budget_id: id });
    setReload((prv) => !prv);
  };

  const columns = process.env.client !== "liftone" ? Columns() : LiftColumns()

  const {getWord} = useDictionary()

  return !listBudgetPermission || listBudgetPermission === "loading" ? (
    <AccessDenied loading={listBudgetPermission} />
  ) : (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">{getWord("Orçamentos")}</h3>
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
            {/*
            <DatePicker.RangePicker
              allowEmpty={[true, true]}
              format="DD/MM/YYYY"
              onChange={(d) => {
                const result = handleDateInput(d);
                if (!result) {
                  setFilters((prev) => ({
                    ...prev,
                    fromCreation: null,
                    toCreation: null
                  }));
                  return;
                }

                const [from, to] = result;
                setFilters((prev) => ({
                  ...prev,
                  fromCreation: from?.toISOString(),
                  toCreation: to?.toISOString()
                }));
              }}
            />
            */}
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
            {/*
            <DatePicker.RangePicker
              allowEmpty={[true, true]}
              format="DD/MM/YYYY"
              onChange={(d) => {
                const result = handleDateInput(d);
                if (!result) {
                  setFilters((prev) => ({
                    ...prev,
                    fromExpiration: null,
                    toExpiration: null
                  }));
                  return;
                }

                const [from, to] = result;
                setFilters((prev) => ({
                  ...prev,
                  fromExpiration: from?.toISOString(),
                  toExpiration: to?.toISOString()
                }));
              }}
            />
            */}
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
          <Input style={{ width: "100%" }}>
            <label>Código</label>
            <AntInput
              value={filters.tag}
              onChange={(e) => setFilters({ tag: e.target.value })}
            />
          </Input>
        </div>
        <div
          className="uk-flex uk-flex-middle uk-margin-small-top"
          style={{ gap: "1rem" }}
        >
          <Input style={{ width: "100%" }}>
            <Label>Cliente</Label>
            <AutoComplete
              className="uk-width-1-1"
              value={values?.clientName}
              options={tutors?.map((tutor) => ({
                ...tutor,
                value: tutor?.name,
              }))}
              onChange={(val) => {
                setValues((prv) => ({ ...prv, clientName: val }));
                if (val === "") {
                  const newObj = { ...filters };
                  delete newObj.client;
                  setFilters(newObj);
                }
              }}
              onSelect={(_, option) => {
                setValues((prv) => ({ ...prv, clientName: option?.name }));
                setFilters({ ...filters, client: option?.id });
              }}
              filterOption={(val, opt) =>
                normalizeStr(opt?.name.toUpperCase()).includes(
                  normalizeStr(val.toUpperCase())
                )
              }
            />
          </Input>
          {process.env.client !== "liftone" && (
            <Input style={{ width: "100%" }}>
              <Label>Paciente</Label>
              <AutoComplete
                className="uk-width-1-1"
                value={patientSearch}
                options={patients?.map((patient) => ({
                  ...patient,
                  value: patient?.name,
                }))}
                onChange={(val) => {
                  setPatientSearch(val);
                  if (val === "") {
                    const newObj = { ...filters };
                    delete newObj.patient;
                    setFilters(newObj);
                  }
                }}
                onSelect={(_, option) => {
                  setPatientSearch(option?.name);
                  setFilters({ ...filters, patient: option?.id });
                }}
                filterOption={(val, opt) =>
                  normalizeStr(opt?.name).includes(normalizeStr(val))
                }
              />
            </Input>
          )}
          {process.env.client === "liftone" && (
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
          <div
            style={{ width: "70%", display: "flex", justifyContent: "right" }}
          >
            {createBudgetPermission && (
              <Modal
                style={{
                  maxWidth: "1200px",
                  padding: "20px",
                  overflow: "auto",
                }}
                modal={openCreate}
                setModal={setOpenCreate}
                children={
                  <CreateBudget modal={openCreate} setModal={setOpenCreate} />
                }
                trigger={
                  <Button onClick={() => setOpenCreate((prev) => !prev)}>
                    Novo {getWord("Orçamento")}
                  </Button>
                }
              />
            )}

            <Button onClick={() => setModalCriar(true)}>Novo {getWord("Orçamento")}</Button>

            <ModalInfinityForge
              styles={{
                overflow: "auto",
                height: "95vh",
                maxWidth: "1400px",
                minHeight: "600px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
              stylesContent={{ height: "100%", width: "100%" }}
              open={modalCriar}
              onClose={() => setModalCriar(false)}
            >
              <AddBudgetNew
                setModal={setModalCriar}
                listCreated={listCreated}
              />
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
            >
              Filtrar
            </Button>
          </div>
        </div>
      </section>
      <hr />
      <div className="uk-margin-top">
        <Table
          columns={columns}
          dataSource={mapper(data)}
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
  );
});

export default Budgets;
