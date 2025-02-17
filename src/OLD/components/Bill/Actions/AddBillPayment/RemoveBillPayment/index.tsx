// @ts-nocheck
import React, { memo, useCallback, useState } from "react";
import { useQueryClient } from "react-query";

import { billService } from "@/OLD/services/bills.service";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Button, useToast } from "infinity-forge";
import { Popconfirm, notification } from "antd";

const RemoveBillPayment = memo(function ({
  payments,
  setEditExpirationDate = false,
  data = false,
  editExpirationDate,
  billId,
}) {
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { createToast } = useToast();

  const removeBlockPermission = useUserHasPermission("VEN05");
  const updateExpirationDatePermission = useUserHasPermission("VEN13");

  const verifyErrors = (message) => {
    if (message.includes("baixa em algum pagamento")) {
      return createToast({
        status: "error",
        message:
          "Este bloco de pagamentos já possui parcela(s) baixada(s) no financeiro.",
      });
    }
    return createToast({
      status: "error",
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
        return createToast({
          status: "success",
          message: "Bloco removido com sucesso!",
        });
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
        return createToast({
          status: "suc",
          message: "Datas de vencimento atualizadas!",
        });
      })
      .catch((err) => {
        createToast({
          status: "error",
          message: "Houve um erro ao atualizar parcelas...",
        });
      });
  }, [data, editExpirationDate]);

  return (
    <div
      className="uk-flex uk-flex-right uk-margin-bottom"
      style={{ gap: "10px" }}
    >
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
        <Button text="Remover Pagamento" onClick={removeBillPayment} />
      )}
    </div>
  );
});

export default RemoveBillPayment;
