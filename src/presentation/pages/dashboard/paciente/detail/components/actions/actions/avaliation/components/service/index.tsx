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
import { useReactToPrint } from "react-to-print";

import { useQueryClient } from "infinity-forge";

import * as yup from "yup";

import {
  PrintHeader,
  AddBudgetNew,
  useDictionary,
  useLoadPatient,
  useLoadSchedule,
  PdfPatientAttendance,
  useLoadAllScheduleStatuses,
  useConfigurationsSystem,
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

  const queryClient = useQueryClient();

  const router = useRouter();
  const { createToast } = useToast();
  const { getWord } = useDictionary();

  const patient = useLoadPatient();
  const scheduleStatuses = useLoadAllScheduleStatuses();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    onAfterPrint: async () => {
      mutate && mutate();
      reloadSchedule && reloadSchedule();
      await queryClient.refetch(["LastUpdates"], { mode: "include" });
    },
  });

  const { user } = useAuthAdmin();
  const { type } = useConfigurationsSystem();

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
          typeSystem: type,
          id: attendanceId
            ? type !== "Vet"
              ? timeLine._id
              : attendanceId
            : undefined,
        });

      setAttendance(attendanceResponse);

      if (scheduleDate) {
        queryClient.refetch([
          "RemoteLoadAllSchedulesUser",
          scheduleDate,
          "true",
        ]);
        queryClient.refetch([
          "RemoteLoadAllSchedulesUser",
          scheduleDate,
          "false",
        ]);
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

      if (!data?.print) {
        mutate && mutate();
        onSuccess && onSuccess();
        reloadSchedule && reloadSchedule();
      }
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
        schema={{
          protocol: yup.string().required("Campo requerido"),
          resume: yup.string().required("Campo requerido"),
        }}
        cleanFieldsOnSubmit={false}
        initialData={initialData}
        customSubmit={[
          {
            action: async (data) => {
              await handleSubmit({ ...data, print: true }, async () => {});

              setTimeout(() => handlePrint(), 500);
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

              await queryClient.refetch(["LastUpdates", patientId], {
                mode: "exact",
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
              await handleSubmit(data, async () => {
                props?.setModal && props.setModal(false);

                await queryClient.refetch(["LastUpdates"], { mode: "include" });
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
        {type !== "Vet" && (
          <InputFile
            label="Arquivos"
            name="photos"
            isLocalFile
            multiple
            isAccumalativeFile
          />
        )}
      </FormHandler>

      <Modal
        styles={{
          maxWidth: "1400px",
          width: "calc(100% - 30px)",
        }}
        open={modal}
        onClose={async () => {
          setModal(false);

          await queryClient.refetch(["LastUpdates"], { mode: "include" });
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
        <div ref={componentRef} style={{ padding: "0 20px" }}>
          <div className="uk-text-center uk-margin-top">
            <PrintHeader />
          </div>

          <PdfPatientAttendance {...timeLine?.timeline_info} patient={patient?.data} />
        </div>
      </div>
    </S.Service>
  );
}

function Protocol({ timeLine }) {
  const { setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    setFieldValue("protocol", timeLine?.timeline_info?.protocol || "");
  }, []);

  return <TextEditor label="Protocolo" name="protocol" />;
}
