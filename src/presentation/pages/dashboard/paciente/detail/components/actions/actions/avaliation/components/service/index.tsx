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
  TextEditor,
} from "infinity-forge";
import moment from "moment";
import { useQueryClient } from "react-query";
import { useReactToPrint } from "react-to-print";

import * as yup from "yup";

import {
  PrintHeader,
  AddBudgetNew,
  useDictionary,
  useLoadPatient,
  useLoadSchedule,
  PdfPatientAttendance,
  useLoadAllScheduleStatuses,
  useSystem,
} from "@/presentation";
import { TimeLine } from "@/domain";
import { RemoteAttendances, RemoteChangeStatus } from "@/data";
import { TypesAutomatiza, container, patientTypes } from "@/container";

import { AttendanceBudgets } from "../attendance-budgets";
import { SelectTypeService } from "../select-type-service";

import * as S from "./styles";
import { useFormikContext } from "formik";

export function Service({ scheduleId, mutate, reloadSchedule, ...props }) {
  const [modal, setModal] = useState(false);
  const [attendance, setAttendance] = useState<TimeLine | null>(null);

  const componentRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { createToast } = useToast();
  const { getWord } = useDictionary();

  const patient = useLoadPatient();
  const queryClient = useQueryClient();
  const scheduleStatuses = useLoadAllScheduleStatuses();

  const handlePrint = useReactToPrint({ contentRef: componentRef });

  const { unit } = useSystem();
  const { user } = useAuthAdmin();

  const timeLine = attendance || props;
  const patientId = router.query.id as string;
  const attendanceId = timeLine.timeline_info?.attendance?.id;
  const scheduleDate = router.query?.scheduleDate as string | undefined;

  const schedule = useLoadSchedule(scheduleId);

  async function handleSubmit(data, onSuccess: () => void) {
    try {
      if (!data?.scheduleServiceId || data?.scheduleServiceId == "") {
        return createToast({
          message: "Informe o tipo de atendimento",
          status: "error",
        });
      }

      const payload = {
        ...data,
        scheduleId: scheduleId,
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
            ? unit.system.type !== "Vet"
              ? timeLine._id
              : attendanceId
            : undefined,
        });

      setAttendance(attendanceResponse);

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

      if (
        router?.query?.scheduleId &&
        patient?.data?.scheduleId &&
        !patient?.data?.scheduleStartedAt
      ) {
        const statusId =
          scheduleStatuses.data?.find((status) => status.type === "ATEND")
            ?.id || "";

        container
          .get<RemoteChangeStatus>(patientTypes.RemoteChangeStatus)
          .change({
            scheduleId: router.query.scheduleId as string,
            statusId,
          });

        reloadSchedule && reloadSchedule();
      }

      mutate && mutate();
      onSuccess && onSuccess();
      reloadSchedule && reloadSchedule();
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
          protocol: yup.string().required("Campo requerido"),
          resume: yup.string().required("Campo requerido"),
        }}
        cleanFieldsOnSubmit={false}
        initialData={initialData}
        customSubmit={[
          {
            action: async (data) => {
              await handleSubmit(data, () => {
                queryClient.invalidateQueries(["LastUpdates"])
              });

  
                handlePrint();
            
            },
            props: () => ({
              text: "IMPRIMIR",
            }),
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
            props: () => ({ text: "EXCLUIR" }),
            active: !!props.timeline_id,
          },
          {
            action: async (data) => {
              await handleSubmit(data, () => {
                setModal(true);
              });
            },
            props: () => ({
              text: `NOVO ${getWord("Orçamento").toUpperCase()}`,
            }),
            active: true,
          },
          {
            action: async (data) => {
              await handleSubmit(data, () => {
                props?.setModal && props.setModal(false);
                queryClient.invalidateQueries(["LastUpdates"]);
              });
            },
            props: () => ({ text: "SALVAR" }),
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

        <Protocol timeLine={timeLine} />

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

        {unit.system.type === "Vet" && (
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

function Protocol({ timeLine }) {
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    setFieldValue("protocol", timeLine?.timeline_info?.protocol || "");
  }, []);

  return <TextEditor label="Protocolo" name="protocol" />;
}
