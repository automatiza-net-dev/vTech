import { Dispatch, SetStateAction, useState } from "react";

import {
  Input,
  Modal,
  useToast,
  FormHandler,
  LoaderCircle,
  useAuthAdmin,
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
  useConfigurationsSystem,
} from "@/presentation";
import { RemoteBills } from "@/data";
import { Bill, UpdateBill } from "@/domain";
import { TypesAutomatiza, container } from "@/container";

import {
  SelectBudgetClient,
  SelectBudgetPatient,
} from "../../budget/add-budget/components";

import * as S from "./styles";

export function AddSale({
  type = "create",
  billId,
  setModal,
  listCreated,
}: {
  billId?: Bill["id"];
  type?: "edit" | "create";
  setModal?: Dispatch<SetStateAction<boolean>>;
  listCreated?: (id: Bill["id"]) => void | undefined;
}) {
  const [stockProducts, setStockProducts] = useState<any>([]);
  const [stockProductsOpen, setStockProductsOpen] = useState(false);

  const patient = useLoadPatient();
  const bill = useLoadBill({ id: billId });
  const dailyMovements = useLoadAllDailyMovements();

  const configurationsSystem = useConfigurationsSystem()

  const internalCode = bill?.data?.internalCode;

  const tutors = useLoadAllPatientTutor({
    enabled: !patient || !bill?.data?.patient,
  })?.data;

  const { createToast } = useToast();
  const { user } = useAuthAdmin();

  const hasInternalCode = user?.unit?.unitConfig?.internalCode;
  const hasSyncScheduleMovements =
    user?.unit?.unitConfig?.syncScheduleMovements;

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
    configurationsSystem.type === "Vet"
      ? bill?.data?.patient?.id || patient?.data?.id
      : patient?.data?.id;

  const clientId = billId
    ? bill?.data?.client?.id
    : configurationsSystem.type === "Vet"
    ? patient.data?.tutor?.id
    : patientId;

  const initialData = {
    maxDiscount: false,
    clientId,
    internalCode,
    patientId,
    patientName: patient?.data?.name || bill?.data?.patient?.name,
    clientName:
      bill?.data?.client?.name ||
      patient?.data?.tutor?.name ||
      patient?.data?.name,
    cart: type === "edit" ? bill?.data?.products : [],
    sellerId: bill?.data?.seller?.id || user?.id,
    financialResponsibleId: bill?.data?.financialResponsible?.id,
  };

  async function handleSubmit(data, _, initialValues) {
    try {
      const formatItemsCart = formatCart(data.cart, initialData.cart);

      const payload = {
        ...data,
        billId: type === "edit" ? billId : null,
        originBillId: billId || null,
        cart: undefined,
        items: formatItemsCart,
        billDate: new Date().toISOString(),
        dailyMovementId: activeDailyMovement?.id,
      } as UpdateBill.Params;

      const response = await container
        .get<RemoteBills>(TypesAutomatiza.RemoteBills)
        [type === "edit" ? "update" : "create"](payload);

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

        return;
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

        return;
      }

      throw err
    }
  }

  return (
    <S.AddSale>
      <FormHandler
      debugMode
        isStickyButtons
        disableEnterKeySubmitForm
        button={{ text: "SALVAR" }}
        initialData={initialData}
        onSucess={handleSubmit}
        cleanFieldsOnSubmit={false}
      >
        {/* <h2 className="font-22-bold">
          {type === "edit" ? "Editar" : "Criar"} venda {bill?.data?.tag && " - " + bill?.data?.tag}
        </h2> */}

        <div className="row">
          <SelectBudgetClient tutors={tutors} hideCheckbox />

          {configurationsSystem.type === "Vet" ? (
            <SelectBudgetPatient tutors={tutors} />
          ) : (
            <>
              <SelectClient
                name="financialResponsibleId"
                label="Responsável financeiro"
              />

              {hasSyncScheduleMovements && <SelectSchedule />}
            </>
          )}

          {configurationsSystem.type === "Vet"  && (
            <SelectClient
              name="financialResponsibleId"
              label="Responsável financeiro"
            />
          )}

          {hasInternalCode && (
            <Input
              label="Código Interno"
              name="internalCode"
              disabled={!!internalCode}
            />
          )}
        </div>

        <div className="row">
          <SelectSeller />
          {process?.env?.client === "sancla" && hasSyncScheduleMovements && (
            <SelectSchedule />
          )}
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


