// @ts-nocheck
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

import { attendanceService } from "@/OLD/services/attendances.service";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import {
  useAttendances,
  useTreatmentsNotExecuted,
} from "@/OLD/hooks/useAttendances";
import { useSchedule } from "@/OLD/hooks/useSchedules";
import { useLoadPatient } from "@/presentation";

import { Button, useToast } from "infinity-forge";
import { Modal, Select, Button as AntButton } from "antd";

import moment from "moment";
import { useQueryClient } from "infinity-forge";
import Executions from "../Forms-old/Executions";

export function EndAttendanceButton() {
  const [showSelectAttendances, setShowSelectAttendances] = useState(false);
  const [reload, setReload] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(false);
  const [loading, setLoading] = useState(false);

  const { createToast } = useToast();

  const addLaunchPermission = useUserHasPermission("FIC01");
  const patient = useLoadPatient();
  const router = useRouter();
  const scheduleId = router.query.innerpage;

  const { attendances } = useAttendances(patient?.data?.id, reload);
  const { schedule } = useSchedule(scheduleId, reload);

  const [executionsState, setExecutionsState] = useState<
    "hidden" | "show" | "processed"
  >("hidden");
  const searchQuery = useTreatmentsNotExecuted({
    enabled: !!patient?.data.id,
    patientID: patient?.data.id,
    holderID:
      patient?.data.holders?.find((f) => f.main)?.id ||
      patient?.data.holders?.at(0)?.id,
  });
  useEffect(() => {
    if (executionsState !== "hidden") {
      return;
    }

    setExecutionsState((old) =>
      searchQuery.data?.length === 0 ? "processed" : old,
    );
  }, [executionsState, searchQuery.data]);

  const refetch = useQueryClient();

  const attendancesToClose = attendances.filter(
    (attendance) => !attendance?.end_date,
  );

  const closeAttendances = useCallback(() => {
    setLoading(true);
    attendanceService
      .closeAttendance(selectedAttendance)
      .then(async (_res) => {
        await refetch(["RemotePatient", patient.data.id]);

        createToast({
          status: "error",
          message: "Atendimento finalizado com sucesso!",
        });
      })
      .finally(() => {
        setLoading(false);
        setSelectedAttendance(false);
        setReload((prv) => !prv);
        setShowSelectAttendances(false);
      });
  }, [selectedAttendance]);

  return (
    addLaunchPermission &&
    patient.data?.openAttendances && (
      <>
        <Button
          svg="IconDoor"
          text="FINALIZAR ATENDIMENTO"
          onClick={() => {
            if (attendancesToClose?.length > 0) {
              setShowSelectAttendances(true);
            } else {
              Modal.confirm({
                title: "Finalizar agendamento",
                content:
                  "Não há atendimentos pendentes para o paciente. Deseja finalizar o agendamento?",
                onOk: () => {
                  if (
                    schedule?.serviceStatus?.description === "Em atendimento"
                  ) {
                    const attendancesToClose = attendances?.find(
                      (attendance) => !attendance?.end_date,
                    );

                    attendancesToClose &&
                      attendanceService
                        .closeAttendance(attendancesToClose?.id)
                        .then((_res) => {
                          createToast({
                            status: "success",
                            message: "Atendimento finalizado com sucesso!",
                          });
                        });
                  }
                },
                onCancel: () => {
                  // Handle the cancel event if needed
                  // ...
                },
              });
            }
          }}
        />
        <Modal
          onCancel={() => setExecutionsState("processed")}
          title="Fechar atendimento"
          visible={executionsState === "show"}
          footer={null}
          width={"60%"}
        >
          <Executions
            value="Execução de Tratamento"
            modal
            setModal={() => setExecutionsState("processed")}
            reloadSchedule={() => ({})}
          />
        </Modal>
        <Modal
          onCancel={() => setShowSelectAttendances(false)}
          title="Fechar atendimento"
          visible={showSelectAttendances}
          footer={null}
          width={"60%"}
        >
          <div>
            <label>Selecione o atendimento a ser fechado</label>
            <Select
              onChange={(val) => {
                setSelectedAttendance(val);
                setExecutionsState((old) => (old === "hidden" ? "show" : old));
              }}
              className="uk-width-1-1"
              value={selectedAttendance}
            >
              {attendancesToClose?.length > 0 &&
                attendancesToClose
                  .slice() // Faz uma cópia do array original para evitar alterações indesejadas
                  .sort(
                    (a, b) => new Date(a.start_date) - new Date(b.start_date),
                  )
                  .map((attendance) => (
                    <Option value={attendance?.id}>
                      {attendance?.scheduleService?.description}
                      {" - "}
                      {moment(attendance.start_date).format(
                        "DD/MM/YYYY - HH:mm",
                      )}
                    </Option>
                  ))}
            </Select>
          </div>
          <hr />
          <footer className="uk-flex uk-flex-right">
            <AntButton
              className="uk-margin-right"
              type="primary"
              loading={loading}
              onClick={() => {
                !selectedAttendance
                  ? createToast({
                      status: "error",
                      message: "Selecione o atendimento a ser finalizado",
                    })
                  : closeAttendances();
              }}
            >
              Confirmar
            </AntButton>
            <AntButton onClick={() => setShowSelectAttendances(false)}>
              Cancelar
            </AntButton>
          </footer>
        </Modal>
      </>
    )
  );
}
