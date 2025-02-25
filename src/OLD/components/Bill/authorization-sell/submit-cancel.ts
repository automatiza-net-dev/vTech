import { api } from "infinity-forge";

export async function onSubmitCancel({ data, props }) {
  const payload = {
    cancelReason: data.cancelReason,
    userEmail: data.userEmail,
    userPwd: data.userPwd,
    billId: props.id,
    billItems:
      data?.billItems
        ?.filter((item) => item.active)
        .map((item) => ({
          ...item,
          quantity: Number(item.quantity || 0),
        })) || [],
    billPayments: data?.billPayments?.filter((item) => !!item) || [],
    notes: " ",
  };

  await api({
    url: "bills/request-cancellation",
    method: "post",
    body: payload,
  });
}

export async function onSubmitFinishCancel({ data, props }) {
  const payload = {
    cancelled: data.cancelled === "true" ? true : false,
    userEmail: data.userEmail,
    userPwd: data.userPwd,
    billId: props.id,
    notes: data.cancelReason,
  };

  await api({
    url: "bills/request-cancellation",
    method: "post",
    body: payload,
  });
}


export async function onSubmitAprroveCancel({ data, props }) {
  const billPayments =
    data.billPayments &&
    Object.keys(data.billPayments as any)?.reduce((reducer, item) => {
      const value = data.billPayments[item];

      return [
        ...reducer,
        {
          id: item,
          note: value.note,
          cancelled: value.cancelled === "Sim" ? true : false,
        },
      ];
    }, [] as any);

  const billItems =
    data.billItems &&
    Object.keys(data.billItems as any)?.reduce((reducer, item) => {
      const value = data.billItems[item];

      return [
        ...reducer,
        {
          id: item,
          note: value.note,
          cancelled: value.cancelled === "Sim" ? true : false,
        },
      ];
    }, [] as any);

  const payload = {
    ...data,
    billItems: billItems || [],
    billPayments: billPayments || [],
    email: data.userEmail,
    password: data.userPwd,
    billId: props.id,
  };

  await api({
    url: "bills/review-cancellation",
    method: "post",
    body: payload,
  });
}
