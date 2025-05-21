import { Dispatch, SetStateAction, useState } from "react";

import {
  Input,
  Modal,
  Button,
  Select,
  useToast,
  FormHandler,
  InputSwitch,
  FileSystemType,
} from "infinity-forge";
import moment from "moment";

import {
  FormCreateTutor,
  isValidDate,
  useLoadPatient,
  useConfigurationsSystem,
  useVerifyPermissions,
  usePermission,
} from "@/presentation";
import { RemotePatient } from "@/data";
import { TypesAutomatiza, container } from "@/container";

import {
  Tutors,
  SelectRace,
  SelectHair,
  InputDeath,
  InputBirthday,
} from "./components";
import { InputPhoto } from "../../tutor/create/components/form/input-photo";

import { IFormCreatePatientProps } from "./interfaces";

import * as S from "./styles";

function Form({
  origin = "Cadastro",
  setOpen,
  patientId,
  onSuccess,
  initialDataForm = {},
}: Partial<IFormCreatePatientProps> & {
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const { data, mutate, isFetching } = useLoadPatient(patientId);

  const { createToast } = useToast();
  const hasTAG = usePermission("PET05");

  const initialData = data
    ? {
      ...data,
      birthDate: moment(data?.birth_date).add(1, "days").toDate(),
      death: String(data.death),
      castrated: String(data.castrated),
      holderId: data?.tutor?.id,
      deathDate: data?.deathDate ? new Date(data?.deathDate) : null,
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
    : { ...initialDataForm };

  if ((!data || isFetching) && patientId) {
    return <></>;
  }

  async function handleSubmit(formData) {
    const payload = {
      ...formData,
      origin,
      birthDate: !isValidDate(formData?.birthDate)
        ? undefined
        : formData?.birthDate,
      photo:
        formData?.photo &&
          Array.isArray(formData?.photo) &&
          formData.photo.find((photo) => photo?.file)
          ? formData?.photo[0]?.file
          : undefined,
    };

    if (payload?.castrated === "null") {
      delete payload?.castrated;
    }

    const response = await container
      .get<RemotePatient>(TypesAutomatiza.RemotePatient)
    [data ? "edit" : "create"](payload);

    patientId && (await mutate());

    onSuccess && (await onSuccess(response));

    createToast({
      status: "success",
      message: patientId ? "Alterado com sucesso" : "Criado com sucesso",
    });

    setOpen && setOpen(false);
  }

  const isRegister = origin === "Cadastro";
  const isSchedule = origin === "Agenda";

  return (
    <S.Create>
      <FormHandler
        isStickyButtons
        initialData={initialData}
        button={{ text: "SALVAR" }}
        disableEnterKeySubmitForm
        onSucess={handleSubmit}
      >
        <h2 className="font-22-bold">
          {patientId ? `Editar - ${data?.name} (RG: ${data?.tag})` : "Novo Pet"}
        </h2>

        <div className="row-main">
          <InputPhoto name="photo" isLocalFile multiple />

          <div>
            <div className="row">
              <Input name="name" label="Nome*" />

              <InputBirthday patientId={patientId} required={isRegister} />

             {data && <Input name="tag" label="RG" disabled={!hasTAG} />}
            </div>

            <div className="row">
              <SelectRace required={isSchedule || isRegister} />

              <Select
                label="Gênero"
                name="gender"
                options={[
                  { label: "Fêmea", value: "femea" },
                  { label: "Macho", value: "macho" },
                ]}
                onlyOneValue
              />

              <SelectHair />
            </div>

            <div className="row">
              <InputSwitch label="Comunidade Sanclá" name="community" />

              {data && <InputSwitch label="Ativo" name="active" />}
            </div>
          </div>
        </div>

        <div className="row">
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

          <Input label="Microchip" name="microchip" />

          <Input name="tags" label="Tag" />
        </div>

        {data && <InputDeath />}

        <Tutors origin={origin} />
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
  buttonText,
  initialDataForm,
}: IFormCreatePatientProps) {
  const [open, setOpen] = useState(false);

  const { type } = useConfigurationsSystem();

  const canCreate = useVerifyPermissions(
    type === "Vet" ? "PET01" : "TUT01"
  );

  if (!canCreate) {
    return <></>;
  }

  if (type !== "Vet") {
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
            text={buttonText || "Novo Paciente"}
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
