// @ts-nocheck
// Core
import React, { memo, useEffect, useState, useCallback } from "react";

// Services
import { dailyMovementsService } from "@/OLD/services/dailyMovements.service";

// Hooks
import { useMe } from "@/presentation/hooks";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useDailyMovementsSearch } from "@/OLD/hooks/useDailyMovements";

// Utils
import { Columns } from "./Columns";
import moment from "moment";

// Components
import { Container, Input } from "./styles";
import { Table, notification, Select } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import { Button, PageWrapper } from "infinity-forge";
import Actions from "./Actions";
import Report from "./DailyMovementReport";
import AccessDenied from "@/OLD/components/AccessDenied";
const { Option } = Select;

function DailyMovements() {
  const [reload, setReload] = useState(false);
  const [filters, setFilters] = useState({ status: "Aberto" });
  const [loading, setLoading] = useState(false);
  const [formatedMovements, setFormatedMovements] = useState([]);
  const [report, setReport] = useState(false);

  const userInfo = useMe();
  const { movements } = useDailyMovementsSearch(filters, reload);

  const createMovimentationPermission = useUserHasPermission("MOV01");
  const listDailyMovPermission = useUserHasPermission("MOV00");

  const formatMovements = () => {
    const array =
      Object.keys(filters)?.length === 0
        ? movements.filter(
            (item) =>
              moment(item?.opening_date).format("DD/MM/YYYY") ===
                moment(new Date()).format("DD/MM/YYYY") ||
              item?.status === "Aberto"
          )
        : movements;

    setFormatedMovements(
      array.map((item) => {
        return {
          opening_date: moment(item?.opening_date).format("DD/MM/YYYY - HH:mm"),

          closing_date: item?.closing_date
            ? moment(item?.closing_date).format("DD/MM/YYYY - HH:mm")
            : "Sem data de fechamento",

          checking_date: item?.checking_date
            ? moment(item?.checking_date).format("DD/MM/YYYY - HH:mm")
            : "Sem data de conferência",
          opening_user: item?.userWhoOpened?.name,
          closing_user: item?.userWhoClosed?.name,
          checking_user: item?.userWhoChecked?.name,
          status: item?.status,
          actions: (
            <Actions
              movement={item}
              reload={reload}
              setReload={setReload}
              setReport={setReport}
            />
          ),
        };
      })
    );
  };

  useEffect(() => {
    formatMovements();
  }, [movements]);

  useEffect(() => {
    setFilters({ status: "Aberto" });
  }, []);

  const openDailyMovement = useCallback(() => {
    setLoading(true);
    dailyMovementsService
      .openDailyMovement({
        userId: userInfo?.data?.id,
        openingDate: moment(new Date()).toISOString(),
      })
      .then(() =>
        notification.success({ message: "Movimentação aberta com sucesso!" })
      )
      .catch((err) => {
        if (err?.response?.data?.message) {
          const messageArr = err?.response?.data?.message.split(":");
          return notification.error({ message: messageArr[1] });
        }
        notification.error({
          message: "Houve um erro ao abrir a movimentação...",
        });
      })
      .finally(() => {
        setReload(!reload);
        setLoading(false);
      });
  }, [userInfo]);

  return !listDailyMovPermission || listDailyMovPermission === "loading" ? (
    <AccessDenied loading={listDailyMovPermission} />
  ) : (
    <PageWrapper title="Movimentação diária">
      <Container>
        <section className="uk-flex uk-flex-between uk-margin-top">
          <div className="uk-flex uk-flex-middle">
            <Input>
              <DatePicker
                slotProps={{ textField: { variant: "standard" } }}
                className="date-input"
                type="search"
                format="DD/MM/YYYY"
                placeholder="Inicio"
                value={filters?.from}
                onChange={(val) => setFilters({ ...filters, from: val })}
              />
            </Input>
            <h4 className="uk-margin-remove">&nbsp;À&nbsp;</h4>
            <Input>
              <DatePicker
                slotProps={{ textField: { variant: "standard" } }}
                value={filters?.to}
                format="DD/MM/YYYY"
                className="date-input"
                type="search"
                placeholder="Fim"
                onChange={(val) => setFilters({ ...filters, to: val })}
              />
            </Input>
            <div className="uk-width-1-5 uk-margin-left">
              <label>Status</label>
              <Select
                className="uk-width-1-1"
                allowClear
                value={filters?.status}
                onChange={(val) => {
                  setFilters({ ...filters, status: val });
                }}
              >
                <Option value="Aberto">Aberto</Option>
                <Option value="Fechado">Fechado</Option>
                <Option value="Conferido">Conferido</Option>
              </Select>
            </div>
          </div>
          <div>
            {createMovimentationPermission && (
              <Button
                onClick={() => openDailyMovement()}
                text="Nova movimentação"
              />
            )}
          </div>
        </section>
        <hr />
        <div className="uk-margin-top">
          <Table columns={Columns} dataSource={formatedMovements} />
        </div>
        {report && <Report report={report} setReport={setReport} />}
      </Container>
    </PageWrapper>
  );
}

export default DailyMovements;
