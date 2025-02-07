// @ts-nocheck
// Core
import { useProfile } from "@/OLD/hooks/useProfile";
import { useCallback, useEffect, useState } from "react";

// Services
import { timelineService } from "@/OLD/services/timeline.service";

import { useLoadPatient } from "@/presentation";

// Utils
import moment from "moment";

// Components
import { Modal, notification } from "antd";
import FormChild from "./FormChild";
import { useToast } from "infinity-forge";

function WeightForm({
  visible,
  setVisible,
  type,
  setSelectedUpdate = false,
  modal = true,
  updateData = false,
}: any) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useProfile();
  const { data: patient } = useLoadPatient();

  const {createToast} = useToast()

  const systemName = process.env.clientName;

  useEffect(() => {
    updateData &&
      setData({
        weight:
          updateData?.timeline_info.weight ||
          updateData?.timeline_info.value ||
          updateData?.timeline_info.pressure,
        observation: updateData?.timeline_info.observation,
      });
  }, [updateData]);

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
        createToast({ status: "success", message: "Peso registrado com sucesso!", })
      )
      .catch((_err) => {
        setLoading(false);
        createToast({ status: "error", message: "Houve um erro ao registrar o peso informado...", })
      })
      .finally(() => {
        setLoading(false);
        setData({});
        setVisible(false);
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
      .then((_res) => {
        createToast({ status: "success", message: "Pressão arterial registrada com sucesso!", })
      }
    
      )
      .catch((_err) => {
        setLoading(false);
        createToast({ status: "error", message: "Houve um erro ao registrar a pressão informada...", })
      })
      .finally(() => {
        setLoading(false);
        setData({});
        setVisible(false);
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
      .then((_res) => {
        createToast({ status: "success", message: "Glicemia registrada com sucesso!", })
      }
      )
      .catch((_err) => {
        setLoading(false);
        createToast({ status: "error", message: "Houve um erro ao registrar a glicemia informada...", })
      })
      .finally(() => {
        setLoading(false);
        setData({});
        setVisible(false);
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
    {
      /*
    if (type === "Pressão arterial") {
      return updatePressure;
    }
  */
    }

    {
      /* if (type === "Glicemia") {
      return updateGlycemia;
    } */
    }

    if (type === "Peso") {
      return weightUpdate;
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
      .then((_res) => {
       
        createToast({ status: "success", message: "Peso atualizado com sucesso!", })
      }
      )
      .catch((_err) => {
        setLoading(false);
        createToast({ status: "error", message: "Houve um erro ao atualizar o peso informado...", })
      })
      .finally(() => {
        setLoading(false);
        setData({});
        setSelectedUpdate(false);
      });
  }, [data, updateData?.id]);

  return (
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
  );
}

export default WeightForm;
