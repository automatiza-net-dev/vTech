// @ts-nocheck
import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/router";

import { petsService } from "@/OLD/services/patient.service";
import { patientContactsService } from "@/OLD/services/patientContacts.service";

import { useAuth } from "@/OLD/hooks/useAuth";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Form } from "antd";
import { LoadingSpin } from "@/OLD/components/mini-components";
import { FormChild } from "../Edit/FormChild";
import { Container } from "./styles";
import AccessDenied from "@/OLD/components/AccessDenied";
import { Button, useToast } from "infinity-forge";

import masks from "@/OLD/utils/masks";
import moment from "moment";
import { useSystem } from "@/presentation";

export function CreateTutor({ setVisible, onSuccess, isSchedule = false }) {
  const [data, setData] = React.useState();
  const [photo, setPhoto] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [contacts, setContacts] = React.useState([]);

  const { originConfig, setOriginConfig } = useAuth();

  const createTutorPermission = useUserHasPermission("TUT01");

  const router = useRouter();
  const petId = router?.query?.innerpage;

  const { createToast } = useToast();

  const vincPet = useCallback(
    (id) => {
      setLoading(true);
      petsService
        .assignPatientToTutor({
          holder: id,
          patient: petId,
        })
        .then((_res) =>
          createToast({
            status: "success",
            message: "Pet vinculado com sucesso!",
          })
        )
        .catch((_err) => {
          createToast({
            status: "error",
            message: "Houve um problema ao vincular o pet ao tutor...",
          });

          setLoading(false);
        })
        .finally(() => setLoading(false));
    },
    [petId]
  );

  const createContacts = useCallback(
    (tutorId) => {
      setLoading(true);
      patientContactsService
        .createContactsBatch({
          items: contacts.map((ctt) => {
            if (ctt?.notGiven) {
              return {
                type: "email",
                contact: "-",
                main: false,
                patientId: tutorId,
                notGiven: true,
              };
            }
            return {
              ...ctt,
              patientId: tutorId,
              contact:
                ctt?.type !== "email"
                  ? masks?.noPhone(ctt?.contact)
                  : ctt?.contact,
            };
          }),
        })
        .then(() => {
          setVisible(false);
          onSuccess && onSuccess({ id: tutorId });
        });
    },
    [contacts]
  );

  const verifyContacts = () => {
    let message = false;

    contacts.map((ctt) => {
      if (ctt?.type === "celular" && ctt?.contact?.length !== 15) {
        message = "O Telefone precisa ter 11 digitos";
      }
      if (ctt?.type !== "email") {
        if (!ctt?.contact) {
          message = "Informe o dado para contato";
        }
      } else {
        if (!ctt?.notGiven) {
          if (!ctt?.contact) {
            message = "Informe o dado para contato";
          }
        }
      }

      if (!ctt?.type) {
        message = "Informe o tipo de contato";
      }
    });

    return message;
  };

  const {unit} = useSystem()

  const handleSubmit = useCallback(() => {
    setLoading(true);

    if (!data?.name) {
      setLoading(false);
      return createToast({ status: "error", message: "Informe o seu nome" });
    }

    if (!isSchedule) {
      if (!data?.birthDate) {
        setLoading(false);
        return createToast({
          status: "error",
          message: "Informe a sua data de nascimento",
        });
      }

      if (!data?.gender) {
        setLoading(false);
        return createToast({
          status: "error",
          message: "Informe o seu gênero",
        });
      }
    }

    if (unit.system.type === "Vet" && !data?.professionId && !isSchedule) {
      setLoading(false);
      return createToast({
        status: "error",
        message: "Selecione uma profissão",
      });
    }

    if (!data?.clientOriginId) {
      setLoading(false);
      return createToast({
        status: "error",
        message: "Informe como conheceu a clinica",
      });
    }

    const message = verifyContacts();

    if (message) {
      setLoading(false);
      return createToast({ status: "error", message: message });
    }

    if (!isSchedule) {
      if (!data?.postalCode) {
        setLoading(false);
        return createToast({ status: "error", message: "Informe o seu CEP" });
      }

      if (!data?.street) {
        setLoading(false);
        return createToast({ status: "error", message: "Informe a sua rua" });
      }

      if (!data?.number) {
        setLoading(false);
        return createToast({
          status: "error",
          message: "Informe o número da residência",
        });
      }

      if (!data?.district) {
        setLoading(false);
        return createToast({
          status: "error",
          message: "Informe o seu bairro",
        });
      }

      if (!data?.state) {
        setLoading(false);
        return createToast({
          status: "error",
          message: "Informe o seu estado",
        });
      }

      if (!data?.city) {
        setLoading(false);
        return createToast({
          status: "error",
          message: "Informe a sua cidade",
        });
      }

      if (!data?.residence) {
        setLoading(false);
        return createToast({
          status: "error",
          message: "Informe o seu tipo de residência",
        });
      }
    }

    delete data?.proDescription;

    petsService
      .createTutor({
        ...data,
        document: masks?.noDocument(data?.document),
        photo: photo,
        birthDate: moment(data?.birthDate).format("YYYY-MM-DD"),
        origin: originConfig,
      })
      .then((res) => {
        setOriginConfig("");
        onSuccess && onSuccess(res.data);
        if (unit.system.type !== "Vet") {
          createToast({ status: "success", message: "Cliente cadastrado!" });
        } else {
          createToast({
            status: "success",
            message: `${
              unit.system.type !== "Vet" ? "Cliente" : "Tutor"
            } cadastrado!`,
          });
        }

        createContacts(res.data.id);
        petId && vincPet(res.data.id);
      })
      .catch((err) => {
        if (err?.response?.data?.code === "E_DOCUMENT_ALREADY_REGISTERED") {
          return createToast({
            status: "error",
            message: "Documento já cadastrado",
          });
        }

        if (err?.response?.data?.code === "E_INVALID_DOCUMENT") {
          return createToast({
            status: "error",
            message: "Verifique o cpf informado",
          });
        }

        return createToast({
          status: "error",
          message: "Erro ao cadastrar tutor",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [data, loading, photo, router, contacts]);

  useEffect(() => {
    if (!isSchedule) {
      setContacts([
        { type: "celular", main: true },
        { type: "email", main: false },
      ]);
    }
    if (isSchedule) {
      setContacts([
        { type: "celular", main: true },
        { type: "email", main: false },
      ]);
    }
  }, [isSchedule]);

  return !createTutorPermission || createTutorPermission === "loading" ? (
    <AccessDenied loading={createTutorPermission} />
  ) : (
    <Container>
      <h2>
        {unit.system.type !== "Vet"
          ? "Cadastrar novo cliente"
          : "Cadastrar novo tutor"}
      </h2>

      <Form
        layout="vertical"
        onSubmitCapture={() => {
          handleSubmit();
        }}
      >
        <FormChild
          data={data}
          setData={setData}
          setPhoto={setPhoto}
          contacts={contacts}
          setContacts={setContacts}
          isSchedule={isSchedule}
        />
        <hr />
        <footer className="uk-flex uk-flex-right">
          <Button onClick={() => setVisible(false)} text="Voltar" />
          <Button
            type="submit"
            text={loading ? "Carregando..." : "Cadastrar"}
          />
        </footer>
      </Form>
    </Container>
  );
}
