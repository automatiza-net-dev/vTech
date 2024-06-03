import { useState } from "react";
import { useRouter } from "next/router";

import {
  Error,
  Input,
  useToast,
  Textarea,
  Accordion,
  TextEditor,
  Modal,
  Button,
  FormHandler,
} from "infinity-forge";
import { useQueryClient } from "react-query";

import { Attendace } from "@/domain";
import { Print, useLoadSchedule } from "@/presentation";
import { RemoteAttendances } from "@/data";
import { PdfPatientAttendance } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";
import AddBudget from "@/OLD/components/Budget/Create";

import { DropdownComponentProps } from "../dropdown-item";
import { SelectTypeService } from "./components";

import * as S from "./styles";

export function Avaliation(props: DropdownComponentProps) {
  const [modal, setModal] = useState(false);

  const router = useRouter();
  const { createToast } = useToast();
  const queryClient = useQueryClient();

  const patientId = router.query.id as string;
  const attendanceId = props.timeline_info?.attendance?.id;
  const scheduleId = router.query?.scheduleId as string | undefined;
  const scheduleDate = router.query?.scheduleDate as string | undefined;

  const schedule = useLoadSchedule(scheduleId);

  async function handleSubmit(data: Attendace) {
    if (attendanceId) {
      await container
        .get<RemoteAttendances>(TypesAutomatiza.RemoteAttendances)
        .update({
          id: attendanceId,
          resume: data.resume,
          protocol: data.protocol,
          internalObservation: data.internalObservation,
        });
    } else {
      await container
        .get<RemoteAttendances>(TypesAutomatiza.RemoteAttendances)
        .open({
          ...data,
          scheduleId,
          patientId,
          scheduleServiceId: data.scheduleServiceId
            ? data.scheduleServiceId[0]
            : "",
        });

      await queryClient.invalidateQueries({
        queryKey: ["RemotePatient", patientId],
      });
    }

    await queryClient.invalidateQueries({
      queryKey: ["LastUpdates", patientId],
    });

    scheduleDate &&
      (await queryClient.invalidateQueries({
        queryKey: "RemoteLoadAllSchedulesUser" + scheduleDate + "true",
      }));

    scheduleDate &&
      (await queryClient.invalidateQueries({
        queryKey: "RemoteLoadAllSchedulesUser" + scheduleDate + "false",
      }));

    createToast({
      message: attendanceId
        ? "Atendimento atualizado com sucesso!"
        : "Atendimento criado com sucesso!",
      status: "success",
    });

    props.setModal && props.setModal(false);
  }

  return (
    <Error name="Avaliation">
      <S.Avaliation>
        <h2>Atendimento</h2>

        <FormHandler
          cleanFieldsOnSubmit={false}
          initialData={{
            ...props.timeline_info,
            internalObservations: props?.timeline_info?.internalObservation
              ? props?.timeline_info?.internalObservation
              : schedule?.data
              ? schedule?.data?.serviceType?.description
              : "",
            scheduleServiceId: props?.timeline_info?.service?.id
              ? [props?.timeline_info?.service?.id]
              : schedule?.data
              ? [schedule?.data?.serviceType?.id]
              : [],
          }}
          button={{ text: "Salvar" }}
          onSucess={handleSubmit}
          disableEnterKeySubmitForm
        >
          <div className="row">
            <div>
              <label>Tipo atendimento</label>

              <SelectTypeService
                initialService={props?.timeline_info?.service?.id}
              />
            </div>

            <div>
              <label>Resumo</label>
              <Input name="resume" placeholder="Resumo" />
            </div>
          </div>

          <TextEditor name="protocol" className="custom-editor" />

          <div className="internal_observations">
            {props.timeline_info?.protocol ? (
              <Accordion title="Observações internas">
                <Textarea
                  name="internalObservation"
                  placeholder="Observações internas"
                />
              </Accordion>
            ) : (
              <>
                <label>Observações internas</label>
                <Textarea
                  name="internalObservation"
                  placeholder="Observações internas"
                />
              </>
            )}
          </div>

          {attendanceId && (
            <Print
              PdfContent={<PdfPatientAttendance {...props?.timeline_info} />}
            />
          )}

          <div className="button_new_budget">
            <Modal
              style={{ maxWidth: "1200px", padding: "20px" }}
              modal={modal}
              setModal={setModal}
              trigger={
                <Button text="NOVO ORÇAMENTO" onClick={() => setModal(true)} />
              }
              children={<AddBudget modal={modal} setModal={setModal} />}
            />
            {/* <ButtonNewBudget /> */}
          </div>
        </FormHandler>
      </S.Avaliation>
    </Error>
  );
}
