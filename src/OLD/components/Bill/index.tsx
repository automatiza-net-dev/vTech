// @ts-nocheck
// Core
import * as React from "react";

import { useAuthAdmin } from "infinity-forge";

// Hooks
import { useRouter } from "next/router";
import { useDailyCasher } from "@/OLD/hooks/useDailyCashiers";

// Utils
import { Columns, LiftColumns } from "./Columns";
import moment from "moment";

// Icons
import { MdOutlineClear } from "react-icons/md";

// Components
import { Input as AntInput, Select, Table } from "antd";
import { Modal, Button, PageWrapper } from "infinity-forge";
import { DatePicker } from "@mui/x-date-pickers";
import { Container, Input, Label } from "./styles";
import AccessDenied from "@/OLD/components/AccessDenied";
import { ModalListagemDocumentosVenda } from "./Actions/modal-listagem-documentos-venda";

import { useGetAllBills } from "../../../OLD/hooks/useBills";
import { currencyFormatter, dateFormatter } from "../Budget";
import BillActions from "./Actions/Container";

import { AddSale, PermissionItem } from "@/presentation";
import { billStatusFormatter } from "./utils/status-formater";
import { usePermission } from "@/presentation/context/permissions";

export default function Bills() {
  const hasCreatePermission = usePermission("VEN01");

  const [visible, setVisible] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);
  const [filters, setFilters] = React.useState({
    fromBill: moment(),
    toBill: moment(),
    noSearch: true,
  });
  const [reload, setReload] = React.useState(false);

  const { user } = useAuthAdmin();
  const { data } = useGetAllBills(filters, reload);
  const { cashiers } = useDailyCasher(false, filters);

  const router = useRouter();

  const mapper = (data = [], cashiers) => {
    data.sort((a, b) => moment(b.created_at).diff(moment(a.created_at)));

    return data.map((bill) => {
      return {
        id: bill?.id,
        internalCode: bill?.internalCode,
        fn: bill?.hasDocuments ? "Sim" : "Não",
        bill_date: dateFormatter(bill?.bill_date),
        code: bill?.tag ?? "-",
        client: bill?.client?.name || "-",
        patient: bill.patient?.name ?? "-",
        user: bill?.seller ? bill?.seller?.name : bill?.user?.name,
        total: currencyFormatter(bill?.total_value),
        status: billStatusFormatter(bill, setReload, visible2, setVisible2),
        missingValue: currencyFormatter(bill?.total_value - bill?.paid_value),
        docActions: (
          <ModalListagemDocumentosVenda
            bill={bill}
            refresh={() => setReload((prv) => !prv)}
          />
        ),
        actions: (
          <BillActions bill={bill} cashiers={cashiers} client={bill?.client} setReload={setReload} />
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

  const hasInternalCode = user?.unit?.unitConfig?.internalCode;

  return (
    <PermissionItem hash="VEN00" DaniedComponent={AccessDenied}>
      <PageWrapper title="Vendas">
        <Container>
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

              <Input style={{ width: "50%" }}>
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

              {hasInternalCode && (
                <Input style={{ width: "70%" }}>
                  <label style={{ width: 140 }}>Código Interno</label>
                  <AntInput
                    value={filters?.internalCode}
                    onChange={(e) =>
                      setFilters({ ...filters, internalCode: e.target.value })
                    }
                  />
                </Input>
              )}

              <Input style={{ width: "50%" }}>
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
              className="uk-flex uk-flex-between uk-width-1-1 uk-margin-small-top"
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
              {user?.type === "Vet" && (
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
                  gap: "10px",
                }}
              >
                {hasCreatePermission && (
                  <>
                    <Button
                      onClick={() => {
                        setVisible(true);
                      }}
                      text="Nova venda"
                    />
                  </>
                )}

                <Button
                  text="Filtrar"
                  onClick={() => {
                    const newObj = { ...filters };
                    delete newObj.bill_id;
                    setFilters((prv) => ({ ...newObj, noSearch: false }));
                    setReload((prv) => !prv);
                  }}
                />
              </div>
            </div>
          </section>
          <hr />
          <div className="uk-margin-top">
            <Table
              columns={
                user?.user?.type === "Vet"
                  ? Columns(hasInternalCode)
                  : LiftColumns(hasInternalCode)
              }
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
                              acc +
                              (current?.total_value - current?.paid_value),
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
          styles={{ maxWidth: "1500px", width: "100%" }}
          stylesContent={{ height: "70dvh" }}
          onClose={() => setVisible(false)}
        >
          <AddSale setModal={setVisible} listCreated={listCreated} />
        </Modal>
      </PageWrapper>
    </PermissionItem>
  );
}
