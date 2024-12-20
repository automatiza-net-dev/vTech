// @ts-nocheck

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

import moment from "moment";
import { useAuthAdmin } from "infinity-forge";
import { Tooltip, notification, Modal } from "antd";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { dailyCasherService } from "@/OLD/services/dailyCasher.service";

import FormChild from "./FormChild";
import CashierReport from "../CashierReport";
import { currencyFormatter } from "@/OLD/components/Budget";

import { GiConfirmed } from "react-icons/gi";
import { VscLock, VscUnlock, VscCheckAll, VscBook } from "react-icons/vsc";

import Masks from "@/OLD/utils/masks";

import { Container } from "./styles";

function Actions(casher) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [obsVisible, setObsVisible] = useState(false);
  const [submitFunc, setSubmitFunc] = useState(null);
  const [numberInput, setNumberInput] = useState(true);
  const [reportVisible, setReportVisible] = useState(false);

  const { user } = useAuthAdmin();

  const router = useRouter();
  const closeDailyCashierPermission = useUserHasPermission("CAI02");
  const reopenDailyCashierPermission = useUserHasPermission("CAI03");
  const checkDailyCashierPermission = useUserHasPermission("CAI04");

  const closeCasher = useCallback(() => {
    setLoading(true);
    dailyCasherService
      .closeDailyCasher(casher?.id, {
        observations: data?.observations,
        cashierTotal: Masks.noMoney(data?.cashierTotal),
        userId: user?.id,
        closingDate: moment(new Date()).toISOString(),
      })
      .then((_res) => {
        notification.success({
          message: "Caixa fechado com sucesso!",
        });

        setData({});
        setObsVisible(false);
        setSubmitFunc(null);
        casher.mutate();
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.data?.message) {
          const messageArr = err?.response?.data?.message.split(":");
          return notification.error({ message: messageArr[1] });
        }
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao realizar o fechamento do caixa...",
        });
      });
  }, [data, user?.id, casher?.id]);

  const reopenCasher = useCallback(() => {
    setLoading(true);
    dailyCasherService
      .reopenDailyCasher(casher?.id, {
        userId: user?.id,
        reopeningDate: moment(new Date()).toISOString(),
        observations: data?.observations,
      })
      .then((_res) => {
        notification.success({
          message: "Caixa reaberto com sucesso!",
        });

        setSubmitFunc(null);
        setLoading(false);
        setData({});
        setObsVisible(false);
        casher.mutate();
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.data?.message) {
          const messageArr = err?.response?.data?.message.split(":");
          return notification.error({ message: messageArr[1] });
        }
        return notification.error({
          message: "Houve um erro ao realizar o fechamento do caixa...",
        });
      });
  }, [user?.id, data, casher?.id]);

  const checkCasher = useCallback(() => {
    setLoading(true);
    dailyCasherService
      .checkDailyCasher(casher?.id, {
        userId: user?.id,
        checkingDate: moment(new Date()).toISOString(),
        observations: data?.observations,
      })
      .then((_res) => {
        notification.success({
          message: "Caixa conferido com sucesso!",
        });

        setSubmitFunc(null);
        setLoading(false);
        setData({});
        setObsVisible(false);
        casher.mutate();
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.data?.message) {
          const messageArr = err?.response?.data?.message.split(":");
          return notification.error({ message: messageArr[1] });
        }
        return notification.error({
          message: "Houve um erro ao realizar o fechamento do caixa...",
        });
      });
  }, [data, casher?.id, user?.id]);

  const submitFuncControll = (e) => {
    if (!obsVisible) {
      return;
    }

    if (e.key === "Enter") {
      submitFunc === "Fechamento" && closeCasher();
      submitFunc === "Reabertura" && reopenCasher();
      submitFunc === "Conferência" && checkCasher();
      setObsVisible(false);
    }
  };

  useEffect(() => {
    setData({ cashierTotal: currencyFormatter(0) });
  }, []);

  useEffect(() => {
    document.addEventListener("keypress", submitFuncControll);

    return () => document?.removeEventListener("keypress", submitFuncControll);
  }, [obsVisible, submitFunc]);

  return (
    <Container>
      {casher.status === "ABERTO" && closeDailyCashierPermission && (
        <Tooltip title="Fechar caixa">
          <VscLock
            size={20}
            className="icon"
            onClick={() => {
              setSubmitFunc("Fechamento");
              setObsVisible(true);
              setNumberInput(true);
            }}
          />
        </Tooltip>
      )}
      {(casher?.status === "FECHADO" ||
        (casher?.status === "REVISAO" && reopenDailyCashierPermission)) && (
        <Tooltip title="Reabrir caixa">
          <VscUnlock
            size={20}
            className="icon"
            onClick={() => {
              setSubmitFunc("Reabertura");
              setObsVisible(true);
              setNumberInput(false);
            }}
          />
        </Tooltip>
      )}
      {!casher?.checking_date ? (
        checkDailyCashierPermission && (
          <Tooltip title="Realizar conferência">
            <VscCheckAll
              size={20}
              className="icon"
              color="var(--red)"
              onClick={() => {
                if (casher.status !== "FECHADO") {
                  return notification.error({
                    message:
                      "O caixa deve estar fechado para realizar a conferencia",
                  });
                }

                router.push(
                  `/dashboard/caixa-diario/conferencia/${casher?.id}`
                );

                /*
              Antiga forma de conferência
              setSubmitFunc("Conferência");
              setObsVisible(true);
              setNumberInput(false);
              */
              }}
            />
          </Tooltip>
        )
      ) : (
        <Tooltip title="Conferência realizada">
          <GiConfirmed size={20} className="icon" color="var(--green)" />
        </Tooltip>
      )}
      <Tooltip title="Visualizar relatório">
        <VscBook
          className="icon"
          size={20}
          onClick={() => setReportVisible(true)}
        />
      </Tooltip>
      {obsVisible && (
        <Modal
          visible={obsVisible}
          title={`${submitFunc} de caixa`}
          onCancel={() => setObsVisible(false)}
          onOk={() => {
            submitFunc === "Fechamento" && closeCasher();
            submitFunc === "Reabertura" && reopenCasher();
            submitFunc === "Conferência" && checkCasher();
          }}
        >
          <FormChild data={data} setData={setData} numberInput={numberInput} />
        </Modal>
      )}
      <Modal
        visible={reportVisible}
        title={`Relatório caixa diário`}
        footer={null}
        onCancel={() => setReportVisible(false)}
        width={1000}
      >
        <CashierReport
          selectedData={casher}
          type={"cashier"}
          setVisible={setReportVisible}
        />
      </Modal>
    </Container>
  );
}

export default Actions;
