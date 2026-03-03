// @ts-nocheck

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/router";

import moment from "moment";
import { Tooltip, useAuthAdmin, useToast } from "infinity-forge";
import { Modal } from "antd";

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
  const dataRef = useRef({});
  const [obsVisible, setObsVisible] = useState(false);
  const [submitFunc, setSubmitFunc] = useState(null);
  const [numberInput, setNumberInput] = useState(true);
  const [reportVisible, setReportVisible] = useState(false);

  const { user } = useAuthAdmin();

  const { createToast } = useToast();

  const router = useRouter();
  const closeDailyCashierPermission = useUserHasPermission("CAI02");
  const reopenDailyCashierPermission = useUserHasPermission("CAI03");
  const checkDailyCashierPermission = useUserHasPermission("CAI04");

  const closeCasher = useCallback(() => {
    const currentData = dataRef.current;
    setLoading(true);
    dailyCasherService
      .closeDailyCasher(casher?.id, {
        observations: currentData?.observations,
        cashierTotal: Masks.noMoney(currentData?.cashierTotal),
        userId: user?.id,
        closingDate: moment(new Date()).toISOString(),
      })
      .then((_res) => {
        createToast({
          message: "Caixa fechado com sucesso!",
          status: "success",
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

          return createToast({ message: messageArr[1], status: "error" });
        }
        setLoading(false);
        return createToast({
          message: "Houve um erro ao realizar o fechamento do caixa...",
          status: "error",
        });
      });
  }, [user?.id, casher?.id]);

  const reopenCasher = useCallback(() => {
    setLoading(true);
    dailyCasherService
      .reopenDailyCasher(casher?.id, {
        userId: user?.id,
        reopeningDate: moment(new Date()).toISOString(),
        observations: dataRef.current?.observations,
      })
      .then((_res) => {
        createToast({
          message: "Caixa reaberto com sucesso!",
          status: "success",
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
          return createToast({ status: "error", message: messageArr[1] });
        }
        return createToast({
          status: "error",
          message: "Houve um erro ao realizar o fechamento do caixa...",
        });
      });
  }, [user?.id, casher?.id]);

  const checkCasher = useCallback(() => {
    setLoading(true);
    dailyCasherService
      .checkDailyCasher(casher?.id, {
        userId: user?.id,
        checkingDate: moment(new Date()).toISOString(),
        observations: dataRef.current?.observations,
      })
      .then((_res) => {
        createToast({
          status: "success",
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
          return createToast({ status: "error", message: messageArr[1] });
        }
        return createToast({
          status: "error",
          message: "Houve um erro ao realizar o fechamento do caixa...",
        });
      });
  }, [casher?.id, user?.id]);

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

  const handleSubmit = useCallback(() => {
    submitFunc === "Fechamento" && closeCasher();
    submitFunc === "Reabertura" && reopenCasher();
    submitFunc === "Conferência" && checkCasher();
    setObsVisible(false);
  }, [submitFunc]);

  // Atualiza a ref sempre que data mudar
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    const initialData = { cashierTotal: currencyFormatter(0) };
    setData(initialData);
    dataRef.current = initialData;
  }, []);

  useEffect(() => {
    document.addEventListener("keypress", submitFuncControll);

    return () => document?.removeEventListener("keypress", submitFuncControll);
  }, [obsVisible, submitFunc]);

  return (
    <Container>
      {casher.status === "ABERTO" && closeDailyCashierPermission && (
        <Tooltip
          idTooltip="aberto"
          position="top-left"
          enableHover
          content="Fechar Caixa Diário"
          trigger={
            <VscLock
              size={20}
              className="icon"
              onClick={() => {
                setSubmitFunc("Fechamento");
                setObsVisible(true);
                setNumberInput(true);
              }}
            />
          }
        />
      )}
      {(casher?.status === "FECHADO" ||
        (casher?.status === "REVISAO" && reopenDailyCashierPermission)) && (
          <Tooltip
            idTooltip="aberto"
            position="top-left"
            enableHover
            content="Reabrir Caixa Diário"
            trigger={
              <VscUnlock
                size={20}
                className="icon"
                onClick={() => {
                  setSubmitFunc("Reabertura");
                  setObsVisible(true);
                  setNumberInput(false);
                }}
              />
            }
          />
        )}
      {!casher?.checking_date ? (
        checkDailyCashierPermission && (
          <Tooltip
            idTooltip="aberto"
            position="top-left"
            enableHover
            content="Conferir Caixa Diário"
            trigger={
              <VscCheckAll
                size={20}
                className="icon"
                color="var(--red)"
                onClick={() => {
                  if (casher.status !== "FECHADO") {
                    return createToast({
                      status: "error",
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
            }
          />
        )
      ) : (
        <GiConfirmed size={20} className="icon" color="var(--green)" />
      )}
      <Tooltip
        idTooltip="aberto"
        position="top-left"
        enableHover
        content="Detalhes Caixa Diário"
        trigger={
          <button
            type="button"
            style={{ padding: "0", border: 0, backgroundColor: "transparent" }}
            onClick={() => setReportVisible(true)}
          >
            <svg
              stroke="currentColor"
              fill="none"
              stroke-width="0"
              viewBox="0 0 24 24"
              class="icon"
              height="25"
              width="25"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 8C2 7.44772 2.44772 7 3 7H21C21.5523 7 22 7.44772 22 8C22 8.55228 21.5523 9 21 9H3C2.44772 9 2 8.55228 2 8Z"
                fill="currentColor"
              ></path>
              <path
                d="M2 12C2 11.4477 2.44772 11 3 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H3C2.44772 13 2 12.5523 2 12Z"
                fill="currentColor"
              ></path>
              <path
                d="M3 15C2.44772 15 2 15.4477 2 16C2 16.5523 2.44772 17 3 17H15C15.5523 17 16 16.5523 16 16C16 15.4477 15.5523 15 15 15H3Z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
        }
      />

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
          <FormChild data={data} setData={setData} numberInput={numberInput} onSubmit={handleSubmit} />
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
