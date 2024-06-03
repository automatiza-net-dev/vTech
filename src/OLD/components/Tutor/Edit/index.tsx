import React, {useCallback, useEffect, useState } from "react";

import { Form, notification } from "antd";
import { Button, LoadingSpin } from "@/OLD/components/mini-components";
// import { useRouter } from "next/router";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { petsService } from "@/OLD/services/patient.service";
import { patientContactsService } from "@/OLD/services/patientContacts.service";
import { FormChild } from "../Edit/FormChild";
import { Container } from "./styles";
import AccessDenied from "@/OLD/components/AccessDenied";

import { useAuth } from "@/OLD/hooks/useAuth";

import masks from "@/OLD/utils/masks";
import moment from "moment";

export function Edit({
  tutorId,
  setVisible,
}: {
  tutorId: string;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = React.useState();
  const [contacts, setContacts] = React.useState<any[]>([{}]);

  const { originConfig, setOriginConfig } = useAuth();

  
  const editTutorPermission = useUserHasPermission("TUT02");

  const verifyErrors = (errMsg) => {
    if (errMsg === "E_DOCUMENT_ALREADY_REGISTERED") {
      return notification.warning({ message: "Documento já cadastrado" });
    }

    if (errMsg === "E_INVALID_DOCUMENT") {
      return notification.warning({
        message: "Cpf inválido, verifique o cpf informado",
      });
    }

    notification.error({
      message: "Erro",
      description: `Erro ao editar ${
        process.env.client === "LiftOne" ? "Cliente" : "Tutor"
      }`,
    });
  };

  const updateContacts = useCallback(
    (cb) => {
      setLoading(true);

      const contactsToUpdate = contacts.filter((ctt) => ctt?.id);
      const contactsToCreate = contacts.filter((ctt) => !ctt?.id);

      patientContactsService.updateContactsBatch({
        items: contactsToUpdate.map(
          ({ id, main, observation, type, active, contact, notGiven }: any) => {
            if (notGiven) {
              return {
                id,
                contact: "-",
                notGiven: true,
                main,
                active,
                type,
              };
            }
            return {
              id,
              main,
              observation,
              type,
              active,
              contact: type !== "email" ? masks?.noPhone(contact) : contact,
              notGiven: false,
            };
          }
        ),
      });

      patientContactsService
        .createContactsBatch({
          items: contactsToCreate.map((ctt) => {
            if (ctt?.notGiven) {
              return {
                type: "email",
                contact: "-",
                main: false,
                patientId: data?.id,
                notGiven: true,
              };
            }
            return {
              ...ctt,
              notGiven: false,
              patientId: data?.id,
              contact:
                ctt?.type !== "email"
                  ? masks?.noPhone(ctt?.contact)
                  : ctt?.contact,
            };
          }),
        })
        .then(() => cb());
    },
    [contacts]
  );

  const verifyContacts = () => {
    let message: any = false;

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

  const handleSubmit = useCallback(() => {
    if (originConfig === "Crm") {
      if (!data?.name) {
        setLoading(false);
        return notification.warning({
          message: "Informe o seu nome",
        });
      }

      if (!data?.clientOriginId) {
        setLoading(false);
        return notification.warning({
          message: "Informe como conheceu a clinica",
        });
      }

      const message = verifyContacts();

      if (message) {
        setLoading(false);
        return notification.error({ message });
      }
    }

    if (originConfig === "") {
      if (!data?.document) {
        setLoading(false);
        return notification.warning({
          message: "Informe o seu CPF",
        });
      }

      if (!data?.birthDate) {
        setLoading(false);
        return notification.warning({
          message: "Informe a sua data de nascimento",
        });
      }

      if (!data?.gender) {
        setLoading(false);
        return notification.warning({
          message: "Informe o seu gênero",
        });
      }

      if (!data?.postalCode) {
        setLoading(false);
        return notification.warning({
          message: "Informe o seu CEP",
        });
      }

      if (!data?.street) {
        setLoading(false);
        return notification.warning({
          message: "Informe a sua rua",
        });
      }

      if (!data?.number) {
        setLoading(false);
        return notification.warning({
          message: "Informe o número da residência",
        });
      }

      if (!data?.district) {
        setLoading(false);
        return notification.warning({
          message: "Informe o seu bairro",
        });
      }

      if (!data?.state) {
        setLoading(false);
        return notification.warning({
          message: "Informe o seu estado",
        });
      }

      if (!data?.city) {
        setLoading(false);
        return notification.warning({
          message: "Informe a sua cidade",
        });
      }

      if (!data?.residence) {
        setLoading(false);
        return notification.warning({
          message: "Informe o seu tipo de residência",
        });
      }

      if (!data?.name) {
        setLoading(false);
        return notification.warning({
          message: "Informe o seu nome",
        });
      }

      if (!data?.clientOriginId) {
        setLoading(false);
        return notification.warning({
          message: "Informe como conheceu a clinica",
        });
      }

      const message = verifyContacts();

      if (message) {
        setLoading(false);
        return notification.error({ message });
      }
    }

    setLoading(true);
    petsService
      .editTutor(
        {
          ...data,
          document: masks?.noDocument(data?.document),
          photo: photo,
          birthDate: moment(data?.birthDate).format("YYYY-MM-DD"),
          origin: originConfig,
        },
        tutorId
      )
      .then((res) => {
        setOriginConfig("");
        updateContacts(() => setVisible(false));
        return notification.success({
          message: "Sucesso",
          description: `${
            process.env.client === "liftone" ? "Cliente" : "Tutor"
          } editado!`,
        });
      })
      .catch((err) => {
        return verifyErrors(err?.response?.data?.code);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [data, photo, updateContacts, tutorId]);

  const handleGetSingleTutor = useCallback(() => {
    setLoading(true);
    petsService
      .getSingleTutor(tutorId)
      .then((res) => {
        setContacts(
          res?.data?.contacts?.map((ctt) => {
            if (ctt?.type === "email" && ctt?.contact === "-") {
              return { ...ctt, notGiven: true, contact: "" };
            } else {
              if (ctt?.type !== "email") {
                return { ...ctt, contact: masks?.phone(ctt?.contact) };
              }
              return ctt;
            }
          })
        );
        setData({
          ...res.data,
          birthDate: res?.data?.birth_date
            ? moment(res?.data?.birth_date, "YYYY-MM-DD[T]HH:mm:ss")
            : null,
          document:
            res?.data?.tutor?.document &&
            masks?.cpf(res?.data?.tutor?.document),
          postalCode: res?.data?.tutor?.postal_code,
          street: res?.data?.tutor?.street,
          number: res?.data?.tutor?.number,
          complement: res?.data?.tutor?.complement,
          district: res?.data?.tutor?.district,
          city: res?.data?.tutor?.city,
          state: res?.data?.tutor?.state,
          clientOriginId: res?.data?.tutor?.clientOrigin?.id,
          residence: res?.data?.tutor?.residence,
          hypertension: res?.data?.hypertension,
          diabetes: res?.data?.diabetes,
          inscription: res?.data?.tutor?.inscription,
          nationality: res.data?.tutor?.nationality,
          civilStatus: res?.data?.tutor?.civil_status,
          professionId: res.data?.tutor?.profession?.id,
          profDescription: res.data?.tutor?.profession?.description,
          cityCode: res?.data?.tutor?.city_code,
          clientOriginItemDescription: res.data?.client_origin_item_description,
        });
      })
      .catch((err) => {
        notification.error({
          message: "Erro",
          description: "Erro ao buscar tutor",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tutorId]);

  useEffect(() => {
    handleGetSingleTutor();
  }, [handleGetSingleTutor]);

  return !editTutorPermission || editTutorPermission === "loading" ? (
    <AccessDenied loading={editTutorPermission} />
  ) : (
    <Container>
      <h2> {process.env.client === "liftone" ? "Editar cliente" : "Editar Tutor"}</h2>

      <Form
        layout="vertical"
        onSubmitCapture={() => {
          if (!data?.clientOriginId) {
            return notification.warning({
              message: "Informe como conheceu a clinica",
            });
          }

          handleSubmit();
        }}
      >
        <FormChild
          data={data}
          setData={setData}
          setPhoto={setPhoto}
          photo={photo}
          contacts={contacts}
          setContacts={setContacts}
        />
        <hr />
        <footer className="uk-flex uk-flex-right">
          <Button type="submit" classCallback="uk-margin-right">
            {loading ? <LoadingSpin /> : "Salvar"}
          </Button>
          <Button onClick={() => setVisible(false)}>Voltar</Button>
        </footer>
      </Form>
    </Container>
  );
}
