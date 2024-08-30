import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";

import {
  Error,
  Input,
  Modal,
  useToast,
  Textarea,
  Accordion,
  InputFile,
  TextEditor,
  FormHandler,
  useAuthAdmin,
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
  useDictionary,
  useLoadSchedule,
} from "@/presentation";
import Editor from "@/OLD/components/Editor";

import { DropdownComponentProps } from "../dropdown-item";
import { AttendanceBudgets, SelectTypeService } from "./components";

import * as S from "./styles";

export function Avaliation(props: DropdownComponentProps) {
  const [modal, setModal] = useState(false);
  const [attendance, setAttendance] = useState<TimeLine | null>(null);
  const [body, setBody] = useState("");

  const componentRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { getWord } = useDictionary();
  const { createToast } = useToast();
  const queryClient = useQueryClient();
  const handlePrint = useReactToPrint({ content: () => componentRef.current });

  const { user } = useAuthAdmin();

  const timeLine = attendance || props;
  const patientId = router.query.id as string;
  const attendanceId = timeLine.timeline_info?.attendance?.id;
  const scheduleId = router.query?.scheduleId as string | undefined;
  const scheduleDate = router.query?.scheduleDate as string | undefined;

  const schedule = useLoadSchedule(scheduleId);

  async function handleSubmit(data, onSuccess: () => void) {
    const payload = {
      ...data,
      scheduleId,
      protocol: body,
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

    onSuccess && onSuccess();

    // TODO verificar trecho de código
    // queryClient.setQueryData(["LastUpdates", patientId], (state) => {
    //   const lastUpdates = state as TimeLine[];

    //   const itemAlredyExist = lastUpdates.find((timeline) => {
    //     return timeline._id === attendanceResponse._id;
    //   });

    //   if (itemAlredyExist) {
    //     return lastUpdates.map((timeline) => {
    //       if (timeline._id === attendanceResponse._id) {
    //         return { ...attendanceResponse, updatedAt: timeline.updatedAt };
    //       }

    //       return timeline;
    //     });
    //   }

    //   return [attendanceResponse, ...lastUpdates] as TimeLine[];
    // });

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

  useEffect(() => {
    timeLine?.timeline_info && setBody(timeLine?.timeline_info?.protocol);
  }, [timeLine]);

  return (
    <Error name="Avaliation">
      <S.Avaliation>
        {!modal && (
          <FormHandler
            isStickyButtons
            debugMode
            cleanFieldsOnSubmit={false}
            initialData={initialData}
            customSubmit={[
              {
                action: async () => {
                  handlePrint();
                },
                props: {
                  text: "Imprimir",
                },
                active: !!props.timeline_id,
              },
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
                props: { text: "EXCLUIR" },
                active: !!props.timeline_id,
              },
              {
                action: async (data) => {
                  await handleSubmit(data, () => {
                    setModal(true);
                  });
                },
                props: { text: `NOVO ${getWord("Orçamento").toUpperCase()}` },
                active: true,
              },
              {
                action: async (data) => {
                  await handleSubmit(data, () => {
                    props?.setModal && props.setModal(false);
                    queryClient.invalidateQueries(["LastUpdates"]);
                  });
                },
                props: { text: "SALVAR" },
                active: true,
              },
            ].filter((item) => item.active)}
            disableEnterKeySubmitForm
          >
            <div className="row">
              <SelectTypeService
                initialService={timeLine?.timeline_info?.service?.id}
              />

              <Input label="Resumo" name="resume" placeholder="Resumo" />
            </div>
            <div
              className="uk-margin-top"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              <Editor
                editorState={body}
                setEditorState={setBody}
                value={body}
              />
            </div>

            {/* <TextEditor name="protocol" /> */}

            <div className="internal_observations">
              {props.timeline_info?.protocol ? (
                <Accordion title="Observações internas">
                  <Textarea
                    name="internalObservation"
                    placeholder="Observações internas"
                  />
                </Accordion>
              ) : (
                <Textarea
                  label="Observações internas"
                  name="internalObservation"
                  placeholder="Observações internas"
                />
              )}
            </div>

            {process.env.client === "liftone" && (
              <InputFile name="photos" isLocalFile multiple />
            )}
          </FormHandler>
        )}

        <Modal
          styles={{
            maxWidth: "1400px",
            width: "calc(100% - 30px)",
          }}
          open={modal}
          onClose={() => {
            setModal(false);
            queryClient.invalidateQueries(["LastUpdates"]);
          }}
        >
          <AddBudgetNew
            attendanceId={timeLine?.timeline_info?.attendance?.id}
            setModal={setModal}
          />
        </Modal>

        {props?.timeline_info?.attendance?.id && (
          <AttendanceBudgets id={props.timeline_info?.attendance.id} />
        )}
        <div style={{ display: "none" }}>
          <div ref={componentRef}>
            <PdfPatientAttendance {...timeLine?.timeline_info} />
          </div>
        </div>
      </S.Avaliation>
    </Error>
  );
}
