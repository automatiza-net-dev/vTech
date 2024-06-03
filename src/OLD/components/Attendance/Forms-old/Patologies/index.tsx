// @ts-nocheck
// Core
import React, { memo, useState, useCallback, useEffect } from "react";

// Utils
import moment from "moment";

// Components
import { Modal, notification } from "antd";
import FormChild from "./FormChild";

// Services
import { pathologiesServices } from "@/OLD/services/pathologies.service";
import { timelineService } from "@/OLD/services/timeline.service";

// Hooks
import { useProfile } from "@/OLD/hooks/useProfile";

const Patologies = memo(function Patologies({
  visible,
  setVisible,
  patient,
  reload,
  setReload,
  setSelectedUpdate = false,
  modal = true,
  updateData = false
}) {
  const [data, setData] = useState({});
  const [allPathologies, setAllPathologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [defaultProtocol, setDefaultProtocol] = useState("");
  const { user } = useProfile();

  const systemName = process.env.clientName;

  const getAllPathologies = useCallback(() => {
    setLoading(true);
    pathologiesServices
      .getAll()
      .then((res) => setAllPathologies(res.data))
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Não foi possível buscar as patologias cadastradas..."
        });
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    (visible || !modal) && getAllPathologies();
  }, [visible, getAllPathologies]);

  useEffect(() => {
    updateData &&
      setData({
        pathology: updateData?.timeline_info?.pathology,
        description: updateData?.timeline_info?.description
      });
    setDefaultProtocol(updateData?.timeline_info?.defaultProtocol);
  }, [updateData]);

  const submit = useCallback(() => {
    if (!data?.pathology) {
      return notification.error({
        message: "Selecione uma patologia"
      });
    }

    setLoading(true);
    timelineService
      .insertPatology({
        pathology: data?.pathology,
        tag: patient.id,
        realizedAt: moment(new Date()),
        technicianId: user?.id,
        description: data?.description,
        defaultProtocol
      })
      .then((_res) =>
        notification.success({ message: "Patologia salva com sucesso!" })
      )
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao salvar a patologia..."
        });
      })
      .finally(() => {
        setData({});
        setLoading(false);
        setVisible(false);
        setReload(!reload);
      });
  }, [data, patient?.id, user?.id, defaultProtocol]);

  const submitUpdate = useCallback(() => {
    setLoading(false);
    timelineService
      .updatePathology(updateData?.id, {
        pathology: data?.pathology,
        tag: patient.id,
        realizedAt: moment(new Date()),
        technicianId: user?.id,
        description: data?.description,
        defaultProtocol
      })
      .then((_res) =>
        notification.success({
          message: "Patologia atualizada com sucesso!"
        })
      )
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao atualizar o registro de patologia"
        });
      })
      .finally(() => {
        setData({});
        setSelectedUpdate(false);
        setReload(!reload);
      });
  }, [data, patient?.id, updateData?.id, user?.id, defaultProtocol]);

  const removeData = (id) => {
    setLoading(true);
    timelineService
      .removeComplete(id)
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        return notification.success({
          message: "Registro removido com sucesso!"
        });
      })
      .catch((_err) => {
        setLoading(false);
      });
  };

  return modal ? (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      title={`Lançamento de patologia - ${
        systemName === "LiftOne" ? "Cliente" : "Paciente"
      }: ${patient?.name}`}
      footer={null}
      width={1000}
    >
      <FormChild
        patient={patient}
        data={data}
        setData={setData}
        allPathologies={allPathologies}
        loading={loading}
        submit={submit}
        modal={modal}
        defaultProtocol={defaultProtocol}
        setDefaultProtocol={setDefaultProtocol}
        setVisible={setVisible}
        print={submit}
      />
    </Modal>
  ) : (
    <FormChild
      patient={patient}
      data={data}
      setData={setData}
      allPathologies={allPathologies}
      loading={loading}
      submit={submitUpdate}
      modal={modal}
      defaultProtocol={defaultProtocol}
      setDefaultProtocol={setDefaultProtocol}
      print={submitUpdate}
      remove={() => removeData(updateData?._id)}
    />
  );
});

export default Patologies;
