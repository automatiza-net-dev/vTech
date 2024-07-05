import { Dispatch, SetStateAction, useState } from "react";

import {
  Input,
  Modal,
  Button,
  Select,
  InputFile,
  InputSwitch,
  FormHandler,
  FileSystemType,
  useToast,
} from "infinity-forge";

import { Patient } from "@/domain";
import { RemotePatient } from "@/data";
import {
  FormCreateTutor,
  useLoadPatient,
  useVerifyPermissions,
} from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

import {
  Tutors,
  SelectRace,
  SelectHair,
  InputDeath,
  InputBirthday,
} from "./components";

import * as S from "./styles";

function Form({
  origin = "Cadastro",
  setOpen,
  patientId,
  onSuccess,
  initialDataForm = {},
}: {
  origin?: "Cadastro" | "Crm" | "Agenda";
  setOpen?: Dispatch<SetStateAction<boolean>>;
  onSuccess?: (data: any) => void;
  patientId?: Patient["id"];
  initialDataForm?: { [key: string]: any };
}) {
  const { data, refetch, isFetching } = useLoadPatient(patientId);

  const { createToast } = useToast();

  const initialData = data
    ? {
        ...data,
        birthDate: data.birth_date,
        death: String(data.death),
        castrated: String(data.castrated),
        holderId: data?.tutor?.id,
        deathDate: data.death_date,
        photo: [
          {
            id: 1,
            fileType: ".png",
            length: "0",
            title: data.photo,
            url: data.photo,
          },
        ] as FileSystemType[],
      }
    : { ...initialDataForm, birthDate: new Date() };

  if ((!data || isFetching) && patientId) {
    return <></>;
  }

  return (
    <S.Create>
      <FormHandler
        isStickyButtons
        initialData={initialData}
        button={{ text: "SALVAR" }}
        disableEnterKeySubmitForm
        onSucess={async (formData) => {
          const payload = {
            ...formData,
            origin,
            photo:
              formData?.photo &&
              Array.isArray(formData?.photo) &&
              formData.photo.find((photo) => photo?.file)
                ? formData?.photo[0]?.file
                : undefined,
          };

          await container
            .get<RemotePatient>(TypesAutomatiza.RemotePatient)
            [data ? "edit" : "create"](payload);

          patientId && (await refetch());

          createToast({
            status: "success",
            message: patientId ? "Alterado com sucesso" : "Criado com sucesso",
          });

          onSuccess && onSuccess(formData);

          setOpen && setOpen(false);

          // queryClient.invalidateQueries({
          //   queryKey: ["RemoteLoadAllPatientTutor", patientFilters],
          // });
          // queryClient.invalidateQueries({
          //   queryKey: ["RemoteLoadSchedulesPatients", patientFilters],
          // });
        }}
      >
        <h2 className="font-22-bold">
          {patientId ? `Editar - ${data?.name}` : "Novo Pet"}
        </h2>

        <div className="row-1">
          <div className="name">
            <Input name="name" label="Nome" />
          </div>

          <SelectRace />

          <Select
            label="Gênero"
            name="gender"
            options={[
              { label: "Fêmea", value: "female" },
              { value: "male", label: "Macho" },
            ]}
            onlyOneValue
          />

          <SelectHair />
        </div>

        <div className="row-2">
          <InputBirthday patientId={patientId} />

          <Select
            label="O paciente é vacinado?"
            name="vaccineOrigin"
            options={[
              {
                label: "Vacinado na própria clinica",
                value: "PROPRIA_CLINICA",
              },
              {
                label: "Vacinado fora da clinica",
                value: "FORA_DA_CLINICA",
              },
              {
                label: "Não vacinado / sem conhecimento",
                value: "NAO_VACINADO",
              },
            ]}
            onlyOneValue
          />

          <Select
            label="O paciente é castrado?"
            name="castrated"
            options={[
              {
                label: "Sim",
                value: "true",
              },
              {
                label: "Não",
                value: "false",
              },
            ]}
            onlyOneValue
          />

          <InputSwitch label="Comunidade Sanclá" name="community" />
        </div>

        <div className="row-3">
          {data && <InputDeath />}

          <Input name="tags" label="Tag" />

          <Input label="Microchip" name="microchip" />

          <div>{data && <InputSwitch label="Ativo" name="active" />}</div>
        </div>

        <div className="file">
          <InputFile label="Foto do pet" name="photo" isLocalFile />
        </div>

        <Tutors />
      </FormHandler>
    </S.Create>
  );
}

export function FormCreatePatient({
  origin,
  isModal,
  trigger,
  patientId,
  onSuccess,
  initialDataForm,
}: {
  origin?: "Cadastro" | "Crm" | "Agenda";
  isModal: boolean;
  onSuccess?: (data: any) => void;
  trigger?: JSX.Element;
  patientId?: Patient["id"];
  initialDataForm?: {
    holders?: { id: string; main: boolean }[];
  };
}) {
  const [open, setOpen] = useState(false);

  const canCreate = useVerifyPermissions(
    process.env.client === "sancla" ? "PET01" : "TUT01"
  );

  if (!canCreate) {
    return <></>;
  }

  if (process.env.client === "liftone") {
    return (
      <FormCreateTutor
        isModal={isModal}
        onSuccess={onSuccess}
        trigger={trigger}
        origin={origin}
        tutorId={patientId}
      />
    );
  }

  if (isModal) {
    return (
      <div>
        <Modal
          styles={{ maxWidth: "1450px", width: "calc(100% - 30px)" }}
          open={open}
          onClose={() => setOpen(false)}
        >
          <Form
            origin={origin}
            setOpen={setOpen}
            patientId={patientId}
            initialDataForm={initialDataForm}
            onSuccess={onSuccess}
          />
        </Modal>

        {trigger ? (
          <button
            style={{ background: "transparent", padding: "0", border: 0 }}
            type="button"
            onClick={() => setOpen(true)}
          >
            {trigger}
          </button>
        ) : (
          <Button
            text="Novo Paciente"
            type="button"
            onClick={() => setOpen(true)}
          />
        )}
      </div>
    );
  }

  return (
    <Form
      origin={origin}
      onSuccess={onSuccess}
      patientId={patientId}
      initialDataForm={initialDataForm}
    />
  );
}
