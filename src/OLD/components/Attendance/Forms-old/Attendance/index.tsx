// @ts-nocheck
import React, { memo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

import { useProfile } from "@/OLD/hooks/useProfile";
import { useLoadPatient } from "@/presentation/hooks";

import { attendanceService } from "@/OLD/services/attendances.service.ts";
import { calendarService } from "@/OLD/services/calendar.service";
import { timelineService } from "@/OLD/services/timeline.service";
import { textReplaceService } from "@/OLD/services/textReplace.service";

import { Modal, notification } from "antd";
import FormChild from "./FormChild";

import moment from "moment";
import { useQueryClient } from "react-query";

function AttendanceForm({
  visible,
  setVisible,
  modal = true,
  updateData = false,
}: any) {
  const [data, setData] = useState({});
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [created, setCreated] = useState(false);

  const { user, clinic } = useProfile();
  const { data: patient } = useLoadPatient();

  const systemName = process.env.clientName;

  const beforeUpload = useCallback((file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (isJpgOrPng) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        return notification.error({
          message: "Você só pode upar imagens até 2MB!",
        });
      }
    }

    return true;
  }, []);

  const replaceText = (str, setState) => {
    setLoading(true);
    textReplaceService
      .replaceText({
        base: str,
        businessUnitId: clinic?.id,
        userId: user?.id,
        tutorId:
          systemName !== "LiftOne"
            ? patient?.tutors?.find((tutor) => tutor?.is_main)?.id
            : patient?.id,
        dependentId: patient?.id,
      })
      .then((res) => setState(res.data.result))
      .catch((_err) => setState(""))
      .finally(() => setLoading(false));
  };

  const queryClient = useQueryClient();

  const router = useRouter();
  const eventId = router.query.innerpage;
  const petId = patient?.id;

  const formatUpdateData = useCallback(() => {
    systemName === "LiftOne" && setFileList(updateData?.timeline_info?.photos);
    setData({
      id: updateData?.timeline_info?.attendance?.id,
      resume: updateData?.timeline_info?.resume,
      serviceDescription: updateData?.timeline_info?.service?.description,
      scheduleServiceId: updateData?.timeline_info?.service?.id,
      internalObservation: updateData?.timeline_info?.internalObservation,
    });
    setBody(updateData?.timeline_info?.protocol);
  }, [updateData]);

  const getEventData = useCallback(() => {
    setLoading(true);
    calendarService
      .showSchedule(eventId)
      .then((res) => setScheduleData(res.data))
      .finally(() => setLoading(false));
  }, [eventId]);

  useEffect(() => {
    // updateData && urlImageRender(updateData?.timeline_info?.medias);
    updateData && formatUpdateData();
    eventId && getEventData();
  }, [formatUpdateData]);

  const submitOpenAttendance = useCallback(() => {
    setLoading(true);
    let error = false;

    const obj = {
      scheduleServiceId: data?.scheduleServiceId,
      resume: data?.resume,
      protocol: body,
      internalObservation: data?.internalObservation,
    };

    eventId ? (obj.scheduleId = eventId) : (obj.patientId = petId);

    attendanceService
      .openAttendance(obj)
      .then((res) => {
        setData({});
        setVisible(false);
        queryClient.invalidateQueries({
          queryKey: ["LastUpdates", router.query.id],
        });
        return notification.success({
          message: "Atendimento criado com sucesso!",
        });
      })
      .catch((_err) => {
        error = true;
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao criar um atendimento",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [data, body]);

  const submitUpdateAttendance = useCallback(() => {
    setLoading(true);
    attendanceService
      .updateAttendance(updateData?.timeline_info?.attendance?.id, {
        resume: data?.resume,
        protocol: body,
        internalObservation: data?.internalObservation,
      })
      .then(async (_res) => {
        await queryClient.invalidateQueries({
          queryKey: ["LastUpdates", patientId],
        });

        return notification.success({
          message: "Consulta atualizada com sucesso!",
        });
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Verifique os campos informados",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [updateData, data, body]);

  const submitPatientEvaluation = useCallback(() => {
    setLoading(true);
    const formData = new FormData();

    let error = false;

    formData.append("tag", petId);
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
        queryClient.invalidateQueries({
          queryKey: ["LastUpdates", router.query.id],
        });
        notification.success({ message: "Avaliação registrada com sucesso!" });
      })
      .catch((err) => {
        error = true;
        setLoading(false);
        return notification.error({
          message: "Verifique os campos informados",
        });
      })
      .finally(() => {
        setLoading(false);
        if (!error) {
          setData({});
          close((prv) => {
            if (prv?.budget) {
              return { ...prv, addAttendance: false };
            }
            return false;
          });
          setFileList([]);
          setBody("");
        }
      });
  }, [petId, data, body, user, fileList]);

  const submitUpdatePatientEvaluation = useCallback(() => {
    setLoading(true);
    const formData = new FormData();

    let error = false;

    formData.append("tag", petId);
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
      .updatePatientEvaluation(updateData?.id || data?.tlId, formData)
      .then((res) =>
        notification.success({ message: "Avaliação registrada com sucesso!" })
      )
      .catch((_err) => {
        error = true;
        setLoading(false);
        return notification.error({
          message: "Verifique os campos informados",
        });
      })
      .finally(() => {
        setLoading(false);
        if (!error) {
          setData({});
          setFileList([]);
          setBody("");
        }
      });
  }, [petId, data, body, user, fileList, updateData]);

  const removeData = (id) => {
    setLoading(true);
    timelineService
      .removeComplete(id)
      .then((_res) => {
        setLoading(false);
        return notification.success({
          message: "Registro removido com sucesso!",
        });
      })
      .catch((_err) => {
        setLoading(false);
      });
  };

  return modal ? (
    <FormChild
      patient={patient}
      loading={loading}
      data={data}
      setData={setData}
      setVisible={setVisible}
      body={body}
      setBody={setBody}
      eventId={eventId}
      submit={
        systemName === "LiftOne"
          ? created
            ? submitUpdatePatientEvaluation
            : submitPatientEvaluation
          : submitOpenAttendance
      }
      scheduleData={scheduleData}
      beforeUpload={beforeUpload}
      fileList={fileList}
      setFileList={setFileList}
      replaceText={replaceText}
      setCreated={setCreated}
      created={created}
    />
  ) : (
    <FormChild
      patient={patient}
      loading={loading}
      replaceText={replaceText}
      data={data}
      setData={setData}
      setVisible={setVisible}
      body={body}
      setBody={setBody}
      submit={
        systemName === "LiftOne"
          ? submitUpdatePatientEvaluation
          : submitUpdateAttendance
      }
      modal={false}
      update={true}
      beforeUpload={beforeUpload}
      fileList={fileList}
      setFileList={setFileList}
      remove={() => removeData(updateData?._id)}
    />
  );
}

export default AttendanceForm;
