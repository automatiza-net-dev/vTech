// @ts-nocheck
import { useCallback, useState } from "react";

import { receiptService } from "@/OLD/services/receipt.service";

import FormChild from "@/OLD/components/Notes/FormChild";

import moment from "moment";
import { useToast } from "infinity-forge";

function Create({ setReload, setVisible, listCreated }) {
  const [data, setData] = useState({ receiptDate: moment(), items: [] });
  const [loading, setLoading] = useState(false);

  const { createToast } = useToast();

  const verifyErrors = (err) => {
    err?.response?.data?.errors?.forEach((err) => {
      if (err?.field === "supplierId") {
        return createToast({
          message: "Selecione o fornecedor",
          status: "error",
        });
      } else {
        return createToast({
          message: err?.message,
          status: "error",
        });
      }
    });
  };

  const submit = useCallback(() => {
    setLoading(true);
    receiptService
      .createReceipt(data)
      .then((res) => {
        setLoading(false);
        setVisible(false);
        setData({ receiptDate: moment(), items: [] });
        listCreated(res.data.id);
        return createToast({
          message: "Nota de entrada criada com sucesso!",
          status: "success",
        });
      })
      .catch((err) => {
        setLoading(false);
        verifyErrors(err);
      });
  });

  return (
    <FormChild
      data={data}
      setData={setData}
      submit={submit}
      setVisible={setVisible}
    />
  );
}

export default Create;
