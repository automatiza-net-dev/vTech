import {
  Error,
  Input,
  Select,
  ViaCep,
  InputCep,
  useToast,
  InputMask,
  FormHandler,
  InputCpfCnpj,
  InputSwitch,
  ValidationError,
  BadRequestError,
} from "infinity-forge";
import moment from "moment";

import { RemoteTutor } from "@/data";
import {
  useLoadTutor,
  useConfigurationsSystem,
  useSystem,
  usePermission,
} from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

import { Pets } from "../pets";
import { InputPhoto } from "./input-photo";
import { Contacts, SelectOrigin, SelectProfession } from "../";
import { defineRequireFields } from "./utils/define-required-fields";

import { initialData } from "./initial-data";
import { SelectGender } from "./select-gender";
import { InputCorporateName } from "./input-corporate-name";

import { ICreateTutorFormProps } from "./interfaces";

import * as S from "./styles";
import { useState } from "react";
import { AxiosError } from "axios";

export function CreateTutorForm(props: ICreateTutorFormProps) {
  const { tutorId, origin = "Cadastro", setOpen, onSuccess } = props;

  const { unit } = useSystem();
  const { createToast } = useToast();
  const hasTag = usePermission("TUT04");
  const { type } = useConfigurationsSystem();
  const { data, isFetching, mutate } = useLoadTutor(tutorId);
  const [manualErrors, setManualErrors] = useState<Record<string, string>>({});

  defineRequireFields(origin, ["CEP*"]);

  if ((!data || isFetching) && tutorId) {
    return <></>;
  }

  // const isRegister = origin === "Cadastro";
  const isRegister = false;

  // const requiresDocument =
  //   (isRegister && unit?.configs?.businessUnits?.requires_client_document) ||
  //   isRegister;
  const requiresDocument = false;

  function objectToFormData(obj, form = new FormData(), namespace = "") {
    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined || value === null) continue;

      const formKey = namespace ? `${namespace}[${key}]` : key;

      if (value instanceof File) {
        form.append(formKey, value);
      } else if (Array.isArray(value)) {
        value.forEach((v, i) => {
          if (v instanceof File) {
            form.append(`${formKey}[${i}]`, v);
          } else if (typeof v === "object" && v !== null) {
            objectToFormData(v, form, `${formKey}[${i}]`);
          } else {
            form.append(`${formKey}[${i}]`, v);
          }
        });
      } else if (typeof value === "object") {
        objectToFormData(value, form, formKey);
      } else {
        // @ts-expect-error
        form.append(formKey, value);
      }
    }

    return form;
  }

  async function handleSuccess(formData) {
    const hasFile =
      formData?.photo &&
      Array.isArray(formData.photo) &&
      formData.photo[0]?.file instanceof File;

    const payload = {
      ...data,
      ...formData,
      origin: "Agenda", // origin === "Cadastro" && !tutorId ? "Agenda" : origin,
      photo:
        formData?.photo &&
        Array.isArray(formData?.photo) &&
        formData.photo.find((photo) => photo?.file)
          ? formData?.photo[0]?.file
          : undefined,
    };

    try {
      const response = await container
        .get<RemoteTutor>(TypesAutomatiza.RemoteTutor)
        [tutorId ? "update" : "create"](
          hasFile ? objectToFormData(payload) : payload,
        );

      createToast({
        status: "success",
        message: tutorId ? "Alterado com sucesso" : "Criado com sucesso",
      });

      tutorId && mutate();

      setOpen && setOpen(false);

      onSuccess && onSuccess(response);
    } catch (err) {
      if (err instanceof ValidationError) {
        setManualErrors(
          Object.keys(err.errors).reduce(
            (acc, curr) => {
              acc[curr] = err.errors[curr].errors.join(", ");
              return acc;
            },
            {} as Record<string, string>,
          ),
        );
      }

      if (err instanceof BadRequestError) {
        createToast({
          message: err.error.message ?? "Erro ao criar responsável",
          status: "warning",
        });
      }
    }
  }

  return (
    <Error name="CreateTutorForm">
      <S.CreateTutorForm>
        <FormHandler
          disableEnterKeySubmitForm
          isStickyButtons
          cleanFieldsOnSubmit={false}
          initialData={initialData({ data, tutorId })}
          button={{ text: "SALVAR" }}
          onSucess={async (successData) => {
            setManualErrors({});
            await handleSuccess(successData);
          }}
        >
          <h2 className="font-22-bold">
            {tutorId
              ? `Editar - ${data?.name}`
              : type === "Vet"
                ? "Novo Tutor"
                : "Novo Paciente"}
          </h2>
          <div className="row">
            <InputPhoto name="photo" isLocalFile multiple />

            <div>
              <div className="row">
                <InputCorporateName
                  errorMessage={
                    manualErrors["name"] || manualErrors["corporateName"]
                  }
                />

                <div>
                  <InputCpfCnpj
                    name="document"
                    label={requiresDocument ? "cpf/cnpj*" : "cpf/cnpj"}
                  />

                  {manualErrors["document"] && (
                    <p style={{ color: "red" }}>{manualErrors["document"]}</p>
                  )}
                </div>

                <div>
                  <InputMask
                    name="inscription"
                    label="RG"
                    mask="__.___.___-_"
                  />

                  {manualErrors["inscription"] && (
                    <p style={{ color: "red" }}>
                      {manualErrors["inscription"]}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    name="birthDate"
                    type="date"
                    label={
                      isRegister ? "Data de nascimento*" : "Data de nascimento"
                    }
                    max={moment().format("YYYY-MM-DD")}
                  />

                  {manualErrors["birthDate"] && (
                    <p style={{ color: "red" }}>{manualErrors["birthDate"]}</p>
                  )}
                </div>
              </div>

              <div className="row">
                <div>
                  <Input
                    name="name"
                    label="Nome Social / Nome Fantasia*"
                    required
                  />
                  {manualErrors["name"] && (
                    <p style={{ color: "red" }}>{manualErrors["name"]}</p>
                  )}
                </div>

                <SelectGender isRegister={isRegister} />

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
                <SelectProfession origin={origin} />

                <SelectOrigin errorMessage={manualErrors["clientOriginId"]} />
              </div>

              <div className="row">
                <Input name="tags" label="Tag / Observação" />

                {tutorId && (
                  <Input name="tag" label="Código" disabled={!hasTag} />
                )}

                {type !== "Vet" && (
                  <>
                    <InputSwitch label="Diabetes" name="diabetes" />

                    <InputSwitch label="Hipertensão" name="hypertension" />
                  </>
                )}

                {tutorId && (
                  <div className="row">
                    <InputSwitch name="active" label="Ativo" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <Contacts origin={origin} errors={manualErrors} />

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
                ibge: { label: "Cód*" },
              } as any,
              {
                bairro: { label: "Bairro*" },
                uf: { label: "Estado*" },
                localidade: { label: "Cidade*" },
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

          {type === "Vet" && tutorId && (
            <Pets tutor={data} {...props} handleSuccess={handleSuccess} />
          )}
        </FormHandler>
      </S.CreateTutorForm>
    </Error>
  );
}
