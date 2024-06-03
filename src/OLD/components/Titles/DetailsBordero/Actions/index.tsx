// @ts-nocheck
import { memo, useState, useEffect, useCallback } from "react";

import { financesService } from "@/OLD/services/finances.service";

import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";
import { usePlans } from "@/OLD/hooks/usePlans";

import { Modal, notification, Tooltip, Popconfirm } from "antd";
import Edit from "@/OLD/components/Titles/Actions/Edit";

import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";

import { AiOutlineEye } from "react-icons/ai";

import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import moment from "moment";

const Actions = memo(function Actions({
  finance,
  reload,
  setReload,
  borderoId,
  borderoStatus,
}) {
  const [data, setData] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  const { paymentMethods } = usePaymentMethods(false, false, visible);
  const { plans } = usePlans(false, false, visible);

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
      .update(finance?.id, {
        ...newObj,
        originalValue: convertIntlCurrency(newObj.value),
        feeValue: convertIntlCurrency(newObj.feeValue),
        discountValue: convertIntlCurrency(newObj.discountValue),
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
          setVisible(false);
        }
      });
  }, [data, finance.id]);

  const removeItemsBordero = useCallback(() => {
    setLoading(true);

    financesService
      .removeItemsBordero({ id: borderoId, financeIds: [finance?.id] })
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        return notification.success({
          message: "Título removido com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);

        return notification.error({
          message: "Houve um erro ao remover o item",
        });
      });
  }, [borderoId, finance?.id]);

  return (
    <div className="uk-flex uk-flex-around">
      {finance?.status !== "Baixado" && borderoStatus !== "Baixado" && (
        <EditTwoTone
          className="custom-icon"
          onClick={() => {
            setEdit(true);
            setVisible(true);
          }}
        />
      )}
      <Tooltip title="Remover título borderô">
        <Popconfirm
          title="Deseja remover este título do borderô?"
          onConfirm={removeItemsBordero}
        >
          {finance?.status !== "Baixado" && borderoStatus !== "Baixado" && (
            <DeleteTwoTone twoToneColor={"red"} className="custom-icon" />
          )}
        </Popconfirm>
      </Tooltip>
      <Tooltip title="Detalhes do título">
        <AiOutlineEye
          className="custom-icon"
          onClick={() => {
            setEdit(false);
            setVisible(true);
          }}
        />
      </Tooltip>
      {visible && (
        <Modal
          title="Atualizar informações da parcela"
          width={1200}
          visible={visible}
          onCancel={() => setVisible(false)}
          footer={null}
        >
          <Edit
            plans={plans}
            paymentMethods={paymentMethods}
            data={data}
            edit={edit}
            setData={setData}
            setVisible={setVisible}
            submit={submitUpdate}
          />
        </Modal>
      )}
    </div>
  );
});

export default Actions;
