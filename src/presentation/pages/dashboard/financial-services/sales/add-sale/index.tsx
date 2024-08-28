import { Dispatch, SetStateAction, useState } from "react";

import {
  Input,
  useToast,
  FormHandler,
  LoaderCircle,
  Modal,
} from "infinity-forge";

import {
  AddProduct,
  formatCart,
  useLoadPatient,
  useLoadAllPatientTutor,
  useLoadAllDailyMovements,
} from "@/presentation";
import { RemoteBills } from "@/data";
import { CreateBill, Bill } from "@/domain";
import { TypesAutomatiza, container } from "@/container";

import { DiscountConfirmation } from "@/presentation";
import { ErrorSale, SelectClient, SelectPatient } from "./components";

import * as S from "./styles";

export function AddSale({
  budgetId,
  setModal,
  listCreated,
}: {
  budgetId?: string;
  setModal?: Dispatch<SetStateAction<boolean>>;
  listCreated: (id: Bill["id"]) => void | undefined;
}) {
  const [storeData, setStoreData] = useState({});
  const [discountConfirmVisible, setDiscountConfirmVisible] = useState<boolean>(false);

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
    maxDiscount: false,
  };

  const handleSubmit = async (data) => {
    const payload = {
      ...data,
      items: formatCart(data.cart, data?.maxDiscount),
      billDate: new Date().toISOString(),
      budgetId,
      // financialResponsibleId: "",
      dailyMovementId: activeDailyMovement?.id,
    } as CreateBill.Params;

    const response = await container
      .get<RemoteBills>(TypesAutomatiza.RemoteBills)
      .create(payload);

    listCreated && listCreated(response.id);

    createToast({
      status: "success",
      message: "Venda criada com sucesso",
    });

    setModal && setModal(false);
  };

  return (
    <S.AddSale>
      <FormHandler
        isStickyButtons
        disableEnterKeySubmitForm
        button={{ text: "CRIAR VENDA" }}
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
      <Modal
        open={discountConfirmVisible}
        onClose={() => setDiscountConfirmVisible(false)}
        children={
          <DiscountConfirmation
            onConfirm={() => handleSubmit({ ...storeData, maxDiscount: true })}
            onCancel={() => setDiscountConfirmVisible(false)}
            origin="Venda"
          />
        }
      />
    </S.AddSale>
  );
}
