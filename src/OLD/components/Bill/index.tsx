// @ts-nocheck
// Core
import * as React from "react";

// Hooks
import { useDailyCasher } from "@/OLD/hooks/useDailyCashiers";
import { usePatients } from "@/OLD/hooks/usePatients";
import { useRouter } from "next/router";

// Utils
import { Columns, LiftColumns } from "./Columns";
import moment from "moment";
import { normalizeStr } from "@/OLD/utils/normalizeString";

// Icons
import { MdOutlineClear } from "react-icons/md";

// Components
import {
  Input as AntInput,
  Select,
  Table,
  AutoComplete,
  Modal as ModalANTD,
} from "antd";
import { Modal } from "infinity-forge";
import { DatePicker } from "@mui/x-date-pickers";
import { Container, Input, Label } from "./styles";
import AccessDenied from "@/OLD/components/AccessDenied";
import { Button } from "@/OLD/components/mini-components/Button";
import { ModalListagemDocumentosVenda } from "./Actions/modal-listagem-documentos-venda";

import { useQuery } from "react-query";
import { useGetAllBills } from "../../../OLD/hooks/useBills";
import { petsService } from "../../../OLD/services/patient.service";
import { currencyFormatter, dateFormatter } from "../Budget";
import BillActions from "./Actions/Container";

import { AddSale, TriggerModal, useVerifyPermissions } from "@/presentation";
import Link from "next/link";
import { AuthorizationSell } from "./authorization-sell";
import { billStatusFormatter } from "./utils/status-formater";

