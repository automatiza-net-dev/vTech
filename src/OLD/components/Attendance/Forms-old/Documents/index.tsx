// @ts-nocheck
// Core
import React, { useState, memo, useEffect, useCallback } from "react";

// Services
import { documentServices } from "@/OLD/services/document.service";
import { timelineService } from "@/OLD/services/timeline.service";
import { textReplaceService } from "@/OLD/services/textReplace.service";

// Hooks
import { useProfile } from "@/OLD/hooks/useProfile";

// Components
import { Modal, notification } from "antd";
import FormChild from "./FormChild";

// utils
import moment from "moment";

const Documents = memo(function Documents({
  visible,
  setVisible,
  patient,
  reload,
  setReload,
  setSelectedUpdate = false,
  modal = true,
  updateData = false
}) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [allDocuments, setAllDocuments] = useState([]);
  const [data, setData] = useState({});
  const [document, setDocument] = useState(false);
  const { user, clinic } = useProfile();
  const [documentSearch, setDocumentSearch] = useState("");
  const [value, setValue] = useState(false);

  const systemName = process.env.clientName;

  const replaceText = (id, str) => {
    setLoading(true);
    textReplaceService
      .replaceText({
        base: str,
        businessUnitId: clinic?.id,
        userId: user?.id,
        tutorId:
          systemName !== "LiftOne"
            ? patient?.tutors?.find((tutor) => tutor?.is_main)?.id
            : patient?.id,
        dependentId: patient?.id,
        documentId: id,
        tag: patient?.id
      })
      .then((res) => {
        setBody(res.data.text);
        setValue(res.data.key);
      })
      .finally(() => setLoading(false));
  };

  const getAllDocumentTemplates = useCallback(() => {
    setLoading(true);
    documentServices
      .getAll()
      .then((res) => setAllDocuments(res.data))
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message:
            "Houve um erro ao recuperar os templates de documentos cadastrados"
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    (visible || !modal) && getAllDocumentTemplates();
  }, [getAllDocumentTemplates, visible]);

  useEffect(() => {
    updateData && setBody(updateData?.timeline_info?.value);
    updateData &&
      allDocuments.length > 0 &&
      setDocument(
        allDocuments?.find(
          (item) => item?.title === updateData?.timeline_info?.type
        )
      );
  }, [updateData.id, allDocuments]);

  const submit = useCallback(
    (visible = false) => {
      if (!document?.id)
        return notification.error({
          message: "Selecione o tipo do documento"
        });

      setLoading(true);
      timelineService
        .insertDocument({
          tag: patient?.id,
          type: allDocuments.find((item) => item.id === document?.id)?.title,
          value: document?.type !== "pdf" ? body : value,
          technicianId: user?.id,
          realizedAt: moment(new Date()),
          message: "."
        })
        .then((_res) =>
          notification.success({ message: "Documento salvo com sucesso!" })
        )
        .catch((_err) => {
          setLoading(false);
          return notification.error({
            message: "Não foi possível salvar o documento..."
          });
        })
        .finally(() => {
          setLoading(false);
          setVisible(visible);
          setData({});
          setBody("");
          setDocument(false);
          setReload(!reload);
        });
    },
    [patient?.id, document, body, user?.id, allDocuments, value]
  );

  const submitUpdate = useCallback(
    (visible = false) => {
      const generateDocumentId = allDocuments?.find(
        (item) => item?.title === updateData?.timeline_info?.type
      )?.id;

      setLoading(true);
      timelineService
        .updateDocuments(updateData.id, {
          tag: patient?.id,
          type: allDocuments?.find((item) => item.id === generateDocumentId)
            ?.title,
          value: body,
          technicianId: user?.id,
          realizedAt: moment(new Date())
        })
        .then((_res) =>
          notification.success({ message: "Documento atualizado com sucesso!" })
        )
        .catch((_err) => {
          setLoading(false);
          return notification.error({
            message: "Não foi possível atualizar o documento..."
          });
        })
        .finally(() => {
          setSelectedUpdate(false);
          if (!visible) {
            setLoading(false);
            setData({});
            setReload(!reload);
          }
        });
    },
    [data, patient, updateData?.id, allDocuments, body, user]
  );

  const removeData = (id) => {
    setLoading(true);
    timelineService
      .removeComplete(id)
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        return notification.success({
          message: "Registro removido com sucesso!"
        });
      })
      .catch((_err) => {
        setLoading(false);
      });
  };

  return modal ? (
    <Modal
      title={`Lançamento de documentos - ${
        systemName === "LiftOne" ? "Cliente" : "Paciente"
      }: ${patient?.name}`}
      onCancel={() => setVisible(false)}
      visible={visible}
      footer={null}
      width={1000}
    >
      <FormChild
        document={document}
        allDocuments={allDocuments}
        body={body}
        setBody={setBody}
        loading={loading}
        submit={submit}
        setDocument={setDocument}
        modal={modal}
        setVisible={setVisible}
        replaceText={replaceText}
        print={submit}
      />
    </Modal>
  ) : (
    <FormChild
      document={document}
      allDocuments={allDocuments}
      body={body}
      setBody={setBody}
      loading={loading}
      submit={submitUpdate}
      setDocument={setDocument}
      modal={modal}
      replaceText={replaceText}
      print={submitUpdate}
      remove={() => removeData(updateData?._id)}
      updateData={updateData}
    />
  );
});

export default Documents;
