// @ts-nocheck
import React, { memo, useState } from "react";
import { useRouter } from "next/router";

import { billService } from "@/OLD/services/bills.service";

import { Tooltip, notification, Popconfirm } from "antd";

import { AiOutlineCheckCircle } from "react-icons/ai";

const ConvertBillToTreatment = memo(function ConvertBillToTreatment({
  bill,
  setReload,
}) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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
        return notification.success({
          message: (
            <span>
              Venda convertida com sucesso, clique{" "}
              <span
                className="uk-link"
                onClick={() => router.push(`/dashboard/tratamentos`)}
              >
                aqui
              </span>{" "}
              para acessar os detalhes do tratamento{" "}
            </span>
          ),
        });
      })
      .catch((err) => {
        setLoading(false);
        return notification.error({
          message:
            "Houve um erro ao converter a venda, contacte o administrador do sistema para mais detalhes",
        });
      });
  };

  return (
    <Tooltip title="Converter venda para tratamento">
      <Popconfirm
        title="Deseja converter venda para tratamento?"
        onConfirm={() => convertBill(bill)}
      >
        <AiOutlineCheckCircle size={20} style={{ cursor: "pointer" }} />
      </Popconfirm>
    </Tooltip>
  );
});

export default ConvertBillToTreatment;
