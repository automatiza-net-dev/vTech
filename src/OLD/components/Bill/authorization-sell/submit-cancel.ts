import { Product } from "@/domain";
import { api } from "infinity-forge";

export async function onSubmitCancel({ formData, props }) {

  if(!formData?.billItems || formData.billItems.length === 0 || !formData?.billItems?.find((item) => item.active)) {
    throw window.alert("Selecione ao menos um item a ser cancelado")
  }

  const payload = {
    cancelReason: formData.notes,
    userEmail: formData.userEmail,
    userPwd: formData.userPwd,
    billId: props.id,
    billItems:
      formData?.billItems
        ?.filter((item) => item.active)
        .map((item) => ({
          ...item,
          quantity: Number(item.quantity || 0),
        })) || [],
    billPayments: formData?.billPayments?.filter((item) => !!item) || [],
    notes: " ",
  };

  await api({
    url: "bills/request-cancellation",
    method: "post",
    body: payload,
  });
}

export async function onSubmitFinishCancel({ formData, props }) {
  const payload = {
    cancelled: formData.cancelled === "true" ? true : false,
    userEmail: formData.userEmail,
    userPwd: formData.userPwd,
    billId: props.id,
    note: formData.notes,
    depositId: formData?.cancelled === "true" ? formData?.depositId : undefined
    // billPayments: [],
    // billItems: [],
  };

  await api({
    url: "bills/finish-cancellation",
    method: "post",
    body: payload,
  });
}

export async function onSubmitAprroveCancel({
  formData,
  props,
  items,
}: {
  items: Product[];
  props;
  formData: any;
}) {

  const billItems = items?.filter(item => item?.cancelled === "P")?.map((item) => ({
    id: item.id,
    note: formData.notes,
    cancelled: formData.cancelled === "true" ? true : false,
  }));

  const payload = {
    ...formData,
    billItems: billItems || [],
    billPayments: [],
    email: formData.userEmail,
    password: formData.userPwd,
    billId: props.id,
  };

  await api({
    url: "bills/review-cancellation",
    method: "post",
    body: payload,
  });
}

export async function onSubmitAprroveCancelF({ formData, props }) {
  const billPayments =
    formData.billPayments &&
    Object.keys(formData.billPayments as any)
      ?.reduce((reducer, item) => {
        const value = formData.billPayments[item];

        return [
          ...reducer,
          {
            id: item,
            note: formData.notes,
            cancelled: value?.cancelled?.includes("Sim") ? true : false,
          },
        ];
      }, [] as any)
      ?.filter((item) => item.cancelled);

  const payload = {
    ...formData,
    noPayments: formData.noPayments,
    billItems: [],
    billPayments: billPayments || [],
    email: formData.userEmail,
    password: formData.userPwd,
    billId: props.id,
  };

  await api({
    url: "bills/review-cancellation",
    method: "post",
    body: payload,
  });
}
