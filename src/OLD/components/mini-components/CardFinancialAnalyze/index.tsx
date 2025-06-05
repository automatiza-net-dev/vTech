// @ts-nocheck
import { currencyFormatter } from "@/OLD/components/Budget";
import { useCheckingAccounts } from "@/OLD/hooks/useCheckingAccounts";
import { useFinances } from "@/OLD/hooks/useFinances";
import { useEffect, useMemo, useState } from "react";

import { Container } from "./styles";

import moment from "moment";
import { useQuery } from "infinity-forge";
import { financesService } from "@/OLD/services/finances.service";

const keyMap = {
  VencidosAPagar: "Vencidos a Pagar",
  VencidosAReceber: "Vencidos a Receber",
  FuturosAPagar: "Futuros a Pagar",
  FuturosAReceber: "Futuros a Receber",
  ContasCorrentes: "Contas Correntes",
};

const CardFinancialAnalyze = () => {
  const { data } = useQuery({
    queryKey: ["card", "overall-resume"],
    queryFn: () => financesService.getOverallResume().then((res) => res.data),
    enableCache: true
  });
  const memoMap = useMemo(() => {
    if (!data)
      return {
        VencidosAPagar: 0,
        VencidosAReceber: 0,
        FuturosAPagar: 0,
        FuturosAReceber: 0,
        ContasCorrentes: 0,
      };

    return {
      VencidosAPagar: data.find((f) => f.type === "VencidosAPagar").total ?? -1,
      VencidosAReceber:
        data.find((f) => f.type === "VencidosAReceber").total ?? -1,
      FuturosAPagar: data.find((f) => f.type === "FuturosAPagar").total ?? -1,
      FuturosAReceber:
        data.find((f) => f.type === "FuturosAReceber").total ?? -1,
      ContasCorrentes:
        data.find((f) => f.type === "ContasCorrentes").total ?? -1,
    };
  }, [data]);

  return (
    <Container>
      <h4>Análise - Financeiro</h4>
      {data && (
        <ul>
          {Object.keys(keyMap).map((key) => (
            <li key={key}>
              <strong>{keyMap[key]}:</strong> {currencyFormatter(memoMap[key])}
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
};

export default CardFinancialAnalyze;
