import { FormHandler, Input, InputPassword, Textarea, useToast } from "infinity-forge";

import { Bill, Budget } from "@/domain";
import { RemoteBills, RemoteBudget } from "@/data";
import {
  financialServicesTypes,
  financialServicesContainer,
} from "@/container";

import * as yup from "yup";

export function AuthorizationPaymentForm({
  bill,
  budget,
  onSuccess,
  auth,
}: {
  bill?: Bill;
  budget?: Budget;
  onSuccess: () => void;
  auth: "ORC11" | "VEN16";
}) {
  const { createToast } = useToast();

  const entitie = bill || (budget as Budget & Bill);

  async function sendAuthorization(approved: boolean, data: any) {
    const itemsIdList = entitie?.items
      ?.filter(
        (item) =>
          !item.approved &&
          item.courtesy_approved_at === null &&
          (item.courtesy || item.max_discount)
      )
      .map((item) => item.id);

    const paymentsIdList = entitie?.payments
      ?.filter((item) => item?.pending)
      .map((item) => item.id);

    if (
      (!itemsIdList || itemsIdList.length === 0) &&
      (!paymentsIdList || paymentsIdList.length === 0)
    ) {
      createToast({ message: "Nenhum item selecionado", status: "error" });
      return;
    }

    try {
      const payload = {
        ...data,
        approved,
        itemsIdList,
        paymentsIdList,
        reason: data.description,
      };

      if (budget) {
        await financialServicesContainer
          .get<RemoteBudget>(financialServicesTypes.RemoteBudget)
          .authDiscountPendencySellingBudget({
            ...payload,
            budgetId: budget?.id,
          });
      }

      if (bill) {
        await financialServicesContainer
          .get<RemoteBills>(financialServicesTypes.RemoteBills)
          .authDiscountPendencySellingBill({
            ...payload,
            billId: bill.id,
          });
      }

      createToast({ message: "Alterado com sucesso!", status: "success" });

      onSuccess();
    } catch (err: any) {
      createToast({
        message: err?.error?.message || "Ocorreu um erro ao enviar",
        status: "error",
      });
    }
  }

  const hasCourtesyOrMaxDiscountPending = entitie.items?.some(
    (item) =>
      !item.approved &&
      item.courtesy_approved_at === null &&
      (item.courtesy || item.max_discount)
  );
  const hasPaymentPending = entitie.payments?.some((item) => item.pending);

  const showAuthorizationForm =
    hasCourtesyOrMaxDiscountPending || hasPaymentPending;

  if (!showAuthorizationForm) {
    return <></>;
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
    <FormHandler
      schema={{
        email: yup.string().required("E-mail é obrigatório"),
        password: yup.string().required("Senha é obrigatório"),
        description: yup.string().required("Descrição é obrigatório"),
      }}
      onSucess={(payload) => sendAuthorization(true, payload)}
      button={{
        text: "Autorizar",
      }}
      customSubmit={[
        {
          action: (payload) => sendAuthorization(false, payload),
          active: true,
          props: () => ({
            text: "Não Autorizar",
          }),
        },
      ]}
      isStickyButtons
    >
      <div className="row">
        <Input name="email" label="Email Usuário" />

        <InputPassword label="Senha" name="password"  />
      </div>

      <Textarea label="Descrição" name="description" />
    </FormHandler>
    </div>
  );
}
