// @ts-nocheck
import { memo, useCallback, useState } from "react";

import { receiptService } from "@/OLD/services/receipt.service";

import FormChild from "@/OLD/components/Notes/FormChild";

import moment from "moment";
import { notification } from "antd";

const verifyErrors = (err) => {
  return notification.error({ message: "Houve um erro ao cadastrar a nota" });
};

const Create = memo(function Create({ setReload, setVisible }) {
  const [data, setData] = useState({ receiptDate: moment(), items: [] });
  const [loading, setLoading] = useState(false);

  const submit = useCallback(() => {
    setLoading(true);
    receiptService
      .createReceipt(data)
      .then((_res) => {
        setReload((prv) => !prv);
        setLoading(false);
        setVisible(false);
        setData({ receiptDate: moment(), items: [] });
        return notification.success({
          message: "Nota de entrada criada com sucesso!",
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
});

export default Create;
