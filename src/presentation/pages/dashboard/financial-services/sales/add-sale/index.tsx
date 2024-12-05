import { Dispatch, SetStateAction, useState } from "react";

import {
  Input,
  Modal,
  useToast,
  FormHandler,
  LoaderCircle,
  BadRequestError,
} from "infinity-forge";

import {
  AddProduct,
  formatCart,
  useLoadBill,
  SelectClient,
  SelectSeller,
  ErrorDailyBox,
  useLoadPatient,
  DeleteCartItems,
  SelectSchedule,
  useLoadAllPatientTutor,
  useLoadAllDailyMovements,
} from "@/presentation";
import { RemoteBills } from "@/data";
import { Bill, UpdateBill } from "@/domain";
import { TypesAutomatiza, container } from "@/container";

import * as S from "./styles";
import {
  SelectBudgetClient,
  SelectBudgetPatient,
} from "../../budget/add-budget/components";

export function AddSale({
  billId,
  setModal,
  listCreated,
}: {
  billId?: Bill["id"];
  setModal?: Dispatch<SetStateAction<boolean>>;
  listCreated?: (id: Bill["id"]) => void | undefined;
}) {
  const [stockProducts, setStockProducts] = useState<any>([]);
  const [stockProductsOpen, setStockProductsOpen] = useState(false);

  const patient = useLoadPatient();
  const bill = useLoadBill({ id: billId });
  const dailyMovements = useLoadAllDailyMovements();

  const tutors = useLoadAllPatientTutor({
    enabled: !patient || !bill?.data?.patient,
  })?.data;

  const { createToast } = useToast();

  const activeDailyMovement = dailyMovements.data?.find(
    (movement) => movement.status === "Aberto"
  );

  if (
    dailyMovements.isFetching ||
    patient.isFetching ||
    (billId && bill?.isFetching)
  ) {
    return (
      <S.AddSale>
        <div className="loading">
          <LoaderCircle size={50} color="#000" />
        </div>
      </S.AddSale>
    );
  }

  if (
    (!activeDailyMovement && !dailyMovements.isFetching) ||
    (billId && bill.error)
  ) {
    return <ErrorDailyBox />;
  }

  const patientId =
    process.env.client === "sancla"
      ? bill?.data?.patient?.id || patient?.data?.id
      : patient?.data?.id;

  const clientId = billId
    ? bill?.data?.client?.id
    : process.env.client === "sancla"
    ? patient.data?.tutor?.id
    : patientId;

  const initialData = {
    maxDiscount: false,
    clientId,
    patientId,
    patientName: patient?.data?.name || bill?.data?.patient?.name,
    clientName:
      bill?.data?.client?.name ||
      patient?.data?.tutor?.name ||
      patient?.data?.name,
    cart: bill?.data?.products,
    sellerId: bill?.data?.seller?.id,
    financialResponsibleId: bill?.data?.financialResponsible?.id,
  };

  async function handleSubmit(data, _, initialValues) {
    try {
      const formatItemsCart = formatCart(data.cart, data?.maxDiscount);

      const payload = {
        ...data,
        billId,
        cart: undefined,
        items: formatItemsCart,
        billDate: new Date().toISOString(),
        dailyMovementId: activeDailyMovement?.id,
      } as UpdateBill.Params;

      const response = await container
        .get<RemoteBills>(TypesAutomatiza.RemoteBills)
        [billId ? "update" : "create"](payload);

      await DeleteCartItems(initialValues.cart, data.cart, true);

      listCreated && listCreated(response.id);

      createToast({
        status: "success",
        message: "Venda criada com sucesso",
      });

      setModal && setModal(false);
    } catch (err) {
      if (
        err instanceof BadRequestError &&
        err?.error?.message?.includes("não existe no depósito")
      ) {
        setStockProducts(err?.error?.message?.replaceAll("=", "|").split("|"));
        setStockProductsOpen(true);
      }
      if (
        err instanceof BadRequestError &&
        err?.error?.message === "Desconto máximo foi excedido"
      ) {
        if (
          window.confirm(
            `Desconto máximo foi excedido, A venda possui itens com desconto acima do permitido, deseja gravar e enviar a venda para aprovação?`
          )
        ) {
          handleSubmit({ ...data, maxDiscount: true }, _, initialValues);
        }
      }
    }
  }

  return (
    <S.AddSale>
      <FormHandler
        isStickyButtons
        disableEnterKeySubmitForm
        button={{ text: "SALVAR" }}
        initialData={initialData}
        onSucess={handleSubmit}
        cleanFieldsOnSubmit={false}
      >
        <h2 className="font-24-bold">{billId ? "Editar" : "Criar"} venda</h2>

        <div className="row">
          <SelectBudgetClient tutors={tutors} />

          {process.env.client === "sancla" ? (
            <SelectBudgetPatient tutors={tutors} />
          ) : (
            <>
              <SelectClient
                name="financialResponsibleId"
                label="Responsável financeiro"
              />
              <SelectSchedule />
            </>
          )}
          {process.env.client === "sancla" && (
            <SelectClient
              name="financialResponsibleId"
              label="Responsável financeiro"
            />
          )}
        </div>
        <div className="row">
          <SelectSeller />
          {process?.env?.client === "sancla" && <SelectSchedule />}
          <Input label="Observação" name="additionalInformation" />
        </div>
        <AddProduct />
      </FormHandler>

      <Modal
        open={stockProductsOpen}
        onClose={() => setStockProductsOpen(false)}
        styles={{ width: "500px", padding: "20px" }}
        children={
          <>
            <h4>Os seguintes produtos não possuem quantidade em estoque:</h4>
            {stockProducts?.map((item, i) => {
              if (i !== 0) {
                return <li key={i}>{item}</li>;
              }
            })}
          </>
        }
      />
    </S.AddSale>
  );
}
