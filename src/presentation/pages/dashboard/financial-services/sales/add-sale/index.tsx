import { Dispatch, SetStateAction, useState } from "react";

import {
  Input,
  Modal,
  useToast,
  FormHandler,
  LoaderCircle,
  useAuthAdmin,
  BadRequestError,
  Select,
  api,
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
  useSystem,
} from "@/presentation";
import { RemoteBills } from "@/data";
import { Bill, UpdateBill } from "@/domain";
import { TypesAutomatiza, container } from "@/container";

import {
  SelectBudgetClient,
  SelectBudgetPatient,
} from "../../budget/add-budget/components";

import * as S from "./styles";
import { useQueryClient } from "@/presentation/use-query"
import { useQuery } from "@/presentation/use-query/use-query";

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
  const configurationsSystem = useConfigurationsSystem();

  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ["bill-related-types"],
    queryFn: async () => {
      const response = await api({
        url: "bill-related-types",
        method: "get",
        body: {
          active: true,
        },
      });

      return response as { id: string; description: string; active: boolean }[];
    },
  });

  const internalCode = bill?.data?.internalCode;

  const tutors = useLoadAllPatientTutor({
    enabled: !patient || !bill?.data?.patient,
  })?.data;

  const { createToast } = useToast();
  const { user } = useAuthAdmin();

  const { unit } = useSystem();

  const hasInternalCode = unit?.configs?.businessUnits?.internal_code;
  const hasRelatedBills = unit?.configs?.bills?.related_bills;

  const hasSyncScheduleMovements =
    unit?.configs?.schedules?.syncScheduleMovements;

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
    billRelatedTypeId: bill?.data?.billRelatedType?.id,
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
        billType: "V",
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

        await queryClient.refetch(["bills", true], { mode: "include" });

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

      throw err;
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

          {configurationsSystem.type === "Vet" && (
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

          {configurationsSystem?.type === "Vet" && hasSyncScheduleMovements && (
            <SelectSchedule />
          )}
          
          <Input label="Observação" name="additionalInformation" />

          {hasRelatedBills && billId && (
            <Select
              name="billRelatedTypeId"
              label="Tipo Venda Relacionada"
              onlyOneValue
              options={data?.map((item) => ({
                label: item.description,
                value: item?.id,
              }))}
            />
          )}
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
