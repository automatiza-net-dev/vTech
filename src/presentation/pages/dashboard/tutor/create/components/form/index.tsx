import {
  Error,
  Input,
  Select,
  ViaCep,
  InputCep,
  useToast,
  InputMask,
  FormHandler,
  InputSwitch,
} from "infinity-forge";
import moment from "moment";

import { RemoteTutor } from "@/data";
import { useLoadTutor, useMe } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

import { Pets } from "../pets";
import { InputPhoto } from "./input-photo";
import { Contacts, SelectOrigin, SelectProfession } from "../";
import { defineRequireFields } from "./utils/define-required-fields";

import { initialData } from "./initial-data";
import { ICreateTutorFormProps } from "./interfaces";

import * as S from "./styles";

export function CreateTutorForm(props: ICreateTutorFormProps) {
  const { tutorId, origin = "Cadastro", setOpen, onSuccess } = props;
  const unitConfig = useMe()?.data?.unit?.unitConfig;

  const { data, isFetching, mutate } = useLoadTutor(tutorId);

  const { createToast } = useToast();

  defineRequireFields(origin, ["CEP*"]);

  if ((!data || isFetching) && tutorId) {
    return <></>;
  }

  const isRegister = origin === "Cadastro";
  const requiresDocument = isRegister
    ? unitConfig?.requires_client_document
      ? true
      : false
    : false;

  async function handleSuccess(data) {
    const payload = {
      ...data,
      origin,
      photo:
        data?.photo &&
        Array.isArray(data?.photo) &&
        data.photo.find((photo) => photo?.file)
          ? data?.photo[0]?.file
          : undefined,
    };

    const response = await container
      .get<RemoteTutor>(TypesAutomatiza.RemoteTutor)
      [tutorId ? "update" : "create"](payload);

    createToast({
      status: "success",
      message: tutorId ? "Alterado com sucesso" : "Criado com sucesso",
    });

    tutorId && mutate();

    setOpen && setOpen(false);

    onSuccess && onSuccess(response);
  }

  return (
    <Error name="CreateTutorForm">
      <S.CreateTutorForm>
        <FormHandler
          disableEnterKeySubmitForm
          isStickyButtons
          cleanFieldsOnSubmit
          initialData={initialData({ data, tutorId })}
          button={{ text: "SALVAR" }}
          onSucess={handleSuccess}
        >
          <h2 className="font-22-bold">
            {tutorId
              ? `Editar - ${data?.name}`
              : process.env.client === "sancla"
              ? "Novo Tutor"
              : "Novo Paciente"}
          </h2>
          <div className="row">
            <InputPhoto name="photo" isLocalFile multiple />

            <div>
              <div className="row">
                <Input name="name" label="Nome*" />

                <InputMask
                  name="document"
                  label={requiresDocument ? "CPF*" : "CPF"}
                  mask="___.___.___-__"
                />

                <InputMask name="inscription" label="RG" mask="__.___.___-_" />

                <Input
                  name="birthDate"
                  type="date"
                  label={
                    isRegister ? "Data de nascimento" : "Data de nascimento"
                  }
                  max={moment().format("YYYY-MM-DD")}
                />
              </div>

              <div className="row">
                <SelectProfession origin={origin} />

                <Select
                  label={isRegister ? "Gênero*" : "Gênero"}
                  name="gender"
                  options={[
                    { label: "Feminino", value: "female" },
                    { value: "male", label: "Masculino" },
                  ]}
                  onlyOneValue
                />

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
              </div>

              <div className="row">
                <SelectOrigin />

                <Input name="tags" label="Tag" />
              </div>
            </div>
          </div>

          {process.env.client === "liftone" && (
            <>
              <InputSwitch label="Diabetes" name="diabetes" />

              <InputSwitch label="Hipertensão" name="hypertension" />
            </>
          )}

          <div className="file">
            {tutorId && (
              <div className="row">
                <InputSwitch name="active" label="Ativo" />
              </div>
            )}
          </div>

          <Contacts origin={origin} />

          <h3 className="font-18-bold" style={{ marginBottom: 15 }}>
            Endereço
          </h3>

          <InputCep<ViaCep>
            showAllFields
            providerType="ibge"
            fields={[
              {
                logradouro: { label: "Rua*" },
                number: { label: "Número*" },
                complemento: { label: "Complemento" },
                ibge: { label: "Cód*", readOnly: true },
              },
              {
                bairro: { label: "Bairro*" },
                uf: { label: "Estado*", readOnly: true },
                localidade: { label: "Cidade*", readOnly: true },
                residence: {
                  label: "Tipo de residência*",
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

          <Pets tutor={data} {...props} handleSuccess={handleSuccess} />
        </FormHandler>
      </S.CreateTutorForm>
    </Error>
  );
}
