import moment from "moment";
import { useQueryClient } from "infinity-forge";
import { Accordion, Error, LoaderCircle } from "infinity-forge";

import { useLoadBudget } from "./hook";
import { AuthorizationPaymentForm } from "@/presentation";
import {
  PaymentHeader,
  TableItems,
  TablePayments,
} from "../../Bill/authorization-sell/components";

import * as S from "./styles";
import { Fragment } from "react";

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

  const maxBlock =
    data?.payments?.reduce(
      (max, item) => (item?.block > max ? item.block : max),
      0
    ) || 0;
  const maxBlocks = Array.from({ length: maxBlock });

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

        <TableItems {...(data as any)} isBudget={true} />

        {maxBlocks.map((_, index) => {
          const paymentsList = data.payments.filter(
            (payment) => payment.block === index + 1
          );

          if (!paymentsList || paymentsList.length === 0) {
            return <Fragment key={index + "block"} />;
          }

          return (
            <Accordion
              key={
                paymentsList.reduce((reducer, item) => reducer + item.id, "") ||
                ""
              }
              Header={() => <PaymentHeader paymentsList={paymentsList} />}
            >
              <TablePayments
                paymentsList={paymentsList}
                isCancelled={false}
                cancelledStatus={"A"}
              />
            </Accordion>
          );
        })}

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
