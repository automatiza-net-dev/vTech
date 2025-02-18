import moment from "moment";
import { Table, Collapse } from "antd";
import { useQueryClient } from "react-query";

import { api, Error, FormHandler, Input, LoaderCircle } from "infinity-forge";

const { Panel } = Collapse;

import { authorizationFormater } from "./utils/formater";

import { AUTH_COLUMNS, paymentsColumns } from "./columns";

import { currencyFormatter } from "../../Budget";

import {
  useLoadBill,
  PermissionItem,
  AuthorizationPaymentForm,
  usePermission,
} from "@/presentation";
import { Bill } from "@/domain";

import * as yup from "yup";

import * as S from "./styles";

export function AuthorizationSell({
  billId,
  setReload,
  cancelled,
}: {
  billId: string;
  setReload?: any;
  cancelled?: boolean;
} & Partial<Bill>) {
  const { data, isLoading } = useLoadBill({ id: billId });

  const hasPermissionToCancel = usePermission("VEN18");

  const queryClient = useQueryClient();

  if (isLoading) {
    return <LoaderCircle size={30} color="#ccc" />;
  }

  if (!data) {
    return <></>;
  }

  const tableDataSource =
    data?.items?.map((item, index) => ({
      id: item?.id,
      index,
      quantity: 2,
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
      authorization: authorizationFormater(item, "product"),
    })) || [];

  const paymentsDataSource = data?.payments?.map((payment, index) => ({
    ...payment,
    index,
    id: payment.id,
    createdAt: payment?.created_at
      ? moment(payment?.created_at).format("DD/MM/YYYY - HH:MM")
      : "---",
    value: payment?.total_value ? moment(payment?.total_value) : "---",
    paymentMethodDescription: payment?.paymentMethod?.description,
    nsu: payment?.nsu_document || "---",
    authorization: authorizationFormater(payment, "payment"),
  }));

  let block = 0;
  data?.payments?.map((item) => {
    if (item?.block > block) {
      block = item?.block;
    }
  });

  const blockList = Array.from(Array(block).keys());

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
        <div className="form_cancel">
          <FormHandler
            schema={{
              userEmail: yup.string().required("Campo requerido"),
              userPwd: yup.string().required("Campo requerido"),
            }}
            button={
              hasPermissionToCancel
                ? { text: "CANCELAR" }
                : {
                    text: "Usuario não possui permissão para solicitar o cancelamento de vendas",
                    disabled: true,
                  }
            }
            disableEnterKeySubmitForm
            cleanFieldsOnSubmit={false}
            isStickyButtons
            onSucess={async (data) => {
              const payload = {
                ...data,
                billId,
                notes: " ",
                billItems: data.billItems?.filter((item) => item.active),
                billPayments: data.billPayments
                  ?.filter((item) => item.active)
                  ?.map((item) => item.id),
              };

              await api({
                url: "bills/request-cancellation",
                method: "post",
                body: payload,
              });
            }}
          >
            {cancelled && (
              <PermissionItem hash="VEN18">
                <div className="row">
                  <Input name="userEmail" label="Email" />
                  <Input label="Senha" name="userPwd" />
                </div>
              </PermissionItem>
            )}

            <Table
              columns={AUTH_COLUMNS({ cancelled })}
              dataSource={tableDataSource}
            />

            {paymentsDataSource?.length > 0 && (
              <h1 className="font-18-bold">Pagamentos</h1>
            )}

            {paymentsDataSource?.length > 0 &&
              blockList.map((i) => {
                const paymentsList = paymentsDataSource?.filter(
                  (item) => item?.block === i + 1
                );
                return (
                  <>
                    <Collapse key={i} style={{ margin: "10px" }}>
                      <Panel
                        key={i}
                        header={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: "10px",
                            }}
                          >
                            <div style={{ display: "flex", gap: "10px" }}>
                              <div>
                                {paymentsList?.[0]?.paymentMethod?.description}
                                &nbsp;
                                {paymentsList?.[0]?.qty_installments > 1
                                  ? "(Parcelado)"
                                  : ""}
                                &nbsp;
                                {paymentsList?.[0]?.flag?.description
                                  ? paymentsList?.[0]?.flag?.description
                                  : ""}
                                &nbsp;
                                {paymentsList?.[0]?.paymentMethod?.type}
                              </div>
                              <div>
                                {currencyFormatter(
                                  paymentsList.reduce(
                                    (acc, current) => acc + current.total_value,
                                    0
                                  )
                                )}
                              </div>
                              <div>{paymentsList?.length}x</div>
                            </div>
                            <div style={{ display: "flex" }}>
                              {paymentsList?.[0]?.pending && "Pendente"}
                              {authorizationFormater(
                                paymentsList?.[0],
                                "payment"
                              )}
                            </div>
                          </div>
                        }
                      >
                        <Table
                          columns={paymentsColumns({ cancelled })}
                          dataSource={paymentsList}
                        />
                      </Panel>
                    </Collapse>
                  </>
                );
              })}
          </FormHandler>
        </div>

        <AuthorizationPaymentForm
          auth={"VEN16"}
          bill={data}
          onSuccess={async () => {
            await queryClient.invalidateQueries({
              queryKey: ["RemoteLoadBill", billId],
            });

            setReload && setReload((prv) => !prv);
            document?.querySelector<any>(".ant-modal-close")?.click();
          }}
        />
      </S.AuthorizationSell>
    </Error>
  );
}
