import { useState } from "react";
import { useRouter } from "next/router";

import {
  Error,
  Input,
  useToast,
  Textarea,
  Accordion,
  InputFile,
  TextEditor,
  FormHandler,
  useAuthAdmin,
  Modal,
} from "infinity-forge";
import moment from "moment";
import { useQueryClient } from "react-query";

import { TimeLine, User } from "@/domain";
import { RemoteAttendances } from "@/data";
import { TypesAutomatiza, container } from "@/container";
import {
  AddBudgetNew,
  PdfPatientAttendance,
  Print,
  useLoadSchedule,
} from "@/presentation";

import { DropdownComponentProps } from "../dropdown-item";
import { AttendanceBudgets, SelectTypeService } from "./components";

import * as S from "./styles";

export function Avaliation(props: DropdownComponentProps) {
  const [modal, setModal] = useState(false);
  const [attendance, setAttendance] = useState<TimeLine | null>(null);

  const router = useRouter();
  const { createToast } = useToast();
  const queryClient = useQueryClient();

  const { GetUser } = useAuthAdmin();

  const user = GetUser<User>();

  const timeLine = attendance || props;

  const patientId = router.query.id as string;
  const attendanceId = timeLine.timeline_info?.attendance?.id;
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

    const attendanceResponse = await container
      .get<RemoteAttendances>(TypesAutomatiza.RemoteAttendances)
      [!attendanceId ? "open" : "update"]({
        ...payload,
        id: attendanceId
          ? process.env.client === "liftone"
            ? timeLine._id
            : attendanceId
          : undefined,
      });

    setAttendance(attendanceResponse);

    queryClient.setQueryData(["LastUpdates", patientId], (state) => {
      const lastUpdates = state as TimeLine[];

      const itemAlredyExist = lastUpdates.find((timeline) => {
        return timeline._id === attendanceResponse._id;
      });

      if (itemAlredyExist) {
        return lastUpdates.map((timeline) => {
          if (timeline._id === attendanceResponse._id) {
            return {...attendanceResponse, updatedAt: timeline.updatedAt};
          }

          return timeline;
        });
      }

      return [attendanceResponse , ...lastUpdates] as TimeLine[];
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
  }

  const initialData = {
    ...timeLine.timeline_info,
    internalObservations: timeLine?.timeline_info?.internalObservation
      ? timeLine?.timeline_info?.internalObservation
      : schedule?.data
      ? schedule?.data?.serviceType?.description
      : "",
    scheduleServiceId: timeLine?.timeline_info?.service?.id
      ? [timeLine?.timeline_info?.service?.id]
      : schedule?.data
      ? [schedule?.data?.serviceType?.id]
      : [],
  };

  return (
    <Error name="Avaliation">
      <S.Avaliation>
        <h2>{process.env.client === "sancla" ? "Atendimento" : "Avaliação"}</h2>

        {!modal && (
          <FormHandler
            debugMode
            cleanFieldsOnSubmit={false}
            initialData={initialData}
            customSubmit={[
              {
                action: async () => {
                  await container
                    .get<RemoteAttendances>(TypesAutomatiza.RemoteAttendances)
                    .delete({
                      id: timeLine._id as TimeLine["_id"],
                    });

                  createToast({
                    message: `Excluido com sucesso!`,
                    status: "success",
                  });

                  queryClient.setQueryData(
                    ["LastUpdates", patientId],
                    (state) => {
                      const queryData = state as TimeLine[];

                      return queryData.filter(
                        (item) => item._id !== timeLine._id
                      );
                    }
                  );
                },
                props: { text: "Excluir" },
                active: !!props.timeline_id,
              },
              {
                action: async (data) => {
                  await handleSubmit(data);
                  setModal(true);
                },
                props: { text: "NOVO ORÇAMENTO" },
                active: true,
              },
              {
                action: async (data) => {
                  await handleSubmit(data);

                  props?.setModal && props.setModal(false);
                },
                props: { text: "SALVAR" },
                active: true,
              },
            ].filter((item) => item.active)}
            disableEnterKeySubmitForm
          >
            <div className="row">
              <div>
                <label>Tipo atendimento</label>

                <SelectTypeService
                  initialService={timeLine?.timeline_info?.service?.id}
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

            {process.env.client === "liftone" && (
              <InputFile name="photos" isLocalFile multiple />
            )}

            {props.timeline_info?.attendance?.id && (
              <Print
                PdfContent={
                  <PdfPatientAttendance {...timeLine?.timeline_info} />
                }
              />
            )}
          </FormHandler>
        )}

        <Modal
          styles={{ height: "95vh", overflow: "auto" }}
          stylesContent={{ height: "100%" }}
          open={modal}
          onClose={() => setModal(false)}
        >
          <AddBudgetNew
            attendanceId={timeLine?.timeline_info?.attendance?.id}
            setModal={setModal}
          />
        </Modal>

        {props?.timeline_info?.attendance?.id && (
          <AttendanceBudgets id={props.timeline_info?.attendance.id} />
        )}
      </S.Avaliation>
    </Error>
  );
}
