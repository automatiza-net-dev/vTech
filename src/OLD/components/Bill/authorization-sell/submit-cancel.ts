import { api } from "infinity-forge";

export async function onSubmitCancel({ data, queryClient, props }) {
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
    url: "bills/review-cancellation",
    method: "post",
    body: payload,
  });

  await queryClient.invalidateQueries({
    queryKey: ["bills", true],
  });

  await queryClient.invalidateQueries({
    queryKey: ["bills", false],
  });

  props.onSuccess && props?.onSuccess();
}

export async function onSubmitAprroveCancel({ data, props }) {
  const payload = {
    ...data,
    billItems: data?.billItems
      ?.filter((item) => !!item)
      .map((newItem) => ({
        ...newItem,
        cancelled: newItem.cancelled === "Sim" ? true : false,
      })),
    billPayments: data?.billPayments?.filter((item) => !!item)
      .reduce((reducer, item) => {
        return [...reducer, ...item?.items?.filter((item) => !!item)];
      }, [])?.map((newItem) => ({
        ...newItem,
        cancelled: newItem.cancelled === "Sim" ? true : false,
      })),
    userEmail: data.userEmail,
    userPwd: data.userPwd,
    billId: props.id,
  };

  console.log(payload);

  //   await api({
  //     url: "bills/request-cancellation",
  //     method: "post",
  //     body: payload,
  //   });
}
