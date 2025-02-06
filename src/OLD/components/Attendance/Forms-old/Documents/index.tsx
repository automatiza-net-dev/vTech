// Core
import React, { useState, useEffect, useCallback } from "react";

// Services
import { documentServices } from "@/OLD/services/document.service";
import { timelineService } from "@/OLD/services/timeline.service";
import { textReplaceService } from "@/OLD/services/textReplace.service";

import { RemotePatient } from "@/data";
import { container, patientTypes } from "@/container";

// Hooks
import { useMe } from "@/presentation/hooks";
import { useLoadPatient } from "@/presentation/hooks";

// Components
import FormChild from "./FormChild";
import { useToast } from "infinity-forge";

// utils
import moment from "moment";
import { useQueryClient } from "react-query";
import { useRouter } from "next/router";

export default function Documents({
  modal,
  setModal,
  setSelectedUpdate = false,
  updateData = false,
}: any) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [allDocuments, setAllDocuments] = useState([]);
  const [data, setData] = useState({});
  const [document, setDocument] = useState(false);
  // const { user, clinic } = useProfile();
  const [documentSearch, setDocumentSearch] = useState("");
  const [value, setValue] = useState(false);

  const { createToast } = useToast();
  const userInfo = useMe();

  const router = useRouter();
  const patient = useLoadPatient();
  const queryClient = useQueryClient();

  async function registerPrint() {
    try {
      await container
        .get<RemotePatient>(patientTypes.RemotePatient)
        .requestPrinting(
          updateData?.timeline_info?.$meta?.bill_document_id
            ? {
                billDocumentId:
                  updateData?.timeline_info?.$meta?.bill_document_id,
              }
            : { timelineId: updateData?._id }
        );
    } catch (err: any) {
      console.log(err);
    }
  }

  const replaceText = (id, str) => {
    setLoading(true);

    textReplaceService
      .replaceText({
        base: str,
        businessUnitId: userInfo?.data?.unit?.id,
        userId: userInfo?.data?.id,
        tutorId:
          process.env.client == "sancla"
            ? patient?.data?.tutor?.id
            : patient?.data?.id,
        dependentId: patient?.data?.id,
        documentId: id,
        tag: patient?.data?.id,
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
      .then((res) => {
        setAllDocuments(res.data);
      })
      .catch((_err) => {
        setLoading(false);
        return createToast({
          message:
            "Houve um erro ao recuperar os templates de documentos cadastrados",
          status: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getAllDocumentTemplates();
  }, [getAllDocumentTemplates, modal]);

  useEffect(() => {
    updateData && setBody(updateData?.timeline_info?.value);
    updateData &&
      allDocuments.length > 0 &&
      setDocument(
        allDocuments?.find(
          (item) => item?.title === updateData?.timeline_info?.type
        )
      );
  }, [updateData._id, allDocuments]);

  function submit() {
    if (!document?.id)
      return createToast({
        message: "Selecione o tipo do documento",
        status: "error",
      });

    setLoading(true);
    timelineService
      .insertDocument({
        tag: patient.data?.id,
        type: allDocuments.find((item) => item.id === document?.id)?.title,
        value: document?.type !== "pdf" ? body : value,
        technicianId: userInfo?.data?.id,
        realizedAt: moment(new Date()),
        message: ".",
      })
      .then((_res) => {
        queryClient.invalidateQueries({
          queryKey: ["LastUpdates", router.query.id],
        });
        setLoading(false);
        setModal(false);
        setData({});
        setBody("");
        setDocument(false);
        return createToast({
          message: "Documento salvo com sucesso!",
          status: "succes",
        });
      })
      .catch((_err) => {
        setLoading(false);
        return createToast({
          message: "Não foi possível salvar o documento...",
          status: "error",
        });
      });
  }

  const submitUpdate = useCallback(
    (visible = false) => {
      setLoading(true);
      timelineService
        .updateDocuments(updateData?._id, {
          tag: patient.data?.id,
          type: updateData.timeline_info.type,
          value: body,
          technicianId: userInfo?.data?.id,
          realizedAt: moment(new Date()),
        })
        .then((_res) => {
          queryClient.invalidateQueries({
            queryKey: ["LastUpdates", router.query.id],
          });
          setSelectedUpdate && setSelectedUpdate(false);
          if (!visible) {
            setLoading(false);
            setData({});
          }
          return createToast({
            message: "Documento atualizado com sucesso!",
            status: "success",
          });
        })
        .catch((_err) => {
          setLoading(false);
          return createToast({
            message: "Não foi possível atualizar o documento...",
          });
        });
    },
    [data, patient, updateData?.id, allDocuments, body, userInfo]
  );

  const removeData = (id) => {
    setLoading(true);
    timelineService
      .removeComplete(id)
      .then((_res) => {
        setLoading(false);

        queryClient.invalidateQueries({
          queryKey: ["LastUpdates", router.query.id],
        });
        return createToast({
          message: "Registro removido com sucesso!",
          status: "success",
        });
      })
      .catch((_err) => {
        setLoading(false);
      });
  };

  return modal ? (
    <FormChild
      document={document}
      allDocuments={allDocuments}
      body={body}
      setBody={setBody}
      loading={loading}
      submit={submit}
      setDocument={setDocument}
      modal={modal}
      setVisible={setModal}
      replaceText={replaceText}
      print={submit}
    />
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
      registerPrint={registerPrint}
    />
  );
}
