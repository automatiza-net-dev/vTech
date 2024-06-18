// @ts-nocheck
import { Form, Input, Modal, notification } from "antd";
import { petsService } from "@/OLD/services/patient.service";
import { patientContactsService } from "@/OLD/services/patientContacts.service";
import { useAuth } from "@/OLD/hooks/useAuth";
import { FormChild } from "@/OLD/components/Tutor/Create/FormChild";
import { memo, useState, useCallback } from "react";
import masks from "@/OLD/utils/masks";

import moment from "moment";

export const ModalCreateTutor = 

  ({
    refreshAutoComplete,
    setRefreshAutoComplete,
    isOpen,
    setIsOpen,
    setCreatedTutor = false,
    setRefreshTutors
  }) => {
    const [data, setData] = useState();
    const [photo, setPhoto] = useState();
    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState([{ main: false }]);

    const createContacts = useCallback(
      (tutorId) => {
        setLoading(true);
        patientContactsService.createContactsBatch({
          items: contacts.map((ctt) => ({
            ...ctt,
            patientId: tutorId,
            contact:
              ctt?.type !== "email"
                ? masks?.noPhone(ctt?.contact)
                : ctt?.contact
          }))
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

    const handleSubmit = useCallback(() => {
      if (!data?.clientOriginId) {
        return notification.warning({
          message: "Informe como conheceu a clinica"
        });
      }

      const message = verifyContacts();

      if (message) {
        setLoading(false);
        return notification.error({ message });
      }

      setLoading(true);
      petsService
        .createTutor({
          ...data,
          document: masks.noDocument(data?.document),
          photo: photo,
          birthDate: data?.birthDate
            ? moment(data?.birthDate).format("YYYY-MM-DD")
            : null
        })
        .then((res) => {
          if (setCreatedTutor) {
            setCreatedTutor((prv) => ({
              ...prv,
              holder: { id: res?.data?.id, name: res?.data?.name }
            }));
          }
          contacts[0]?.type && createContacts(res.data.id);
          setRefreshAutoComplete(!refreshAutoComplete);
          setIsOpen(false);
          setData(null);
          setPhoto(null);
          notification.success({
            message: "Sucesso",
            description: `${
              process.env.clientName === "LiftOne" ? "Cliente" : "Tutor"
            } cadastrado!`
          });
        })
        .catch((err) => {
          notification.error({
            message: "Erro",
            description: "Erro ao cadastrar tutor"
          });
        })
        .finally(() => {
          setLoading(false);
          setRefreshTutors((prv) => !prv);
        });
    }, [data, loading, photo, refreshAutoComplete, contacts]);

    return (
      <Modal
        title="Cadastrar tutor"
        visible={isOpen}
        onOk={() => document.getElementById("button-submit-modal").click()}
        onCancel={() => {
          setIsOpen(false);
        }}
        okText={"Cadastrar"}
        cancelText={"Cancelar"}
        loading={loading}
        width={"80%"}
      >
        <Form
          layout="vertical"
          onSubmitCapture={() => handleSubmit()}
          id="form-create-tutor"
        >
          <FormChild
            data={data}
            setData={setData}
            setPhoto={setPhoto}
            contacts={contacts}
            setContacts={setContacts}
          />
          <input
            style={{ display: "none" }}
            id="button-submit-modal"
            type="submit"
            htmlFor="form-create-tutor"
          />
        </Form>
      </Modal>
    );
  }

