import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";

import {
  Input,
  Modal,
  useToast,
  Textarea,
  Accordion,
  InputFile,
  FormHandler,
  useAuthAdmin,
  LoaderCircle,
} from "infinity-forge";
import moment from "moment";
import { useQueryClient } from "react-query";
import { useReactToPrint } from "react-to-print";

import * as yup from "yup";

import {
  PrintHeader,
  AddBudgetNew,
  useDictionary,
  useLoadSchedule,
  PdfPatientAttendance,
} from "@/presentation";
import { TimeLine } from "@/domain";
import { RemoteAttendances } from "@/data";
import { TypesAutomatiza, container } from "@/container";

import Editor from "@/OLD/components/Editor";

import { AttendanceBudgets } from "../attendance-budgets";
import { SelectTypeService } from "../select-type-service";

import * as S from "./styles";

export function Service({ scheduleId, mutate, ...props }) {
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
  const scheduleDate = router.query?.scheduleDate as string | undefined;

  const schedule = useLoadSchedule(scheduleId);

  async function handleSubmit(data, onSuccess: () => void) {
    try {
      if (body === "") {
        return createToast({
          message: "Protocolo não informado",
          status: "error",
        });
      }

      if (!data?.scheduleServiceId || data?.scheduleServiceId == "") {
        return createToast({
          message: "Informe o tipo de atendimento",
          status: "error",
        });
      }

      const payload = {
        ...data,
        scheduleId: scheduleId,
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
        } com sucesso!`,
        status: "success",
      });

      mutate && mutate();
    } catch (err: any) {
      if (err?.error?.message) {
        return createToast({ status: "error", message: err?.error?.message });
      }
      return createToast({
        status: "error",
        message: "Houve um erro ao criar a avaliação",
      });
    }
  }

  useEffect(() => {
    setBody(timeLine?.timeline_info?.protocol || "");
  }, [timeLine.timeline_info]);

  const initialData = {
    ...timeLine.timeline_info,
    internalObservation: timeLine?.timeline_info?.internalObservation
      ? timeLine?.timeline_info?.internalObservation
      : schedule?.data?.serviceType?.description || "",
    scheduleServiceId: timeLine?.timeline_info?.service?.id
      ? [timeLine?.timeline_info?.service?.id]
      : schedule?.data?.serviceType?.id
      ? [schedule?.data?.serviceType?.id]
      : [],
  };

  if (schedule.isFetching) {
    return <LoaderCircle color="#ccc" size={20} />;
  }

  return (
    <S.Service>
      <FormHandler
        isStickyButtons
        debugMode
        schema={{
          resume: yup.string().required("Campo resumo é obrigatório"),
        }}
        cleanFieldsOnSubmit={false}
        initialData={initialData}
        customSubmit={[
          {
            action: async () => {
              handlePrint();
            },
            props: {
              text: "IMPRIMIR",
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

              queryClient.setQueryData(["LastUpdates", patientId], (state) => {
                const queryData = state as TimeLine[];

                return queryData.filter((item) => item._id !== timeLine._id);
              });

              mutate && mutate();
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
            setBody={setBody}
          />

          <Input label="Resumo" name="resume" placeholder="Resumo" />
        </div>
        <div
          className="uk-margin-top"
          style={{ maxHeight: "500px", overflowY: "auto" }}
        >
          <Editor editorState={body} setEditorState={setBody} value={body} />
        </div>

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
          <div className="uk-text-center uk-margin-top">
            <PrintHeader />
          </div>

          <PdfPatientAttendance {...timeLine?.timeline_info} />
        </div>
      </div>
    </S.Service>
  );
}
