import React, { useCallback, useState } from "react";
import { useQueryClient } from "@/presentation/use-query";

import { billService } from "@/OLD/services/bills.service";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { api, Button, useToast } from "infinity-forge";

function RemoveBillPayment({
  payments,
  setEditExpirationDate = false,
  data = false,
  editExpirationDate,
  billId,
}: any) {
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

  const removeBillPayment = useCallback(async () => {
    setLoading(true);

    try {
      await api({
        url: "bills/delete-payment-block",
        method: "delete",
        body: {
            block: payments[0].block,
            billId,
        },
      });

      await queryClient.refetch(["bills"]);
      createToast({
        status: "success",
        message: "Bloco removido com sucesso!",
      });
    } catch (err: any) {
      console.log(err, "@erro")
      verifyErrors(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
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
          status: "success",
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
          loading={loading}
          disabled={loading}
          onClick={updateBillExpirationDate}
          text={
            !editExpirationDate
              ? "Alterar Vencimento"
              : "Salvar Vencimento Parcelas"
          }
        />
      )}

      {removeBlockPermission && !editExpirationDate && (
        <Button text="Remover Pagamento"  loading={loading}
          disabled={loading} onClick={removeBillPayment} />
      )}
    </div>
  );
}

export default RemoveBillPayment;
