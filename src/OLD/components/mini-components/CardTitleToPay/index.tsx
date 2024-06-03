// @ts-nocheck
import React, { useMemo } from "react";

import { Container } from "./styles";
import { useQuery } from "react-query";
import { financesService } from "@/OLD/services/finances.service";

const TitlesToPayToday = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["card", "expenses-expiring-today"],
    queryFn: () =>
      financesService.getExpiringExpenses().then((res) => res.data),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const totalValue = useMemo(() => {
    if (!data) {
      return -1;
    }

    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, [data]);

  // Function to format the value as money (BRL)
  const formatMoney = (value) => {
    return parseFloat(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <Container>
      <h4>Titulos a pagar hoje:</h4>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p className="totalText">
            <strong>Total:</strong> {formatMoney(totalValue)}
          </p>
          <ul>
            {data?.map((title) => (
              <li key={title.id}>
                <div className="grid">
                  <div className="supplierText">{`${title.supplier}`}</div>
                  <div className="valueText">{formatMoney(title.value)}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
};

export default TitlesToPayToday;
