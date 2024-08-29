import { Dispatch, SetStateAction, useState } from "react";

import {
  Input,
  Modal,
  useToast,
  FormHandler,
  LoaderCircle,
  InputDatePicker,
} from "infinity-forge";
import moment from "moment";
import { useQueryClient } from "react-query";

import {
  AddProduct,
  formatCart,
  useDictionary,
  useLoadPatient,
  useLoadAllPatientTutor,
  useLoadAllDailyMovements,
  useLoadBudget,
} from "@/presentation";
import { RemoteBudget } from "@/data";
import { Attendace, Budget } from "@/domain";
import { DiscountConfirmation } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

import {
  ErrorBudget,
  SelectSeller,
  SelectClient,
  SelectPatient,
} from "./components";

import * as S from "./styles";

export function AddBudgetNew({
  setModal,
  budgetId,
  listCreated,
  attendanceId,
}: {
  budgetId?: Budget["id"];
  attendanceId?: Attendace["id"];
  setModal?: Dispatch<SetStateAction<boolean>>;
  listCreated?: (id: Budget["id"]) => void | undefined;
}) {
  const [storeData, setStoreData] = useState({});
  const [discountConfirmVisible, setDiscountConfirmVisible] =
    useState<boolean>(false);

  const patient = useLoadPatient();
  const budgetDetail = useLoadBudget({ id: budgetId || "" });
  const dailyMovements = useLoadAllDailyMovements();
  const patientTutor = useLoadAllPatientTutor({ needFilterToCallApi: false });

  const { getWord } = useDictionary();
  const { createToast } = useToast();
  const queryClient = useQueryClient();

  const activeDailyMovement = dailyMovements.data?.find(
    (movement) => movement.status === "Aberto"
  );

  const isFetching =
    dailyMovements.isFetching ||
    patientTutor.isFetching ||
    (budgetId && (budgetDetail.isFetching || !budgetDetail.data));

  if (isFetching) {
    return (
      <S.AddBudget>
        <div className="loading">
          <LoaderCircle size={50} color="#000" />
        </div>
      </S.AddBudget>
    );
  }

  if ((!activeDailyMovement && !isFetching) || budgetDetail.error) {
    return <ErrorBudget />;
  }

  const patientId =
    process.env.client === "sancla"
      ? budgetDetail?.data?.patient?.id || patient?.data?.id
      : undefined;
  const clientId = budgetId
    ? budgetDetail?.data?.client?.id
    : process.env.client === "sancla"
    ? patient.data?.tutor?.id
    : patient?.data?.id;
  const expirationDate = budgetId
    ? moment(budgetDetail.data.expiration_date).toDate()
    : moment(new Date()).add({ day: 1 }).toDate();

  const initialData = {
    clientId,
    patientId,
    expirationDate,
    maxDiscount: false,
    clientName:
      budgetDetail?.data?.client?.name ||
      patientTutor?.data?.find((tutor) => tutor.id === clientId)?.name,
    cart: budgetDetail?.data?.items,
    sellerId: budgetDetail?.data?.seller?.id,
    reviewerId: budgetDetail?.data?.reviewer?.id,
    observation: budgetDetail?.data?.observation,
    internalObservation: budgetDetail?.data?.internalObservation,
  };

  async function handleSubmit(data) {
    const verifyClientExist = patientTutor.data?.find(
      (tutor) => tutor.id === data.clientId
    );

    const payload = {
      ...data,
      id: budgetId,
      clientId: verifyClientExist ? data.clientId : "",
      clientName: data.clientName || verifyClientExist ? "" : data.clientId,
      attendanceId,
      items: formatCart(data.cart, data.maxDiscount),
      budgetDate: new Date().toISOString(),
      dailyMovementId: activeDailyMovement?.id,
      expirationDate: moment(data.expirationDate).format("YYYY-MM-DD"),
    };

    const response = await container
      .get<RemoteBudget>(TypesAutomatiza.RemoteBudget)
      [budgetId ? "update" : "create"](payload);

    listCreated && listCreated(response.id);

    createToast({
      status: "success",
      message: `${getWord("Orçamento")} ${
        budgetId ? "atualizado" : "criado"
      } com sucesso`,
    });

    patientId &&
      queryClient.invalidateQueries({
        queryKey: ["LastUpdates", patientId],
      });

    setModal && setModal(false);
  }

  return (
    <S.AddBudget>
      <FormHandler
        isStickyButtons
        disableEnterKeySubmitForm
        button={{ text: `Salvar` }}
        initialData={initialData}
        onSucess={async (data) => {
          try {
            await handleSubmit(data);
          } catch (response: any) {
            if (response?.error?.message === "Desconto máximo foi excedido") {
              setStoreData(data);
              setDiscountConfirmVisible(true);
            }
          }
        }}
        cleanFieldsOnSubmit={false}
      >
        <div className="content_form">
          <h2 className="font-24-bold">
            {budgetId ? "Atualizar" : "Criar"} {getWord("Orçamento")}
          </h2>

          <div className="row">
            <div className="expirationDate">
              <InputDatePicker
                label="Data da Expiração"
                name="expirationDate"
                mode="date"
                date={{}}
                language="pt"
              />
            </div>

            <SelectClient />

            {process.env.client === "sancla" && <SelectPatient />}
          </div>

          <SelectSeller />

          <div className="row">
            <Input label="Observação" name="observation" />

            <Input label="Observação interna" name="internalObservation" />
          </div>
        </div>

        <AddProduct />
      </FormHandler>

      <Modal
        open={discountConfirmVisible}
        onClose={() => setDiscountConfirmVisible(false)}
        children={
          <DiscountConfirmation
            onConfirm={() => handleSubmit({ ...storeData, maxDiscount: true })}
            onCancel={() => setDiscountConfirmVisible(false)}
            origin="Orçamento"
          />
        }
      />
    </S.AddBudget>
  );
}
