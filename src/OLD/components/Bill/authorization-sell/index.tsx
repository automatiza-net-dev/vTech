import {
  Error,
  Input,
  useToast,
  Textarea,
  FormHandler,
  LoaderCircle,
} from "infinity-forge";
import moment from "moment";
import { Table } from "antd";
import { useQueryClient } from "react-query";

import { schema } from "./schema";
import { useLoadBill } from "./hook";
import { authorizationFormater } from "./utils/formater";

import { RemoteBills } from "@/data";
import { AUTH_COLUMNS } from "./columns";
import { PermissionItem } from "@/presentation";

import {
  financialServicesTypes,
  financialServicesContainer,
} from "@/container";

import * as S from "./styles";

export function AuthorizationSell({
  billId,
  setReload,
}: {
  billId: string;
  setReload;
}) {
  const { data, isLoading } = useLoadBill({ billId });
  const { createToast } = useToast();
  const queryClient = useQueryClient();

  if (isLoading) {
    return <LoaderCircle size={30} color="#ccc" />;
  }

  if (!data) {
    return <></>;
  }

  const showForm = data?.items?.some(
    (item) =>
      !item.approved &&
      item.courtesy_approved_at === null &&
      (item.courtesy || item.max_discount)
  );

  const tableDataSource =
    data?.items?.map((item) => ({
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

  async function sendBillAuthorization(approved: boolean, payload) {
    const itemsIdList = data?.items
      ?.filter(
        (item) =>
          !item.approved &&
          item.courtesy_approved_at === null &&
          (item.courtesy || item.max_discount)
      )
      .map((item) => item.id);

    if (itemsIdList.length === 0) {
      createToast({ message: "Nenhum item selecionado", status: "error" });
      return;
    }

    try {
      await financialServicesContainer
        .get<RemoteBills>(financialServicesTypes.RemoteBills)
        .authDiscountPendencySellingBill({
          approved,
          itemsIdList,
          billId,
          email: payload.email,
          password: payload.password,
          reason: payload.description,
        });

      await queryClient.invalidateQueries({
        queryKey: ["RemoteLoadBill", billId],
      });

      setReload && setReload((prv) => !prv);
      document?.querySelector<any>(".ant-modal-close")?.click();

      createToast({ message: "Alterado com sucesso!", status: "success" });
    } catch (err: any) {
      createToast({
        message: err?.error?.message || "Ocorreu um erro ao enviar",
        status: "error",
      });
    }
  }

  return (
    <Error name="AuthorizationSell">
      <S.AuthorizationSell>
        <div className="inputs">
          <div>
            <label>Data de venda</label>
            <input
              disabled
              value={moment(data?.bill_date).format("HH:mm DD/MM/YYYY")}
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

        {showForm && (
          <PermissionItem hash="VEN16">
            <FormHandler
              schema={schema}
              onSucess={(payload) => sendBillAuthorization(true, payload)}
              button={{
                text: "Autorizar",
              }}
              customSubmit={[
                {
                  action: (payload) => sendBillAuthorization(false, payload),
                  active: true,
                  props: {
                    text: "Não Autorizar",
                  },
                },
              ]}
            >
              <Input name="email" label="Email Usuário" />

              <Input label="Senha" name="password" type="password" />

              <Textarea label="Descrição" name="description" />
            </FormHandler>
          </PermissionItem>
        )}
      </S.AuthorizationSell>
    </Error>
  );
}
