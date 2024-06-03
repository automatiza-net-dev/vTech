// @ts-nocheck
// Core
import React, { memo, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

// Icons
import { SearchIcon } from "@/OLD/common/icons";

// Services
import { dailyCasherService } from "@/OLD/services/dailyCasher.service";

// Hooks
import { useProfile } from "@/OLD/hooks/useProfile";
import { useDailyCasher } from "@/OLD/hooks/useDailyCashiers";
import { useDailyMovements } from "@/OLD/hooks/useDailyMovements";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

// Utils
import moment from "moment";
import { Columns } from "./Columns";
import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";

// Components
import { Button } from "@/OLD/components/mini-components/Button";
import { Container, Input } from "./styles";
import {
  Table,
  Modal,
  notification,
  Tooltip,
  Select,
  Input as AntInput,
} from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import Actions from "./Actions";
import FormChild from "./FormChild";
import AccessDenied from "@/OLD/components/AccessDenied";
const { Option } = Select;

const DailyCashier = memo(function DailyCashier() {
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [filters, setFilters] = useState({
    status: "ABERTO",
  });
  const [movementFilter, setMovementFilter] = useState({});
  const [data, setData] = useState({});
  const [openVisible, setOpenVisible] = useState(false);
  const [formatedCashiers, setFormatedCashiers] = useState([]);
  const { cashiers } = useDailyCasher(
    reload,
    filters,
    filters.status === "TODOS"
  );
  const { user, clinic } = useProfile();
  const { movements } = useDailyMovements(reload, movementFilter);

  const createDailyCashierPermission = useUserHasPermission("CAI01");
  const listDailyCashierPermission = useUserHasPermission("CAI00");
  const router = useRouter();

  useEffect(() => {
    if (clinic?.unitConfig?.locked_daily_movement_date) {
      setMovementFilter({
        from: moment(new Date()).startOf("day").toISOString(),
        to: moment(new Date()).toISOString(),
      });
    } else {
      setMovementFilter({});
    }
  }, [clinic?.unitConfig?.locked_daily_movement_date]);

  const openDailyCasher = useCallback(() => {
    setLoading(true);
    dailyCasherService
      .openDailyCasher({
        userId: user?.id,
        openingDate: moment(new Date()).toISOString(),
        initialBalance: convertIntlCurrency(data?.initialBalance),
        dailyMovementId: movements[0]?.id,
      })
      .then((res) => {
        notification.success({
          message: "Caixa aberto com sucesso",
        });
        setLoading(false);
        setData({});
        setReload(!reload);
        setOpenVisible(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.data?.message) {
          const messageArr = err?.response?.data?.message.split(":");
          return notification.error({ message: messageArr[1] });
        }
        return notification.error({
          message: "Houve um erro ao abrir o caixa",
        });
      });
  }, [user?.id, data, movements]);

  const redirectToCashier = (status, id) =>
    status === "ABERTO"
      ? router.push(`/dashboard/movimentacao-caixa/${id}`)
      : notification.error({
          message:
            "Para movimentar o caixa o mesmo precisa se encontrar em aberto",
        });

  const formatCashiers = () => {
    cashiers.length > 0
      ? setFormatedCashiers(
          cashiers.map((item) => {
            return {
              tag: (
                <span
                  className="uk-link"
                  onClick={() => redirectToCashier(item?.status, item?.id)}
                >
                  <Tooltip title="Clique para acessar o caixa">
                    {item?.tag}
                  </Tooltip>
                </span>
              ),
              user: (
                <span
                  className="uk-link"
                  onClick={() => redirectToCashier(item?.status, item?.id)}
                >
                  <Tooltip title="Clique para acessar o caixa">
                    {item?.userWhoOpened?.name}
                  </Tooltip>
                </span>
              ),
              openingDate: (
                <span
                  className="uk-link"
                  onClick={() => redirectToCashier(item?.status, item?.id)}
                >
                  <Tooltip title="Clique para acessar o caixa">
                    {moment(item?.opening_date).format("DD/MM/YYYY - HH:mm")}
                  </Tooltip>
                </span>
              ),
              closingDate: (
                <span
                  className="uk-link"
                  onClick={() => redirectToCashier(item?.status, item?.id)}
                >
                  <Tooltip title="Clique para acessar o caixa">
                    {item?.closing_date
                      ? moment(item?.closing_date).format("DD/MM/YYYY - HH:mm")
                      : "Sem data de fechamento"}
                  </Tooltip>
                </span>
              ),
              checkingDate: (
                <span
                  className="uk-link"
                  onClick={() => redirectToCashier(item?.status, item?.id)}
                >
                  <Tooltip title="Clique para acessar o caixa">
                    {item?.checking_date
                      ? moment(item?.checking_date).format("DD/MM/YYYY - HH:mm")
                      : "Sem data de conferência"}
                  </Tooltip>
                </span>
              ),
              status: (
                <span
                  className="uk-link"
                  onClick={() => redirectToCashier(item?.status, item?.id)}
                >
                  <Tooltip title="Clique para acessar o caixa">
                    {item?.status}
                  </Tooltip>
                </span>
              ),
              balance: (
                <span
                  className="uk-link"
                  onClick={() => redirectToCashier(item?.status, item?.id)}
                >
                  <Tooltip title="Clique para acessar o caixa">
                    {currencyFormatter(item?.cashier_balance)}
                  </Tooltip>
                </span>
              ),
              actions: (
                <Actions casher={item} reload={reload} setReload={setReload} />
              ),
            };
          })
        )
      : setFormatedCashiers([]);
  };

  useEffect(() => {
    formatCashiers();
  }, [cashiers]);

  useEffect(() => {
    setData({ initialBalance: currencyFormatter(0) });
  }, [reload]);

  return !listDailyCashierPermission ||
    listDailyCashierPermission === "loading" ? (
    <AccessDenied loading={listDailyCashierPermission} />
  ) : (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">Caixas diários</h3>
      <section className="uk-flex uk-flex-between uk-margin-top">
        <div className="uk-flex uk-flex-middle">
          <Input>
            <DatePicker
              slotProps={{ textField: { variant: "standard" } }}
              className="date-input"
              value={filters?.fromOpening}
              type="search"
              placeholder="Inicio"
              format={"DD/MM/YYYY"}
              onChange={(val) => {
                setFilters({ ...filters, fromOpening: val });
                setReload(!reload);
              }}
            />
          </Input>
          <h4 className="uk-margin-remove">&nbsp;À&nbsp;</h4>
          <Input>
            <DatePicker
              slotProps={{ textField: { variant: "standard" } }}
              value={filters?.toOpening}
              className="date-input"
              type="search"
              placeholder="Fim"
              format="DD/MM/YYYY"
              onChange={(val) => {
                setFilters({ ...filters, toOpening: val });
                setReload(!reload);
              }}
            />
          </Input>
          <Input>
            <AntInput
              placeholder="Cod"
              onChange={(e) => setFilters({ tag: e.target.value })}
              allowClear
            />
          </Input>
          <div className="uk-margin-left uk-width-1-4">
            <label>Status</label>
            <br />
            <Select
              value={filters?.status}
              onChange={(v) => {
                setFilters({ ...filters, status: v });
                setReload(!reload);
              }}
              className="uk-width-1-1"
              defaultValue="ABERTO"
            >
              <Option value="TODOS">Todos</Option>
              <Option value="ABERTO">Aberto</Option>
              <Option value="FECHADO">Fechado</Option>
              <Option value="REVISAO">Revisão</Option>
              <Option value="CONFERIDO">Conferido</Option>
            </Select>
          </div>
        </div>
        <div>
          {createDailyCashierPermission && (
            <Button
              onClick={() => {
                const movementsFilter = movements.filter(
                  (mov) => mov.status === "Aberto"
                );
                if (movementsFilter?.length === 0) {
                  return notification.warning({
                    message: "Nenhuma movimentação aberta",
                  });
                }
                setOpenVisible(true);
              }}
            >
              Abrir novo caixa
            </Button>
          )}
        </div>
      </section>
      <hr />
      <Table dataSource={formatedCashiers} columns={Columns} />
      {openVisible && (
        <Modal
          title="Abrir caixa"
          visible={openVisible}
          onCancel={() => setOpenVisible(false)}
          onOk={() => openDailyCasher()}
          footer={null}
        >
          <FormChild
            data={data}
            setData={setData}
            user={user}
            inputFocus={openVisible}
            submit={openDailyCasher}
            setVisible={setOpenVisible}
          />
        </Modal>
      )}
    </Container>
  );
});

export default DailyCashier;
