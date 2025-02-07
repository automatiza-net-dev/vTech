// @ts-nocheck
import React, { memo, useCallback, useState } from "react";
import { useQueryClient } from "react-query";

import { billService } from "@/OLD/services/bills.service";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Button } from "infinity-forge";
import { Popconfirm, notification } from "antd";

const verifyUpdateExpirationErrors = (err) => {
  return notification.error({
    message: "Houve um erro ao atualizar parcelas...",
  });
};

const RemoveBillPayment = memo(function ({
  payments,
  setEditExpirationDate = false,
  data = false,
  editExpirationDate,
  billId,
}) {
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const removeBlockPermission = useUserHasPermission("VEN05");
  const updateExpirationDatePermission = useUserHasPermission("VEN13");

  const verifyErrors = (message) => {
    if (message.includes("baixa em algum pagamento")) {
      return notification.warning({
        message:
          "Este bloco de pagamentos já possui parcela(s) baixada(s) no financeiro.",
      });
    }
    return notification.error({
      message: "Houve um erro ao remover o bloco de pagamentos...",
    });
  };

  const removeBillPayment = useCallback(() => {
    setLoading(true);

    billService
      .removeBillPaymentBlock({ block: payments[0].block, billId })
      .then((_res) => {
        setLoading(false);
        queryClient.invalidateQueries(["bills"]);
        return notification.success({ message: "Bloco removido com sucesso!" });
      })
      .catch((err) => {
        verifyErrors(err?.response?.data?.message);
        setLoading(false);
      });

    setLoading(false);
  }, [payments, billId]);

  const updateBillExpirationDate = useCallback(() => {
    if (!editExpirationDate) {
      return setEditExpirationDate(true);
    }

    billService
      .updateExpirationDate({ items: data })
      .then((res) => {
        queryClient.invalidateQueries(["bills"]);
        setEditExpirationDate(false);
        return notification.success({
          message: "Datas de vencimento atualizadas!",
        });
      })
      .catch((err) => {
        verifyUpdateExpirationErrors(err);
      });
  }, [data, editExpirationDate]);

  return (
    <div className="uk-flex uk-flex-right uk-margin-bottom" style={{ gap: '10px' }}>
      {updateExpirationDatePermission && (
        <Button
          onClick={() => updateBillExpirationDate()}
          text={
            !editExpirationDate
              ? "Alterar Vencimento"
              : "Salvar Vencimento Parcelas"
          }
        />
      )}
      {removeBlockPermission && !editExpirationDate && (
        <Popconfirm
          title="Deseja realmete excluir esse pagamento?"
          onConfirm={removeBillPayment}
          okText="Sim"
          cancelText="Não"
          placement="left"
        >
            <Button text="Remover Pagamento" />
        </Popconfirm>
      )}
    </div>
  );
});

export default RemoveBillPayment;
