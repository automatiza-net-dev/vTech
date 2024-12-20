// @ts-nocheck
import React, { memo, useCallback, useState } from "react";

import moment from "moment";

import { useMe } from "@/presentation/hooks";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { dailyMovementsService } from "@/OLD/services/dailyMovements.service";

import { Container } from "./styles";
import { Tooltip, notification, Modal } from "antd";
import FormChild from "../FormChild";

import { GiConfirmed } from "react-icons/gi";
import { VscLock, VscUnlock, VscCheckAll, VscBook } from "react-icons/vsc";

function Actions ({ movement, reload, setReload, setReport }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [obsVisible, setObsVisible] = useState(false);
  const [submitFunc, setSubmitFunc] = useState(null);
  const userInfo = useMe();

  const closeDailyMovementPermission = useUserHasPermission("MOV02");
  const checkDailyMovementPermission = useUserHasPermission("MOV03");

  const closeDailyMovement = useCallback(() => {
    setLoading(true);
    dailyMovementsService
      .closeDailyMovement(movement?.id, {
        closingDate: moment(new Date()).toISOString(),
        userId: userInfo?.data?.id,
        observations: data?.observations,
      })
      .then((_res) =>
        notification.success({
          message: "Movimentação diária fechada com sucesso!",
        })
      )
      .catch((err) => {
        if (err.response.data?.message) {
          const message = err.response.data.message.split(":")[1];

          return notification.error({ message });
        }
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao fechar a movimentação diária...",
        });
      })
      .finally(() => {
        setLoading(false);
        setData({});
        setReload(!reload);
        setObsVisible(false);
      });
  }, [data, movement?.id, userInfo?.data?.id]);

  const reopenDailyMovement = useCallback(() => {
    setLoading(true);
    dailyMovementsService
      .reopenDailyMovement(movement?.id, {
        observations: data?.observations,
        reopeningDate: moment(new Date()).toISOString(),
        userId: userInfo?.data?.id,
      })
      .then((res) =>
        notification.success({
          message: "Movimentação reaberta com sucesso",
        })
      )
      .catch((err) => {
        if (err?.response?.data?.message) {
          const messageArr = err?.response?.data?.message.split(":");
          return notification.error({ message: messageArr[1] });
        }
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao reabrir a movimentação diária",
        });
      })
      .finally(() => {
        setLoading(false);
        setData({});
        setObsVisible(false);
        setReload(!reload);
      });
  }, [data, movement?.id, userInfo?.data?.id]);

  const checkDailyMovement = useCallback(() => {
    setLoading(true);
    dailyMovementsService
      .checkDailyMovement(movement?.id, {
        observations: data?.observations,
        checkingDate: moment(new Date()).toISOString(),
        userId: userInfo?.data?.id,
      })
      .then((_res) =>
        notification.success({
          message: "Movimentação verificada com sucesso!",
        })
      )
      .catch((err) => {
        setLoading(false);
        if (err?.response?.data?.message) {
          const messageArr = err?.response?.data?.message.split(":");
          return notification.error({ message: messageArr[1] });
        }
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao verificar a movimentação diária",
        });
      })
      .finally(() => {
        setLoading(false);
        setData({});
        setObsVisible(false);
        setReload(!reload);
      });
  }, [data, movement?.id, userInfo?.data?.id]);

  return (
    <Container className="uk-flex uk-flex-around">
      {closeDailyMovementPermission && (
        <>
          {movement?.status === "Aberto" && (
            <Tooltip title="Fechar movimentação">
              <VscLock
                className="icon"
                size={20}
                onClick={() => {
                  setObsVisible(true);
                  setSubmitFunc("Fechamento");
                }}
              />
            </Tooltip>
          )}
          {movement?.status === "Fechado" && (
            <Tooltip title="Reabrir movimentação">
              <VscUnlock
                className="icon"
                size={20}
                onClick={() => {
                  setObsVisible(true);
                  setSubmitFunc("Reabertura");
                }}
              />
            </Tooltip>
          )}
        </>
      )}

      {movement?.checking_date ? (
        <Tooltip title="Verificado">
          <GiConfirmed className="icon" size={20} color="var(--green)" />
        </Tooltip>
      ) : (
        checkDailyMovementPermission && (
          <Tooltip title="Conferir movimentação">
            <VscCheckAll
              className="icon"
              color="var(--red)"
              size={20}
              onClick={() => {
                setObsVisible(true);
                setSubmitFunc("Verificação");
              }}
            />
          </Tooltip>
        )
      )}

      <Tooltip title="Visualizar relatório">
        <VscBook
          size={20}
          className="icon"
          onClick={() => setReport(movement.logs)}
        />
      </Tooltip>
      <Modal
        visible={obsVisible}
        onCancel={() => setObsVisible(false)}
        title={`observações ${submitFunc} (opcional)`}
        onOk={() => {
          submitFunc === "Fechamento" && closeDailyMovement();
          submitFunc === "Reabertura" && reopenDailyMovement();
          submitFunc === "Verificação" && checkDailyMovement();
        }}
      >
        <FormChild data={data} setData={setData} />
      </Modal>
    </Container>
  );
};

export default Actions;
