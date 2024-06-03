// @ts-nocheck
import { currencyFormatter } from "@/OLD/components/Budget";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { financesService } from "@/OLD/services/finances.service";
import { Container } from "./styles";

const CardCheckingAccount = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["card", "checking-accounts-resume"],
    queryFn: () =>
      financesService.getCheckingAccountsResume().then((res) => res.data),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const totalBalance = useMemo(() => {
    if (!data) return 0;

    return data.reduce((acc, curr) => acc + curr.balance, 0);
  }, [data]);

  return (
    <Container>
      <h4>Saldo Contas Correntes:</h4>
      <p className="totalText">
        {" "}
        <strong>Total:</strong> {currencyFormatter(totalBalance)}
      </p>
      <div className="containerFlex">
        <strong className="accountText">Conta:</strong>
        <strong className="balanceText">Saldo:</strong>
      </div>

      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {data?.map((account) => (
            <li key={account.id}>
              <span className="accountText">{account.description}</span>
              <br />
              <span className="balanceText">
                {currencyFormatter(account.balance)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
};

export default CardCheckingAccount;
