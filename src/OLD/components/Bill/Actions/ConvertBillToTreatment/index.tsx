// @ts-nocheck
import React, { memo, useState } from "react";
import { useRouter } from "next/router";

import { billService } from "@/OLD/services/bills.service";

import { AiOutlineCheckCircle } from "react-icons/ai";
import { useToast } from "infinity-forge";

const ConvertBillToTreatment = memo(function ConvertBillToTreatment({
  bill,
  setReload,
}: any) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { createToast } = useToast();

  const convertBill = (bill) => {
    setLoading(true);

    billService
      .convertBillToTreatment({
        billId: bill?.id,
        sellerId: bill?.seller?.id,
      })
      .then((res) => {
        setLoading(false);
        setReload && setReload((prv) => !prv);

        return createToast({
          status: "success",
          message: "Venda convertida com sucesso",
        });
      })
      .catch((err) => {
        setLoading(false);

        createToast({
          status: "error",
          message:
            "Houve um erro ao converter a venda, contacte o administrador do sistema para mais detalhes",
        });
      });
  };

  return (
    <AiOutlineCheckCircle
      onClick={() => convertBill(bill)}
      size={20}
      style={{ cursor: "pointer" }}
    />
  );
});

export default ConvertBillToTreatment;
