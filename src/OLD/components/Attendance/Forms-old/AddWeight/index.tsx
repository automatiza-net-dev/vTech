// @ts-nocheck
// Core
import { useProfile } from "@/OLD/hooks/useProfile";
import { useCallback, useEffect, useState } from "react";

// Services
import { timelineService } from "@/OLD/services/timeline.service";

// Utils
import moment from "moment";

// Components
import { Modal, notification } from "antd";
import FormChild from "./FormChild";

function WeightForm({
  visible,
  setVisible,
  patient,
  reload,
  setReload,
  type,
  setSelectedUpdate = false,
  modal = true,
  updateData = false,
}) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useProfile();

  const systemName = process.env.clientName;

  useEffect(() => {
    updateData &&
      setData({
        weight: updateData?.weight || updateData?.value || updateData?.pressure,
        observation: updateData?.observation,
      });
  }, [updateData, reload]);

  const submitWeight = useCallback(() => {
    setLoading(true);
    timelineService
      .insertWeight({
        ...data,
        tag: patient.id,
        realizedAt: moment(new Date()),
        technicianId: user?.id,
        observation: data?.observation,
      })
      .then((_res) =>
        notification.success({
          message: "Peso registrado com sucesso!",
        })
      )
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao registrar o peso informado...",
        });
      })
      .finally(() => {
        setLoading(false);
        setData({});
        setVisible(false);
        setReload(!reload);
      });
  }, [data]);

  const submitPressure = useCallback(() => {
    setLoading(true);
    timelineService
      .insertPressure({
        ...data,
        pressure: data?.weight,
        tag: patient.id,
        realizedAt: moment(new Date()),
        technicianId: user?.id,
        observation: data?.observation,
      })
      .then((_res) =>
        notification.success({
          message: "Pressão arterial registrada com sucesso!",
        })
      )
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao registrar a pressão informada...",
        });
      })
      .finally(() => {
        setLoading(false);
        setData({});
        setVisible(false);
        setReload(!reload);
      });
  }, [data]);

  const submitGlycemia = useCallback(() => {
    setLoading(true);
    timelineService
      .insertGlycemia({
        ...data,
        value: data?.weight,
        tag: patient.id,
        realizedAt: moment(new Date()),
        technicianId: user?.id,
        observation: data?.observation,
      })
      .then((_res) =>
        notification.success({
          message: "Glicemia registrada com sucesso!",
        })
      )
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao registrar a glicemia informada...",
        });
      })
      .finally(() => {
        setLoading(false);
        setData({});
        setVisible(false);
        setReload(!reload);
      });
  }, [data]);

  const detectSubmit = () => {
    if (type === "Pressão arterial") {
      return submitPressure;
    }

    if (type === "Glicemia") {
      return submitGlycemia;
    }

    if (type === "Peso") {
      return submitWeight;
    }
  };

  const detectUpdate = () => {
    if (type === "Pressão arterial") {
      return updatePressure;
    }

    if (type === "Glicemia") {
      return updateGlycemia;
    }

    if (type === "Peso") {
      return updateWeight;
    }
  };

  const weightUpdate = useCallback(() => {
    setLoading(true);
    timelineService
      .updateWeight(updateData?.id, {
        ...data,
        tag: patient.id,
        realizedAt: moment(new Date()),
        technicianId: user?.id,
        observation: data?.observation,
      })
      .then((_res) =>
        notification.success({ message: "Peso atualizado com sucesso!" })
      )
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao atualizar o peso informado...",
        });
      })
      .finally(() => {
        setLoading(false);
        setData({});
        setReload(!reload);
        setSelectedUpdate(false);
      });
  }, [data, updateData?.id]);

  return modal ? (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      title={`Lançamento de ${type} - ${
        systemName === "LiftOne" ? "Cliente" : "Paciente"
      }: ${patient?.name}`}
      footer={null}
    >
      <FormChild
        submit={detectSubmit()}
        data={data}
        setData={setData}
        loading={loading}
        setLoading={setLoading}
        visible={visible}
        setVisible={setVisible}
        modal={modal}
        type={type}
      />
    </Modal>
  ) : (
    <FormChild
      submit={detectUpdate()}
      data={data}
      setData={setData}
      loading={loading}
      setLoading={setLoading}
      visible={visible}
      setVisible={setVisible}
      modal={modal}
      type={type}
    />
  );
}

export default WeightForm;
