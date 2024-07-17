import React from "react";

import { Button, notification } from "antd";
import { Error } from "infinity-forge";
import { useQueryClient } from "react-query";

import Print from "@/OLD/components/mini-components/Print";
import { timelineService } from "@/OLD/services/timeline.service";

import * as S from "./styles";

import { RemotePatient } from "@/data";
import { container, patientTypes } from "@/container";
import { useRouter } from "next/router";
import moment from "moment";

export function ButtonPrint() {
  //   const router = useRouter();
  //   const queryClient = useQueryClient();

  //   function submit() {
  //     if (!document?.id)
  //       return notification.error({
  //         message: "Selecione o tipo do documento",
  //       });

  //     setLoading(true);

  //     timelineService
  //       .insertDocument({
  //         tag: patient.data?.id,
  //         type: allDocuments.find((item) => item.id === document?.id)?.title,
  //         value: document?.type !== "pdf" ? body : value,
  //         technicianId: user?.id,
  //         realizedAt: moment(),
  //         message: ".",
  //       })
  //       .then((_res) =>
  //         notification.success({ message: "Documento salvo com sucesso!" })
  //       )
  //       .catch((_err) => {
  //         setLoading(false);

  //         return notification.error({
  //           message: "Não foi possível salvar o documento...",
  //         });
  //       })
  //       .finally(async () => {
  //         await queryClient.invalidateQueries({
  //           queryKey: ["LastUpdates", router.query.id],
  //         });

  //         setLoading(false);
  //         setModal(false);
  //         setData({});
  //         setBody("");
  //         setDocument(false);
  //       });
  //   }

  //   async function registerPrint() {
  //     // >> Esse print nao existe no remote RemotePatient
  //     try {
  //       await container
  //         .get<RemotePatient>(patientTypes.RemotePatient)
  //         .requestPrinting(
  //           updateData?.timeline_info?.$meta?.bill_document_id
  //             ? {
  //                 billDocumentId:
  //                   updateData?.timeline_info?.$meta?.bill_document_id,
  //               }
  //             : { timelineId: updateData?._id }
  //         );
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }

  return (
    <Error name="ButtonPrint">
      <S.ButtonPrint>
        {/* {document?.type !== "pdf" && (
          <Print
            triggerComponent={<Button>Imprimir</Button>}
            content={body}
            title={
              allDocuments?.find((item) => item.id === document?.id)?.title
            }
            onBeforePrint={() => {
              if (print) {
                submit();
                registerPrint && registerPrint();
              }
            }}
          />
        )} */}
      </S.ButtonPrint>
    </Error>
  );
}
