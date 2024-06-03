// @ts-nocheck
import { memo, useState, useCallback } from "react";

import { timelineService } from "@/OLD/services/timeline.service";
import { attendanceService } from "@/OLD/services/attendances.service.ts";

import { useBudgetsFromAttendance } from "@/OLD/hooks/useBudgets";
import { useProfile } from "@/OLD/hooks/useProfile";

import { Container } from "./styles";
import { notification } from "antd";
import AddBudgetItem from "@/OLD/components/Budget/Actions/AddBudgetItem";

import moment from "moment";

export default function BudgetsPanel({
  setVisible,
  type,
  data,
  body,
  patientId,
  fileList,
  setData,
  setCreated,
  created,
  setEvaluationVisible,
  eventId = false,
}: any) {
  const [selectedBudget, setSelectedBudget] = useState(false);
  const [reload, setReload] = useState(false);
  const [addItemVisible, setAddItemVisible] = useState(false);

  const { budgets } = useBudgetsFromAttendance(data?.id, reload);
  const { user } = useProfile();


  budgets.sort((a: any, b: any) => moment(b.budget_date).diff(moment(a.budget_date)));

  const submitPatientEvaluation = useCallback(() => {
    const formData = new FormData();

    formData.append("tag", patientId);
    formData.append("resume", data?.resume);
    formData.append("protocol", body);
    formData.append("realizedAt", moment(new Date()).toISOString());
    formData.append("technicianId", user?.id);
    formData.append("scheduleServiceTypeId", data?.scheduleServiceId);
    formData.append("internalObservation", data?.internalObservation);

    fileList.forEach((item) => {
      formData.append("photos[]", item.originFileObj);
    });

    timelineService
      .insertPatientEvaluation(formData)
      .then((res) => {
        setVisible(true);
        if (!created) {
          setData({ ...data, id: res?.data?.timeline_info?.attendance?.id });
          setCreated(true);
        }
        setEvaluationVisible(false);
        notification.success({ message: "Avaliação registrada com sucesso!" });
      })
      .catch((_err) => {
        return notification.error({
          message: "Verifique os campos informados",
        });
      });
  }, [patientId, data, body, user, fileList]);

  const submitOpenAttendance = useCallback(() => {
    const obj: any = {
      scheduleServiceId: data?.scheduleServiceId,
      resume: data?.resume,
      protocol: body,
      internalObservation: data?.internalObservation,
    };

    eventId ? (obj.scheduleId = eventId) : (obj.patientId = patientId);

    attendanceService
      .openAttendance(obj)
      .then((res) => {
        setVisible(true);
        if (!created) {
          setData({ ...data, id: res?.data?.timeline_info?.attendance?.id });
          setCreated(true);
        }
        setEvaluationVisible(false);
        return notification.success({
          message: "Atendimento criado com sucesso!",
        });
      })
      .catch((_err) => {
        return notification.error({
          message: "Houve um erro ao criar um atendimento",
        });
      });
  }, [data, body]);

  return (
    <Container className="uk-text-center uk-width-1-6">
      <div
        className="custom-add-budget"
        onClick={() => {
          if (!data?.scheduleServiceId) {
            return notification.warning({
              message: `Informe o tipo de ${
                process.env.client === "liftone" ? "Avaliação" : "Atendimento"
              }`,
            });
          }
          if (!data?.serviceDescription) {
            return notification.warning({
              message: `Informe a descrição de ${
                 process.env.client === "liftone" ? "Avaliação" : "Atendimento"
              }`,
            });
          }
          if (type && !created) {
             process.env.client === "liftone"
              ? submitPatientEvaluation()
              : submitOpenAttendance();
          } else {
            setVisible(true);
          }
        }}
      >
        Novo Orçamento
      </div>
      {budgets?.length > 0 &&
        budgets?.map((budget: any) => (
          <div
            key={budget?.tag}
            className="custom-card"
            onClick={() => {
              setAddItemVisible(true);
              setSelectedBudget(budget);
            }}
          >
            <div>
              Dt Orçam.:{" "}
              {moment(budget?.budget_date, "YYYY-MM-DD[T]HH:mm:ss").format(
                "DD/MM/YYYY"
              )}
            </div>
            <div>Cód Orçam.: {budget?.tag}</div>
            <div>Status: {budget?.status}</div>
          </div>
        ))}
      <AddBudgetItem
        budget={selectedBudget as any}
        setReload={setReload as any}
        externVisible={addItemVisible}
        setExternVisible={setAddItemVisible as any}
        tableRender={false}
      />
    </Container>
  );
}