export default function Bills() {
  const [visible, setVisible] = React.useState(false);
  const [filters, setFilters] = React.useState({
    fromBill: moment(),
    toBill: moment(),
    noSearch: true,
  });
  const [patientSearch, setPatientSearch] = React.useState("");
  const [clientSearch, setClientSearch] = React.useState("");
  const [cashierFilters, setCashierFilters] = React.useState({
    from: moment(new Date()).startOf("day"),
    to: moment(new Date()).endOf("day"),
    status: "ABERTO",
  });
  const [reload, setReload] = React.useState(false);

  const { data, refetch } = useGetAllBills(filters, reload);
  const { patients } = usePatients();
  const { cashiers } = useDailyCasher(cashierFilters);

  const createPermission = useVerifyPermissions("VEN01");
  const listBillsPermission = useVerifyPermissions("VEN00");
  const router = useRouter();

  const { data: tutors } = useQuery(
    ["tutors"],
    async () => {
      const { data } = await petsService.getTutors();

      return data ?? [];
    },
    { refetchOnWindowFocus: false }
  );

  const mapper = (data = [], cashiers) => {
    data.sort((a, b) => moment(b.created_at).diff(moment(a.created_at)));

    return data.map((bill) => {
      return {
        id: bill?.id,
        fn: bill?.hasDocuments ? "Sim" : "Não",
        bill_date: dateFormatter(bill?.bill_date),
        code: bill?.tag ?? "-",
        client: bill?.client?.name || "-",
        patient: bill.patient?.name ?? "-",
        user: bill?.seller ? bill?.seller?.name : bill?.user?.name,
        total: currencyFormatter(bill?.total_value),
        status: billStatusFormatter(bill, setReload),
        missingValue: currencyFormatter(bill?.total_value - bill?.paid_value),
        docActions: (
          <ModalListagemDocumentosVenda
            bill={bill}
            refresh={() => setReload((prv) => !prv)}
          />
        ),
        actions: (
          <BillActions bill={bill} cashiers={cashiers} client={bill?.client} />
        ),
      };
    });
  };

  const listCreated = (id) => {
    setFilters((prv) => ({ ...prv, bill_id: id, noSearch: false }));
    setReload((prv) => !prv);
  };

  React.useEffect(() => {
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        setFilters((prv) => ({ ...prv, noSearch: false }));
        setReload((prv) => !prv);
      }
    });
  }, []);

  React.useEffect(() => {
    if (router?.query?.id) {
      listCreated(router.query.id);
    }
  }, [router.query]);

  return !listBillsPermission || listBillsPermission === "loading" ? (
    <AccessDenied loading={listBillsPermission} />
  ) : (
    <>
      <Container className="uk-padding">
        <h3 className="uk-margin-remove">Vendas</h3>
        <section className="uk-margin-top uk-width-1-1">
          <div
            className="uk-flex uk-flex-between uk-width-1-1"
            style={{ gap: "1rem" }}
          >
            <Input style={{ width: "100%" }}>
              <Label>Criação</Label>
              <DatePicker
                slotProps={{ textField: { variant: "standard" } }}
                format="DD/MM/YYYY"
                onChange={(val) => {
                  setFilters({
                    ...filters,
                    fromBill: val,
                  });
                }}
                value={filters?.fromBill}
              />
              à
              <DatePicker
                format="DD/MM/YYYY"
                slotProps={{ textField: { variant: "standard" } }}
                onChange={(val) => {
                  setFilters({
                    ...filters,
                    toBill: val,
                  });
                }}
                value={filters?.toBill}
              />
              <MdOutlineClear
                size={40}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setFilters((prv) => ({
                    ...prv,
                    fromBill: null,
                    toBill: null,
                  }));
                }}
              />
            </Input>

            <Input style={{ width: "100%" }}>
              <Label>Status</Label>
              <Select
                allowClear
                defaultValue={"all"}
                placeholder="Status"
                className="uk-width-1-1"
                value={filters.status}
                onChange={(e) => {
                  if (e === "all") {
                    const newObj = { ...filters };
                    delete newObj?.status;
                    return setFilters(newObj);
                  }
                  setFilters({ ...filters, status: e });
                }}
              >
                <Select.Option value="all">Todos</Select.Option>
                <Select.Option value="ABERTA">Aberta</Select.Option>
                <Select.Option value="BAIXADA">Baixada</Select.Option>
              </Select>
            </Input>

            <Input style={{ width: "100%" }}>
              <Label>Cliente</Label>
              <AutoComplete
                className="uk-width-1-1"
                value={clientSearch}
                options={tutors?.map((tutor) => ({
                  ...tutor,
                  value: tutor?.name,
                }))}
                onChange={(val) => {
                  setClientSearch(val);
                  if (val === "") {
                    const newObj = { ...filters };
                    delete newObj.client;
                    setFilters(newObj);
                  }
                }}
                onSelect={(_, option) => {
                  setClientSearch(option?.name);
                  setFilters({ ...filters, client: option?.id });
                }}
                filterOption={(val, opt) =>
                  normalizeStr(opt?.name.toUpperCase()).includes(
                    normalizeStr(val.toUpperCase())
                  )
                }
              />
            </Input>
          </div>
          <div
            className="uk-flex uk-flex-between uk-width-1-1 uk-margin-small-top"
            style={{ gap: "1rem" }}
          >
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
                    normalizeStr(opt?.name.toUpperCase()).includes(
                      normalizeStr(val.toUpperCase())
                    )
                  }
                />
              </Input>
            )}
            <Input style={{ width: "70%" }}>
              <label>Código</label>
              <AntInput
                value={filters.tag}
                onChange={(e) =>
                  setFilters({ ...filters, tag: e.target.value })
                }
              />
            </Input>

            <Input style={{ width: "100%" }}>
              <Label>Pendências</Label>
              <Select
                allowClear
                defaultValue={"Todos"}
                placeholder="Pendências"
                className="uk-width-1-1"
                value={filters.pending}
                onChange={(e) => {
                  if (e === "all") {
                    const newObj = { ...filters };
                    delete newObj?.pending;
                    return setFilters(newObj);
                  }
                  setFilters({ ...filters, pending: e });
                }}
              >
                <Select.Option value="">Todos</Select.Option>
                <Select.Option value={true}>Sim</Select.Option>
                <Select.Option value={false}>Não</Select.Option>
              </Select>
            </Input>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "right",
              }}
            >
              {createPermission && (
                <>
                  <Button
                    onClick={() => {
                      setVisible(true);
                    }}
                  >
                    Nova venda
                  </Button>
                </>
              )}

              <Button
                classCallback="uk-margin-small-right"
                onClick={() => {
                  const newObj = { ...filters };
                  delete newObj.bill_id;
                  setFilters((prv) => ({ ...newObj, noSearch: false }));
                  setReload((prv) => !prv);
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
            columns={process.env.client !== "liftone" ? Columns : LiftColumns}
            dataSource={mapper(data, cashiers)}
            footer={() => (
              <section className="uk-flex uk-flex-center">
                <div className="uk-flex uk-flex-around custom-footer-box">
                  <div className="uk-width-1-2 uk-margin-right">
                    <strong>Total:&nbsp;</strong>
                    {data?.length > 0 &&
                      currencyFormatter(
                        data.reduce(
                          (acc, current) => acc + current.total_value,
                          0
                        )
                      )}
                  </div>
                  <div className="uk-width-1-1">
                    <strong>Total em aberto:&nbsp;</strong>
                    {data?.length > 0 &&
                      currencyFormatter(
                        data.reduce(
                          (acc, current) =>
                            acc + (current?.total_value - current?.paid_value),
                          0
                        )
                      )}
                  </div>
                  <div className="uk-width-1-1">
                    <strong>Total pago:</strong>
                    {data?.length > 0 &&
                      currencyFormatter(
                        data.reduce(
                          (acc, current) => acc + current?.paid_value,
                          0
                        )
                      )}
                  </div>
                </div>
              </section>
            )}
          />
        </div>
      </Container>

      <Modal
        open={visible}
        styles={{ maxWidth: "1200px", width: "100%" }}
        stylesContent={{ height: "70dvh" }}
        onClose={() => setVisible(false)}
      >
        <AddSale setModal={setVisible} listCreated={listCreated} />
      </Modal>
    </>
  );
}
