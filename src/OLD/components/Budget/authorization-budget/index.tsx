import moment from "moment";
import { Table } from "antd";
import { useQueryClient } from "react-query";
import { Error, LoaderCircle } from "infinity-forge";

import { useLoadBudget } from "./hook";
import { AuthorizationPaymentForm } from "@/presentation";
import { TableItems } from "../../Bill/authorization-sell/components";

import * as S from "./styles";

export function AuthorizationBudget({
  budgetId,
  setReload,
}: {
  budgetId: string;
  setReload;
}) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useLoadBudget({ id: budgetId });

  if (isLoading) {
    return <LoaderCircle size={30} color="#ccc" />;
  }

  if (!data) {
    return <></>;
  }

  return (
    <Error name="AuthorizationSell">
      <S.AuthorizationSell>
        <div className="inputs">
          <div>
            <label>Data de venda</label>
            <input
              disabled
              value={moment(data?.budget_date).format("HH:mm DD/MM/YYYY")}
            />
          </div>

          <div>
            <label>Código</label>
            <input disabled value={data?.tag} />
          </div>

          <div>
            <label>Vendedor</label>
            <input disabled value={data?.seller?.name} />
          </div>

          <div>
            <label>Nome Cliente</label>
            <input disabled value={data?.client?.name} />
          </div>
        </div>

        {/* <Table columns={AUTH_COLUMNS} dataSource={tableDataSource} /> */}

        <TableItems {...data as any} isBudget={true} />

        <AuthorizationPaymentForm
          auth={"ORC11"}
          budget={data}
          onSuccess={async () => {
            await queryClient.invalidateQueries({
              queryKey: ["RemoteLoadBudget", budgetId],
            });

            setReload && setReload((prv) => !prv);
            document?.querySelector<any>(".ant-modal-close")?.click();
          }}
        />
      </S.AuthorizationSell>
    </Error>
  );
}
