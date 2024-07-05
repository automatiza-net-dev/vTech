import { Dispatch, SetStateAction } from "react";

import {
  Input,
  useToast,
  FormHandler,
  LoaderCircle,
  DatePickerInput,
} from "infinity-forge";
import moment from "moment";
import { useQueryClient } from "react-query";

import {
  AddProduct,
  formatCart,
  useLoadPatient,
  useLoadAllPatientTutor,
  useLoadAllDailyMovements,
  useDictionary,
} from "@/presentation";
import { Attendace, Budget } from "@/domain";
import { RemoteBudget } from "@/data";
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
  attendanceId,
  listCreated,
}: {
  attendanceId?: Attendace["id"];
  setModal?: Dispatch<SetStateAction<boolean>>;
  listCreated?: (id: Budget["id"]) => void | undefined;
}) {
  const patient = useLoadPatient();
  const dailyMovements = useLoadAllDailyMovements();
  const patientTutor = useLoadAllPatientTutor({ needFilterToCallApi: false });

  const {getWord} = useDictionary()
  const { createToast } = useToast();
  const queryClient = useQueryClient();

  const activeDailyMovement = dailyMovements.data?.find(
    (movement) => movement.status === "Aberto"
  );

  const isFetching = dailyMovements.isFetching || patientTutor.isFetching;

  if (isFetching) {
    return (
      <S.AddBudget>
        <div className="loading">
          <LoaderCircle size={50} color="#000" />
        </div>
      </S.AddBudget>
    );
  }

  if (!activeDailyMovement && !isFetching) {
    return <ErrorBudget />;
  }

  const patientId = patient?.data?.id;
  const clientId =
    process.env.client === "sancla" ? patient.data?.tutor?.id : patientId;

  const initialData = {
    clientId,
    patientId: process.env.client === "sancla" ? patientId : undefined,
    expirationDate: moment(new Date()).add({ day: 1 }).toDate(),
    clientName: patientId
      ? patientTutor.data?.find((tutor) => tutor.id === clientId)?.name
      : undefined,
  };

  return (
    <S.AddBudget>
      <FormHandler
        isStickyButtons
        disableEnterKeySubmitForm
        debugMode
        button={{ text: `CRIAR ${getWord("Orçamento")}` }}
        initialData={initialData}
        onSucess={async (data) => {
          const verifyClientExist = patientTutor.data?.find(
            (tutor) => tutor.id === data.clientId
          );

          const payload = {
            ...data,
            clientId: verifyClientExist ? data.clientId : "",
            clientName:
              data.clientName || verifyClientExist ? "" : data.clientId,
            attendanceId,
            items: formatCart(data.cart),
            budgetDate: new Date().toISOString(),
            dailyMovementId: activeDailyMovement?.id,
            expirationDate: moment(data.expirationDate).format("YYYY-MM-DD"),
          };

          const response = await container
            .get<RemoteBudget>(TypesAutomatiza.RemoteBudget)
            .create(payload);

          listCreated && listCreated(response.id);

          createToast({
            status: "success",
            message: `${getWord("Orçamento")} criado com sucesso`,
          });

          patientId &&
            queryClient.invalidateQueries({
              queryKey: ["LastUpdates", patientId],
            });

          setModal && setModal(false);
        }}
        cleanFieldsOnSubmit={false}
      >
        <div className="content_form">
          <h2 className="font-24-bold">Novo {getWord("Orçamento")}</h2>

          <div className="row">
            <div className="expirationDate">
              <DatePickerInput
                label="Data da Expiração"
                hasIcon
                name="expirationDate"
                typePicker="normal"
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
    </S.AddBudget>
  );
}
