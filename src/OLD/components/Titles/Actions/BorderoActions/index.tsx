// @ts-nocheck
import { memo, useCallback, useState } from "react";

import { financesService } from "@/OLD/services/finances.service";

import { Container } from "./styles";
import { Popconfirm, Modal } from "antd";
import FormChild from "./FormChild";

import { FiLock, FiUnlock } from "react-icons/fi";
import { IoMdDownload } from "react-icons/io";
import { BsArrowCounterclockwise } from "react-icons/bs";

import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import moment from "moment";
import { useToast } from "infinity-forge";

const BorderoActions = memo(function BorderoActions({
  bordero,
  setReload,
  type,
}) {
  const [downData, setDownData] = useState({
    interestValue: currencyFormatter(0),
    discountValue: currencyFormatter(0),
    interestPercentage: 0,
    discountPercentage: 0,
    paymentDate: moment(),
  });
  const [loading, setLoading] = useState(false);
  const [downModalVisible, setDownModalVisible] = useState(false);
  const [revertModalVisible, setRevertModalVisible] = useState(false);
  const [revertData, setRevertData] = useState({});
  const { createToast } = useToast();

  const closeBordero = useCallback(() => {
    setLoading(true);

    financesService
      .closeBordero({ id: bordero?.id })
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        return createToast({
          message: "Bordero Fechado com sucesso!",
          status: "success",
        });
      })
      .catch((err) => {
        setLoading(false);
        return createToast({
          message: "Houve um erro interno ao fechar o bordero selecionado #err",
          status: "error",
        });
      });
  }, [bordero]);

  const reopenBordero = useCallback(() => {
    setLoading(true);

    financesService
      .reopenBordero({ id: bordero?.id })
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        return createToast({
          message: "Bordero reaberto com sucesso!",
          status: "success",
        });
      })
      .catch((err) => {
        if (err?.response?.data?.message) {
          return createToast({
            message: err?.response?.data?.message?.split(":")[1],
            status: "error",
          });
        }
        setLoading(false);
        return createToast({
          message:
            "Houve um erro interno ao reabrir o bordero selecionado #err",
          status: "error",
        });
      });
  }, [bordero]);

  const submitDownBordero = useCallback(() => {
    setLoading(true);

    console.log("aqui?", downData)

    financesService
      .downBordero({
        id: bordero?.id,
        paymentMethodId: downData?.paymentMethodId,
        checkingAccountId: downData?.checkingAccountId,
        paymentDate: downData?.paymentDate?.format("YYYY-MM-DD"),
        interestValue: convertIntlCurrency(downData?.interestValue),
        interestPercentage: downData?.interestPercentage,
        discountValue: convertIntlCurrency(downData?.discountValue),
        discountPercentage: downData?.discountPercentage,
      })
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        setDownModalVisible(false);
        setDownData({
          interestValue: currencyFormatter(0),
          discountValue: currencyFormatter(0),
        });
        return createToast({
          message: "Bordero baixado com sucesso!",
          status: "success",
        });
      })
      .catch((err) => {
        setLoading(false);
        return createToast({
          message: "Houve um erro interno ao baixar o bordero selecionado #err",
          status: "error",
        });
      });
  }, [downData, bordero]);

  const submitRevertBordero = useCallback(() => {
    setLoading(true);

    financesService
      ?.revertDownBordero({
        id: bordero?.id,
        paymentMethodId: revertData?.paymentMethodId,
        reason: revertData?.reason,
      })
      .then((_res) => {
        setLoading(false);
        setRevertModalVisible(false);
        setReload((prv) => !prv);
        setDownData({
          interestValue: currencyFormatter(0),
          discountValue: currencyFormatter(0),
        });

        return createToast({
          message: "Bordero estornado com sucesso!",
          status: "success",
        });
      })
      .catch((err) => {
        setLoading(false);

        return createToast({
          message:
            "Houve um erro interno ao estornar o bordero selecionado #err",
          status: "error",
        });
      });
  }, [revertData, bordero]);

  return (
    <Container>
      {bordero?.status === "Aberto" && (
        <Popconfirm
          title="Deseja fechar este borderô?"
          onConfirm={closeBordero}
        >
          <FiLock className="custom-icon" />
        </Popconfirm>
      )}
      {bordero?.status === "Fechado" && (
        <Popconfirm
          title="Deseja reabrir este borderô?"
          onConfirm={reopenBordero}
        >
          <FiUnlock className="custom-icon" />
        </Popconfirm>
      )}
      {bordero?.status === "Fechado" && (
        <IoMdDownload
          size={20}
          className="custom-icon"
          onClick={() => setDownModalVisible(true)}
        />
      )}
      {bordero?.status === "Baixado" && (
        <BsArrowCounterclockwise
          size={20}
          className="custom-icon"
          onClick={() => setRevertModalVisible(true)}
        />
      )}

      <Modal
        title={`Baixar Borderô - ${bordero?.document}`}
        visible={downModalVisible}
        footer={null}
        onCancel={() => setDownModalVisible(false)}
      >
        <FormChild
          data={downData}
          setData={setDownData}
          submit={submitDownBordero}
          setVisible={setDownModalVisible}
          type="down"
        />
      </Modal>
      <Modal
        title="Estornar Borderô"
        visible={revertModalVisible}
        footer={null}
        onCancel={() => setRevertModalVisible(false)}
      >
        <FormChild
          data={revertData}
          setData={setRevertData}
          submit={submitRevertBordero}
          setVisible={setRevertModalVisible}
          type="revert"
        />
      </Modal>
    </Container>
  );
});

export default BorderoActions;
