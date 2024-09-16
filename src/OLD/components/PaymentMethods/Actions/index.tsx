// @ts-nocheck

// Core
import React, { memo, useState, useEffect, useCallback } from "react";

// Icons
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";

// Service
import { paymentMethodsService } from "@/OLD/services/paymentMethods.service";

// Components
import { Container } from "./styles";
import { Modal, notification, Popconfirm } from "antd";
import FormChild from "../FormChild";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

const Actions = memo(function Actions({ method, reload, setReload }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);

  const canEditPaymentMethods = useUserHasPermission("FPG02");
  const canDeletePaymentMethods = useUserHasPermission("FPG03");

  useEffect(() => {
    setData({
      description: method?.description,
      active: method?.active,
      daysFirstInstallment: method?.days_first_installment,
      daysBetweenInstallments: method?.days_between_installments,
      maxInstallments: method?.max_installments,
      installmentsWithoutPassword: method?.installments_without_password,
      minimumInstallmentValue: method?.minimum_installment_value,
      requiresDocument: method?.requires_document,
      allowChangeExpirationDate: method?.allow_change_expiration_date,
      automaticCancellation: method?.automatic_cancellation,
      checkingAccountId: method?.checkingAccount?.id,
      tef: method?.tef,
      daysUntilTransfer: method?.days_until_transfer,
      type: method?.type,
      update: true,
      flags: method?.flags,
      fee: method?.fee,
      usage: method?.usage,
    });
  }, [method]);

  const removePaymentMethod = useCallback(() => {
    setLoading(true);
    paymentMethodsService
      .removePaymentMethod(method?.id)
      .then((_res) =>
        notification.success({
          message: "Método de pagamento removido com sucesso!",
        })
      )
      .catch((err) => {
        setLoading(false);
        if (err?.response?.data?.message) {
          const messageArr = err?.response?.data?.message.split(":");
          return notification.error({ message: messageArr[1] });
        }
        return notification.error({
          message: "Houve um erro ao remover o método de pagamento...",
        });
      });
  }, [method?.id]);

  const submitUpdatePaymentMethod = useCallback(() => {
    if (!data?.usage) {
      return notification.warning({ message: "Selecione o tipo de pagamento" });
    }
    setLoading(true);
    paymentMethodsService
      .updatePaymentMethod(method?.id, data)
      .then((_res) =>
        notification.success({
          message: "Forma de pagamento atualizada com sucesso!",
        })
      )
      .catch((err) => {
        setLoading(false);
        if (err?.response?.data?.message) {
          const messageArr = err?.response?.data?.message.split(":");
          return notification.error({ message: messageArr[1] });
        }
        return notification.error({
          message: "Houve um erro ao atualizar o método de pagamento...",
        });
      })
      .finally(() => {
        setUpdateVisible(false);
        setReload(!reload);
      });
  }, [method?.id, data]);

  return (
    <Container className="uk-flex uk-flex-around">
      {canEditPaymentMethods && (
        <EditTwoTone
          className="action-icon"
          onClick={() => setUpdateVisible(true)}
        />
      )}
      <Popconfirm
        placement="topLeft"
        title="Deseja remover essa forma de pagamento ?"
        okText="Remover"
        cancelText="Cancelar"
        onConfirm={removePaymentMethod}
      >
        {canDeletePaymentMethods && (
          <DeleteTwoTone className="action-icon" twoToneColor="red" />
        )}
      </Popconfirm>
      {updateVisible && (
        <Modal
          visible={updateVisible}
          title="Atualizar forma de pagamento"
          onCancel={() => setUpdateVisible(false)}
          width={800}
          footer={null}
        >
          <FormChild
            data={data}
            methodId={method?.id}
            setData={setData}
            setVisible={setUpdateVisible}
            submit={submitUpdatePaymentMethod}
            reload={reload}
            setReload={setReload}
          />
        </Modal>
      )}
    </Container>
  );
});

export default Actions;
