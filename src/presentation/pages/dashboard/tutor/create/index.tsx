import { Dispatch, SetStateAction, useState } from "react";

import {
  Modal,
  Input,
  ViaCep,
  Button,
  Select,
  useToast,
  InputCep,
  InputFile,
  InputMask,
  InputSwitch,
  FormHandler,
  FileSystemType,
} from "infinity-forge";

import { RemoteTutor } from "@/data";
import { Contact, Tutor } from "@/domain";
import { useLoadTutor, useVerifyPermissions } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

import { Contacts, SelectOrigin, SelectProfession } from "./components";

import * as S from "./styles";
import moment from "moment";
import { useRouter } from "next/router";

function Form({
  tutorId,
  origin = "Cadastro",
  setOpen,
  onSuccess,
}: {
  origin?: "Cadastro" | "Crm" | "Agenda";
  tutorId?: Tutor["id"];
  onSuccess?: (data: any) => void;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const { data, isFetching, refetch } = useLoadTutor(tutorId);

  const { createToast } = useToast();

  if ((!data || isFetching) && tutorId) {
    return <></>;
  }

  const initialData = data
    ? {
        ...data,
        id: tutorId,
        photo: [
          {
            id: 1,
            fileType: ".png",
            length: "0",
            title: data?.photo,
            url: data?.photo,
          },
        ] as FileSystemType[],
      }
    : {
        origin: origin,
        address: {
          cep: "",
          logradouro: "",
          complemento: "",
          bairro: "",
          localidade: "",
          uf: "",
          ibge: "",
          gia: "",
          ddd: "",
          siafi: "",
        },
        contacts: [
          {
            contact: "",
            main: false,
            notGiven: false,
            observation: "",
            type: "email",
          },
          {
            contact: "",
            main: true,
            notGiven: false,
            observation: "",
            type: "celular",
          },
        ] as Contact[],
      };

  return (
    <S.Create>
      <FormHandler
        disableEnterKeySubmitForm
        debugMode
        isStickyButtons
        cleanFieldsOnSubmit
        initialData={initialData}
        button={{ text: "SALVAR" }}
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

          const response = await container
            .get<RemoteTutor>(TypesAutomatiza.RemoteTutor)
            [tutorId ? "update" : "create"](payload);

          createToast({
            status: "success",
            message: tutorId ? "Alterado com sucesso" : "Criado com sucesso",
          });

          tutorId && refetch();

          setOpen && setOpen(false);

          onSuccess && onSuccess(response);
        }}
      >
        <h2 className="font-22-bold">
          {tutorId
            ? `Editar - ${data?.name}`
            : process.env.client === "sancla"
            ? "Novo Tutor"
            : "Novo Paciente"}
        </h2>

        <div className="row-1">
          <Input name="name" label="Nome*" />

          <InputMask name="document" label="CPF*" mask="___.___.___-__" />

          <InputMask name="inscription" label="RG" mask="__.___.___-_" />

          <Input
            name="birthDate"
            type="date"
            label="Data de nascimento*"
            max={moment().format("YYYY-MM-DD")}
          />

          <Select
            label="Gênero*"
            name="gender"
            options={[
              { label: "Feminino", value: "female" },
              { value: "male", label: "Masculino" },
            ]}
            onlyOneValue
          />
        </div>

        <div className="row-2">
          <SelectProfession />

          <Select
            menuPlacement="bottom"
            label="Estado Civil"
            name="civilStatus"
            options={[
              { value: "Solteiro(a)", label: "Solteiro(a)" },
              { value: "Casado(a)", label: "Casado(a)" },
              { value: "Separado(a)", label: "Separado(a)" },
              { value: "Divorciado(a)", label: "Divorciado(a)" },
              { value: "Viuvo(a)", label: "Viuvo(a)" },
            ]}
            onlyOneValue
          />

          <Input name="nationality" label="Nacionalidade" />

          <SelectOrigin />

          <Input name="tags" label="Tag" />
        </div>

        {process.env.client === "liftone" && (
          <div className="row">
            <InputSwitch label="Diabetes" name="diabetes" />

            <InputSwitch label="Hipertensão" name="hypertension" />
          </div>
        )}

        <div className="file">
          <InputFile label="Imagem de perfil" name="photo" isLocalFile />

          {tutorId && (
            <div className="row">
              <InputSwitch name="active" label="Ativo" />
            </div>
          )}
        </div>

        <h3 className="font-18-bold" style={{ marginBottom: 15 }}>
          Endereço
        </h3>

        <InputCep<ViaCep>
          providerType="ibge"
          fields={[
            {
              logradouro: { label: "Rua" },
              number: { label: "Número" },
              complemento: { label: "Complemento" },
              ibge: { label: "Cód", readOnly: true },
            },
            {
              bairro: { label: "Bairro" },
              uf: { label: "Estado", readOnly: true },

              localidade: { label: "Cidade", readOnly: true },
              residence: {
                label: "Tipo de residência",
                Component: Select,
                onlyOneValue: true,
                options: [
                  { label: "Casa", value: "CASA" },
                  {
                    label: "Apartamento",
                    value: "APARTAMENTO",
                  },
                  { value: "CONDOMINIO", label: "Condominio" },
                  { value: "SITIO", label: "Sitio" },
                  { value: "COMERCIAL", label: "Comercial" },
                ],
              },
            },
          ]}
        />

        <Contacts />
      </FormHandler>
    </S.Create>
  );
}

export function FormCreateTutor({
  tutorId,
  origin,
  isModal = false,
  trigger,
  onSuccess,
}: {
  origin?: "Cadastro" | "Crm" | "Agenda";
  trigger?: JSX.Element;
  tutorId?: Tutor["id"];
  isModal: boolean;
  onSuccess?: (data: any) => void;
}) {
  const [open, setOpen] = useState(false);

  const canCreate = useVerifyPermissions("TUT01");

  const router = useRouter();

  const isCRM = router.asPath.includes("crm");

  if (!canCreate) {
    return <></>;
  }

  if (isModal) {
    return (
      <div style={{ width: "100%" }}>
        <Modal
          styles={{ maxWidth: "1450px", width: "calc(100% - 30px)" }}
          open={open}
          onClose={() => setOpen(false)}
        >
          <Form
            setOpen={setOpen}
            tutorId={tutorId}
            onSuccess={onSuccess}
            origin={isCRM ? "Crm" : origin}
          />
        </Modal>

        {trigger ? (
          <button
            style={{
              background: "transparent",
              padding: "0",
              border: 0,
              width: "100%",
            }}
            type="button"
            onClick={() => setOpen(true)}
          >
            {trigger}
          </button>
        ) : (
          <Button
            text={
              process.env.client === "sancla" ? "Novo Tutor" : "Novo Cliente"
            }
            type="button"
            onClick={() => setOpen(true)}
          />
        )}
      </div>
    );
  }

  return <Form tutorId={tutorId} onSuccess={onSuccess} origin={origin} />;
}
