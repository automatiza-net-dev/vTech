import { Product } from "@/domain";
import { api } from "infinity-forge";

export async function onSubmitCancel({ formData, props }) {
  const payload = {
    cancelReason: formData.cancelReason,
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
    note: formData.cancelReason,
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
    note: formData.note,
    cancelled: formData.cancelled === "Sim" ? true : false,
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
            note: value.note,
            cancelled: value?.cancelled?.includes("Sim") ? true : false,
          },
        ];
      }, [] as any)
      ?.filter((item) => item.cancelled);

  const payload = {
    ...formData,
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
