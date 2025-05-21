import {
  Input,
  useToast,
  FormHandler,
  LoaderCircle,
  InputDatePicker,
  BadRequestError,
  useAuthAdmin,
  useQueryClient,
} from "infinity-forge";
import moment from "moment";

import {
  AddProduct,
  formatCart,
  SelectSeller,
  useDictionary,
  useLoadBudget,
  ErrorDailyBox,
  useLoadPatient,
  SelectSchedule,
  useLoadAllPatientTutor,
  useLoadAllDailyMovements,
  useConfigurationsSystem,
  useSystem,
} from "@/presentation";
import { RemoteBudget } from "@/data";
import { SelectBudgetClient, SelectBudgetPatient } from "./components";
import { TypesAutomatiza, container } from "@/container";

import { DeleteCartItems } from "../../utils/delete-cart-items";

import { IAddBudgetProps } from "./interfaces";

import * as S from "./styles";

export function AddBudgetNew({
  setModal,
  budgetId,
  listCreated,
  attendanceId,
}: IAddBudgetProps) {
  const patient = useLoadPatient();
  const budgetDetail = useLoadBudget({ id: budgetId || "" });
  const dailyMovements = useLoadAllDailyMovements();
  const patientTutors = useLoadAllPatientTutor({
    enabled: !patient?.data,
  })?.data;
  const tutors = patientTutors;

  const { getWord } = useDictionary();
  const { createToast } = useToast();
  const refetch = useQueryClient(st => st.refetch);
  const { user } = useAuthAdmin();
  const { type } = useConfigurationsSystem();

  const {unit} = useSystem()

  const userIsReviewer = unit?.configs?.businessUnits?.reviewer !== "N";

  const hasInternalCode = unit?.configs?.businessUnits?.internal_code;
  const hasSyncScheduleMovements = unit?.configs?.schedules?.syncScheduleMovements;

  const activeDailyMovement = dailyMovements.data?.find(
    (movement) => movement.status === "Aberto"
  );

  const isFetching =
    dailyMovements.isFetching ||
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
    return <ErrorDailyBox />;
  }

  if (!tutors && !patient) {
    return <></>;
  }

  const patientId =
    type === "Vet"
      ? budgetDetail?.data?.patient?.id || patient?.data?.id
      : undefined;

  const clientId = budgetId
    ? budgetDetail?.data?.client?.id
    : type === "Vet"
    ? patient.data?.tutor?.id
    : patient?.data?.id;

  const expirationDate = budgetId
    ? moment(budgetDetail.data.expiration_date).toDate()
    : moment(new Date()).add({ day: 1 }).toDate();

  const initialData = {
    internalCode: budgetDetail?.data?.internalCode,
    clientId,
    patientId,
    patientName: patient?.data?.name || budgetDetail?.data?.patient?.name,
    expirationDate,
    maxDiscount: false,
    clientName:
      budgetDetail?.data?.client?.name ||
      budgetDetail?.data?.client_name ||
      tutors?.find((tutor) => tutor.id === clientId)?.name ||
      patient?.data?.tutor?.name ||
      patient?.data?.name,
    cart: budgetDetail?.data?.items || [],
    sellerId: budgetDetail?.data?.seller?.id || user?.id,
    reviewerId: budgetDetail?.data?.reviewer?.id || user?.id,
    observation: budgetDetail?.data?.observation,
    internalObservation: budgetDetail?.data?.internalObservation,
  };

  async function handleSubmit(data, _, initialValues) {
    try {
      const formatItemsCart = formatCart(data.cart, initialData.cart);
      if (
        (data?.clientName === "" || !data?.clientName) &&
        (data?.clientId === "" || !data?.clientId)
      ) {
        return createToast({
          message: "Campo cliente obrigatório",
          status: "error",
        });
      }

      if (
        unit?.configs?.businessUnits?.reviewer === "O" &&
        (data?.reviewerId === "" || !data?.reviewerId)
      ) {
        return createToast({
          message: "Campo avaliador obrigatório",
          status: "error",
        });
      }

      const payload = {
        ...data,
        id: budgetId,
        attendanceId,
        items: formatItemsCart,
        budgetDate: new Date().toISOString(),
        dailyMovementId: activeDailyMovement?.id,
        expirationDate: moment(data.expirationDate).format("YYYY-MM-DD"),
      };

      const response = await container
        .get<RemoteBudget>(TypesAutomatiza.RemoteBudget)
        [budgetId ? "update" : "create"](payload);

      await DeleteCartItems(initialValues?.cart, data.cart);

      listCreated && listCreated(response.id);

      createToast({
        status: "success",
        message: `${getWord("Orçamento")} ${
          budgetId ? "atualizado" : "criado"
        } com sucesso`,
      });

      patientId && refetch(["LastUpdates", patientId].toString())
    
      setModal && setModal(false);
    } catch (err) {
      if (
        err instanceof BadRequestError &&
        err?.error?.message === "Desconto máximo foi excedido"
      ) {
        if (
          window.confirm(
            `Desconto máximo foi excedido, O orçamento possui itens com desconto acima do permitido, deseja gravar e enviar o orçamento para aprovação ?`
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
    <S.AddBudget id="add_budget_new">
      <FormHandler
        isStickyButtons
        disableEnterKeySubmitForm
        button={{ text: `Salvar` }}
        initialData={initialData}
        onSucess={handleSubmit}
        cleanFieldsOnSubmit={false}
      >
        <div className="content_form">
          {/* <h2 className="font-24-bold">
            {budgetId ? "Atualizar" : "Criar"} {getWord("Orçamento")}
          </h2> */}

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

            <SelectBudgetClient tutors={tutors} />

            {type === "Vet" && <SelectBudgetPatient tutors={tutors} />}

            <SelectSeller userIsReviewer={userIsReviewer} />

            {hasInternalCode && (
              <Input
                name="internalCode"
                label="Código interno"
                disabled={!!budgetDetail?.data?.internalCode}
              />
            )}
          </div>

          <div className="row">
            {hasSyncScheduleMovements && <SelectSchedule />}

            <Input label="Observação" name="observation" />

            <Input label="Observação interna" name="internalObservation" />
          </div>
        </div>

        <AddProduct />
      </FormHandler>
    </S.AddBudget>
  );
}
