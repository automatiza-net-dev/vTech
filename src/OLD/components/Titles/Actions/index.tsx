// @ts-nocheck
// Core
import React, { memo, useState, useCallback, useEffect } from "react";

// Services
import { financesService } from "@/OLD/services/finances.service";

// Icons
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { BsArrowCounterclockwise } from "react-icons/bs";

// utils
import moment from "moment";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { currencyFormatter } from "@/OLD/components/Budget";
import { accessControlTitles } from "@/OLD/utils/generalUtils";

// Hooks
import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";
import { usePlans } from "@/OLD/hooks/usePlans";
import { useAuth } from "@/OLD/hooks/useAuth";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useShowFinance } from "@/OLD/hooks/useFinances";

// Components
import { Container } from "./styles";
import {
  notification,
  Popconfirm,
  Modal,
  Checkbox,
  Tooltip,
  Input,
} from "antd";
const { TextArea } = Input;
import Edit from "./Edit";

const Actions = memo(function Actions({
  completeFinance,
  financeId,
  reload,
  setReload,
  type,
}) {
  const [loading, setLoading] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [data, setData] = useState({
    feeValue: currencyFormatter(0),
    feePercentage: 0,
    discountPercentage: 0,
    discountValue: currencyFormatter(0),
  });
  const [reversalVisible, setReversalVisible] = useState(false);
  const [reason, setReason] = useState("");
  const [id, setId] = useState([]);

  const { paymentMethods } = usePaymentMethods(false, false, updateOpen);
  const { plans } = usePlans(false, false, updateOpen);
  const { titles, setTitles } = useAuth();
  const { finances: finance } = useShowFinance(id, reload, updateOpen);

  const editTitlePermission = useUserHasPermission(
    `${accessControlTitles(type)}02`
  );
  const deleteTitlePermission = useUserHasPermission(
    `${accessControlTitles(type)}03`
  );
  const reverseTitlePermission = useUserHasPermission(
    `${accessControlTitles(type)}05`
  );

  useEffect(() => {
    financeId && setId([financeId]);
  }, [financeId]);

  useEffect(() => {
    finance &&
      setData({
        installment: finance[0]?.installment,
        value: currencyFormatter(finance[0]?.value),
        feeValue: finance[0]?.fee_value
          ? currencyFormatter(finance[0]?.fee_value)
          : currencyFormatter(0),
        feePercentage: finance[0]?.fee_percentage || 0,
        discountPercentage: finance[0]?.discount_percentage || 0,
        discountValue: finance[0]?.discount_value
          ? currencyFormatter(finance[0]?.discount_value)
          : currencyFormatter(0),
        issueDate: moment(finance[0]?.issue_date),
        expirationDate: moment(finance[0]?.expiration_date),
        paymentMethodId: finance[0]?.paymentMethod?.id,
        accountPlanId: finance[0]?.accountPlan?.id,
        userDocument: finance[0]?.user_document,
        barCode: finance[0]?.bar_code,
        bank: finance[0]?.bank,
        agency: finance[0]?.agency,
        account: finance[0]?.account,
        nsuDocument: finance[0]?.nsu_document,
        historic: finance[0]?.historic,
        reconciled: finance[0]?.reconciled,
        status: finance[0]?.status,
        client: finance[0]?.client?.name,
        document: finance[0]?.document,
        competenceDate: moment(finance[0]?.competence_date, "MM/YYYY"),
        fiscalNote: finance[0]?.fiscal_note,
        checkingAccountId: finance[0]?.checkingAccount?.id,
        tefFlagId: finance[0]?.flag?.id,
        originalValue: currencyFormatter(finance[0]?.original_value),
        feePaymentMethod: currencyFormatter(finance[0]?.fee_discount_value),
        value: currencyFormatter(finance[0]?.value),
        feePaymentPercentage: finance[0]?.fee_discount_percentage,
        reconciled: finance[0]?.reconciled,
        type: finance[0]?.type,
      });
  }, [finance]);

  const submitUpdate = useCallback(() => {
    let error = false;
    setLoading(true);
    const newObj = {
      ...data,
      competenceDate: moment(data?.competenceDate).format("MM/YYYY"),
    };

    delete newObj?.client;
    delete newObj?.document;

    if (!newObj?.accountPlanId) {
      return notification.warning({ message: "Plano de contas obrigatório" });
    }

    financesService
      .update(financeId, {
        ...newObj,
        originalValue: convertIntlCurrency(newObj.value),
        feeValue: convertIntlCurrency(newObj.feeValue),
        discountValue: convertIntlCurrency(newObj.discountValue),
        value: convertIntlCurrency(newObj?.value),
      })
      .then((_res) =>
        notification.success({ message: "Parcela atualizada com sucesso!" })
      )
      .catch((err) => {
        error = true;
        setLoading(false);
        if (err?.response?.data?.message) {
          const messageArr = err?.response?.data?.message.split(":");
          return notification.error({ message: messageArr[1] });
        }

        return notification.error({
          message: "Houve um erro ao atualizar a parcela selecionada...",
        });
      })
      .finally(() => {
        setLoading(false);
        if (!error) {
          setReload(!reload);
          setUpdateOpen(false);
        }
      });
  }, [data, financeId]);

  const submitReversal = useCallback(() => {
    setLoading(true);
    financesService
      .updateReversal(financeId, {
        reason,
        originDownFlag: "FINANCEIRO",
      })
      .then((_res) =>
        notification.success({
          message: "Estorno realizado com sucesso!",
        })
      )
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao realizar o estorno",
        });
      })
      .finally(() => {
        setLoading(false);
        setReload((prv) => !prv);
        setReason("");
        setReversalVisible(false);
      });
  }, [reason]);

  const removeFinance = useCallback(() => {
    setLoading(true);
    financesService
      .remove(financeId)
      .then((_res) =>
        notification.success({ message: "Parcela removida com sucesso!" })
      )
      .catch((err) => {
        setLoading(false);
        if (err?.response?.data?.message) {
          const messageArr = err?.response?.data?.message.split(":");
          return notification.error({ message: messageArr[1] });
        }
        notification.error({
          message: "Houve um erro ao remover a parcela selecionada...",
        });
      })
      .finally(() => {
        setLoading(false);
        setReload(!reload);
      });
  }, [finance?.id]);

  return (
    <Container className="uk-flex uk-flex-around uk-flex-middle">
      {completeFinance.status !== "BAIXADO" ? (
        <Checkbox
          checked={!!titles?.find((item) => item?.id === completeFinance?.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setTitles([...titles, completeFinance]);
            } else {
              const newArr = [...titles];
              newArr.splice(titles.indexOf(completeFinance), 1);
              setTitles(newArr);
            }
          }}
        />
      ) : (
        reverseTitlePermission &&
        completeFinance?.origin_flag !== "BANCARIO" && (
          <Tooltip title="Estornar título">
            <BsArrowCounterclockwise
              className="icon"
              onClick={() => setReversalVisible(true)}
            />
          </Tooltip>
        )
      )}
      {completeFinance?.status !== "BAIXADO" && editTitlePermission && (
        <EditTwoTone className="icon" onClick={() => setUpdateOpen(true)} />
      )}
      {completeFinance?.status !== "BAIXADO" && (
        <Popconfirm
          title="Deseja realmente excluir essa parcela?"
          onConfirm={removeFinance}
          okText="Sim"
          cancelText="Não"
        >
          {deleteTitlePermission && (
            <DeleteTwoTone className="icon" twoToneColor="red" />
          )}
        </Popconfirm>
      )}
      {updateOpen && (
        <Modal
          title="Atualizar informações da parcela"
          width={1200}
          visible={updateOpen}
          onCancel={() => setUpdateOpen(false)}
          footer={null}
        >
          <Edit
            data={data}
            setData={setData}
            paymentMethods={paymentMethods}
            plans={plans.filter((plan) => plan?.type === type)}
            submit={submitUpdate}
            setVisible={setUpdateOpen}
          />
        </Modal>
      )}
      <Modal
        title="Estorno de título"
        visible={reversalVisible}
        onCancel={() => setReversalVisible(false)}
        onOk={() =>
          reason !== ""
            ? submitReversal()
            : notification.warning({
                message: "O campo motivo não pode estar vazio",
              })
        }
      >
        <div>
          <label>Motivo</label>
          <TextArea
            onChange={(e) => setReason(e.target.value)}
            value={reason}
          />
        </div>
      </Modal>
    </Container>
  );
});

export default Actions;
