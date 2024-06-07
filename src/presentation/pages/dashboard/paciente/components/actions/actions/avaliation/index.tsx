import { useState } from "react";
import { useRouter } from "next/router";

import {
  Error,
  Input,
  Modal,
  Button,
  useToast,
  Textarea,
  Accordion,
  InputFile,
  TextEditor,
  FormHandler,
  useAuthAdmin,
  uid,
} from "infinity-forge";
import moment from "moment";
import { useQueryClient } from "react-query";

import { User } from "@/domain";
import { RemoteAttendances } from "@/data";
import { PdfPatientAttendance } from "@/presentation";
import { Print, useLoadSchedule } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

import AddBudget from "@/OLD/components/Budget/Create";

import { SelectTypeService } from "./components";
import { DropdownComponentProps } from "../dropdown-item";

import * as S from "./styles";

export function Avaliation(props: DropdownComponentProps) {
  const [modal, setModal] = useState(false);

  const router = useRouter();
  const { createToast } = useToast();
  const queryClient = useQueryClient();

  const { GetUser } = useAuthAdmin();

  const user = GetUser<User>();

  const patientId = router.query.id as string;
  const attendanceId = props.timeline_info?.attendance?.id;
  const scheduleId = router.query?.scheduleId as string | undefined;
  const scheduleDate = router.query?.scheduleDate as string | undefined;

  const schedule = useLoadSchedule(scheduleId);

  async function handleSubmit(data) {
    const payload = {
      ...data,
      scheduleId,
      realizedAt: moment().toDate(),
      technicianId: user?.user?.id as string,
      scheduleServiceId: data.scheduleServiceId
        ? data.scheduleServiceId[0]
        : "",
      patientId,
      photos: data?.photos?.map((photo) => photo.file),
    };
    if (attendanceId) {
      await container
        .get<RemoteAttendances>(TypesAutomatiza.RemoteAttendances)
        .update({
          ...payload,
          id: process.env.client === "liftone" ? props._id : attendanceId,
        });
    } else {
      await container
        .get<RemoteAttendances>(TypesAutomatiza.RemoteAttendances)
        .open(payload);

      queryClient.invalidateQueries({
        queryKey: ["RemotePatient", patientId],
      });
    }

    queryClient.invalidateQueries({
      queryKey: ["LastUpdates", patientId],
    });

    if (scheduleDate) {
      queryClient.invalidateQueries({
        queryKey: "RemoteLoadAllSchedulesUser" + scheduleDate + "true",
      });

      queryClient.invalidateQueries({
        queryKey: "RemoteLoadAllSchedulesUser" + scheduleDate + "false",
      });
    }

    createToast({
      message: `Atendimento ${
        attendanceId ? "atualizado" : "criado"
      }  com sucesso!`,
      status: "success",
    });

    props.setModal && props.setModal(false);
  }

  

  return (
    <Error name="Avaliation">
      <S.Avaliation>
        <h2>{process.env.client === "sancla" ? "Atendimento" : "Avaliação"}</h2>

        <FormHandler
          key={uid(11)}
          debugMode
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

          <InputFile name="photos" isLocalFile multiple />

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
