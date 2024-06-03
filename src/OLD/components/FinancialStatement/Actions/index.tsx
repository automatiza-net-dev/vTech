// Core
// @ts-nocheck
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
import Edit from "@/OLD/components/Titles/Actions/Edit";

const Actions = memo(function Actions({
  financeId,
  reload,
  setReload,
  type,
  completeFinance,
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

  const { paymentMethods } = usePaymentMethods(false, false, updateOpen);
  const { plans } = usePlans(false, false, updateOpen);
  const { titles, setTitles } = useAuth();
  const { finance } = useShowFinance(financeId, reload, updateOpen);

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
    setData({
      installment: finance?.installment,
      value: currencyFormatter(finance?.value),
      feeValue: finance?.fee_value
        ? currencyFormatter(finance?.fee_value)
        : currencyFormatter(0),
      feePercentage: finance?.fee_percentage || 0,
      discountPercentage: finance?.discount_percentage || 0,
      discountValue: finance?.discount_value
        ? currencyFormatter(finance?.discount_value)
        : currencyFormatter(0),
      issueDate: moment(finance?.issue_date),
      expirationDate: moment(finance?.expiration_date),
      paymentMethodId: finance?.paymentMethod?.id,
      accountPlanId: finance?.accountPlan?.id,
      userDocument: finance?.user_document,
      barCode: finance?.bar_code,
      bank: finance?.bank,
      agency: finance?.agency,
      account: finance?.account,
      nsuDocument: finance?.nsu_document,
      historic: finance?.historic,
      reconciled: finance?.reconciled,
      status: finance?.status,
      client: finance?.client?.name,
      document: finance?.document,
      competenceDate: moment(finance?.competence_date, "MM/YYYY"),
      fiscalNote: finance?.fiscal_note,
      checkingAccountId: finance?.checkingAccount?.id,
      tefFlagId: finance?.flag?.id,
      originalValue: currencyFormatter(finance?.original_value),
      feePaymentMethod: currencyFormatter(finance?.fee_discount_value),
      value: currencyFormatter(finance?.value),
      feePaymentPercentage: finance?.fee_discount_percentage,
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
  }, [financeId]);

  return (
    <Container className="uk-flex uk-flex-around uk-flex-middle">
      {completeFinance.status !== "BAIXADO" && !completeFinance?.bordero_id ? (
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
      {completeFinance.status !== "BAIXADO" && editTitlePermission && (
        <EditTwoTone className="icon" onClick={() => setUpdateOpen(true)} />
      )}
      {completeFinance?.status !== "BAIXADO" && (
        <Popconfirm
          title="Deseja realmete excluir essa parcela?"
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
      {reversalVisible && (
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
      )}
    </Container>
  );
});

export default Actions;
