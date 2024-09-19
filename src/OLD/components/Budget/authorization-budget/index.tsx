import moment from "moment";
import { Table } from "antd";
import { useQueryClient } from "react-query";
import { Error, LoaderCircle } from "infinity-forge";

import { useLoadBudget } from "./hook";
import { authorizationFormater } from "./utils/formater";
import { AuthorizationPaymentForm } from "@/presentation";

import { AUTH_COLUMNS } from "./columns";

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

  const tableDataSource =
    data?.items?.map((item: any) => ({
      quantity: item?.quantity,
      description: item?.productVariation?.product?.description,
      productCode: item?.productVariation?.product?.reference_code,
      singleRegistragionPrice: item?.sale_value,
      singleSellingPrice: item?.unitary_value,
      grantedDiscount: item?.discount_value,
      maxDiscount:
        item?.productVariation?.businessUnitProducts[0]
          ?.maximum_discount_percentage,
      courtesy: item?.courtesy ? "Sim" : "Não",
      totalItem: item?.total_value,
      authorization: authorizationFormater(item),
    })) || [];

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

        <Table columns={AUTH_COLUMNS} dataSource={tableDataSource} />

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
