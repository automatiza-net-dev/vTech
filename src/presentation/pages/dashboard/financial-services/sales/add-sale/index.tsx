import { Dispatch, SetStateAction } from "react";

import { Input, useToast, FormHandler, LoaderCircle } from "infinity-forge";

import {
  AddProduct,
  formatCart,
  useLoadPatient,
  useLoadAllPatientTutor,
  useLoadAllDailyMovements,
} from "@/presentation";
import { RemoteBills } from "@/data";
import { CreateBill } from "@/domain";
import { TypesAutomatiza, container } from "@/container";

import {
  ErrorSale,
  SelectClient,
  SelectPatient,
} from "./components";

import * as S from "./styles";

export function AddSale({
  budgetId,
  setModal,
}: {
  budgetId?: string;
  setModal?: Dispatch<SetStateAction<boolean>>;
}) {
  const patient = useLoadPatient();
  const dailyMovements = useLoadAllDailyMovements();
  const patientTutor = useLoadAllPatientTutor({ needFilterToCallApi: false });

  const { createToast } = useToast();

  const activeDailyMovement = dailyMovements.data?.find(
    (movement) => movement.status === "Aberto"
  );

  if (
    dailyMovements.isFetching ||
    patient.isFetching ||
    patientTutor.isFetching
  ) {
    return (
      <S.AddSale>
        <div className="loading">
          <LoaderCircle size={50} color="#000" />
        </div>
      </S.AddSale>
    );
  }

  if (!activeDailyMovement && !dailyMovements.isFetching) {
    return <ErrorSale />;
  }

  const patientId = patient?.data?.id;
  const clientId =
    process.env.client === "sancla" ? patient.data?.tutor?.id : patientId;

  const initialData = {
    clientId,
    patientId: process.env.client === "sancla" ? patientId : undefined,
  };

  return (
    <S.AddSale>
      <FormHandler
        debugMode
        button={{ text: "CRIAR VENDA" }}
        initialData={initialData}
        onSucess={async (data) => {
          const payload = {
            ...data,
            items: formatCart(data.cart),
            billDate:  new Date().toISOString(),
            budgetId,
            // financialResponsibleId: "",
            dailyMovementId: activeDailyMovement?.id,
          } as CreateBill.Params;

          await container
            .get<RemoteBills>(TypesAutomatiza.RemoteBills)
            .create(payload);

          createToast({
            status: "success",
            message: "Venda criada com sucesso",
          });

          setModal && setModal(false);
        }}
        cleanFieldsOnSubmit={false}
      >
        <h2 className="font-24-bold">Nova venda</h2>

        <div className="row">
          <SelectClient />

          {process.env.client === "sancla" && <SelectPatient />}
        </div>

        <div className="row">
          {/* <SelectSeller /> */}

          <Input label="Observação" name="additionalInformation" />
        </div>

        <AddProduct />
      </FormHandler>
    </S.AddSale>
  );
}
