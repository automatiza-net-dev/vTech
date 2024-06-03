// @ts-nocheck
import React, { useMemo } from "react";

import { Container } from "./styles";
import { useQuery } from "react-query";
import { financesService } from "@/OLD/services/finances.service";

const TitlesToReceiveToday = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["card", "payments-expiring-today"],
    queryFn: () =>
      financesService.getExpiringPayments().then((res) => res.data),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const totalValue = useMemo(() => {
    if (!data) {
      return -1;
    }

    return data.reduce((acc, curr) => acc + curr.totalValue, 0);
  }, [data]);
  const valueMap = useMemo(() => {
    const _map = {};

    if (!data) {
      return _map;
    }

    for (const elem of data) {
      const key = elem.paymentMethod.description;

      if (!_map[key]) {
        _map[key] = 0;
      }

      _map[key] += elem.totalValue;
    }

    return _map;
  }, [data]);

  const formatMoney = (value) => {
    return parseFloat(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <Container>
      <h4>Titulos a receber hoje:</h4>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p className="totalText">
            {" "}
            <strong>Total:</strong> {formatMoney(totalValue)}
          </p>
          <ul>
            {Object.entries(valueMap).map(([k, v]) => (
              <li key={k}>
                <div className="grid">
                  <div className="paymentText">{k}</div>
                  <div className="valueText">{formatMoney(v)}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
};

export default TitlesToReceiveToday;
