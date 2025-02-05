// @ts-nocheck
import { memo, useCallback, useState } from "react";

import { financesService } from "@/OLD/services/finances.service";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Container } from "./styles";
import { Popconfirm, Tooltip, notification, Modal } from "antd";
import FormChild from "./FormChild";

import { FiLock, FiUnlock } from "react-icons/fi";
import { IoMdDownload } from "react-icons/io";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { DeleteTwoTone } from "@ant-design/icons";

import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import moment from "moment";
import { accessControlTitles } from "@/OLD/utils/generalUtils";

function BorderoActions({
  bordero,
  setReload,
  type,
}: any) {
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

  const downBorderoPermission = useUserHasPermission(
    `${accessControlTitles(type)}08`
  );

  const revertBorderoPermission = useUserHasPermission(
    `${accessControlTitles(type)}09`
  );

  const closeBordero = useCallback(() => {
    setLoading(true);

    financesService
      .closeBordero({ id: bordero?.id })
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        return notification.success({
          message: "Bordero Fechado com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.data?.message) {
          return notification.error({
            message: err?.response?.data?.message?.split(":")[1],
          });
        }
        return notification.error({
          message: "Houve um erro interno ao fechar o bordero",
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
        return notification.success({
          message: "Bordero reaberto com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.data?.message) {
          return notification.error({
            message: err?.response?.data?.message?.split(":")[1],
          });
        }
        return notification.error({
          message: "Houve um erro interno ao reabrir o bordero",
        });
      });
  }, [bordero]);

  const removeBordero = useCallback(() => {
    setLoading(true);

    financesService
      .removeBordero({ id: bordero?.id })
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        return notification.success({
          message: "Bordero removido com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);

        if (err?.response?.data?.message) {
          return notification.error({
            message: err?.response?.data?.message?.split(":")[1],
          });
        }
        return notification.error({
          message: "Houve um erro interno ao remover o bordero",
        });
      });
  }, [bordero]);

  const submitDownBordero = useCallback(() => {
    setLoading(true);

    financesService
      .downBordero({
        id: bordero?.id,
        paymentMethodId: downData?.paymentMethodId,
        checkingAccountId: downData?.checkingAccountId,
        paymentDate: moment(downData?.paymentDate).format("YYYY-MM-DD"),
        interestValue: convertIntlCurrency(downData?.interestValue),
        interestPercentage: parseInt(downData?.interestPercentage),
        discountValue: convertIntlCurrency(downData?.discountValue),
        discountPercentage: parseInt(downData?.discountPercentage),
      })
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        setDownModalVisible(false);
        setDownData({
          interestValue: currencyFormatter(0),
          discountValue: currencyFormatter(0),
        });
        return notification.success({
          message: "Bordero baixado com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);

        if (err?.response?.data?.message) {
          return notification.error({
            message: err?.response?.data?.message?.split(":")[1],
          });
        }
        return notification.error({
          message: "Houve um erro interno ao executar a baixa do bordero",
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
        return notification.success({
          message: "Bordero estornado com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);

        return notification.error({
          message:
            "Houve um erro interno ao estornar o bordero selecionado #err",
        });
      });
  }, [revertData, bordero]);

  return (
    <Container>
      {bordero?.status === "Aberto" && (
        <Tooltip title="Fechar borderô">
          <Popconfirm
            title="Deseja fechar este borderô?"
            onConfirm={closeBordero}
          >
            <FiLock className="custom-icon" />
          </Popconfirm>
        </Tooltip>
      )}
      {bordero?.status === "Fechado" && (
        <Tooltip title="Reabrir borderô">
          <Popconfirm
            title="Deseja reabrir este borderô?"
            onConfirm={reopenBordero}
          >
            <FiUnlock className="custom-icon" />
          </Popconfirm>
        </Tooltip>
      )}
      {bordero?.status === "Fechado" && downBorderoPermission && (
        <Tooltip title="Baixar borderô">
          <IoMdDownload
            size={20}
            className="custom-icon"
            onClick={() => setDownModalVisible(true)}
          />
        </Tooltip>
      )}
      {bordero?.status === "Baixado" && revertBorderoPermission && (
        <Tooltip title="Estornar borderô">
          <BsArrowCounterclockwise
            size={20}
            className="custom-icon"
            onClick={() => setRevertModalVisible(true)}
          />
        </Tooltip>
      )}
      {bordero?.status === "Baixado" ||
        (bordero?.status === "Fechado" && (
          <Tooltip title="Excluir bordero" className="uk-margin-small-top">
            <Popconfirm
              onConfirm={removeBordero}
              title="Deseja remover este bordero?"
            >
              <DeleteTwoTone twoToneColor="red" />
            </Popconfirm>
          </Tooltip>
        ))}

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
          bordero={bordero}
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
}

export default BorderoActions;
