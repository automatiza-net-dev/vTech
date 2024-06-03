import React, { useState, useCallback, useEffect } from "react";

import moment from "moment";

import { notification } from "antd";
import FormChild from "./FormChild";

import { pathologiesServices } from "@/OLD/services/pathologies.service";
import { timelineService } from "@/OLD/services/timeline.service";
import { useLoadPatient } from "@/presentation/hooks";

import { useProfile } from "@/OLD/hooks/useProfile";
import { useQueryClient } from "react-query";
import { useRouter } from "next/router";

function Patologies({
  modal,
  setModal,
  setSelectedUpdate = false,
  updateData = false,
}: any) {
  const [data, setData] = useState<any>({});
  const [allPathologies, setAllPathologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [defaultProtocol, setDefaultProtocol] = useState("");
  const { user } = useProfile();

  const patient = useLoadPatient();

  const queryClient = useQueryClient();
  const router = useRouter();

  const getAllPathologies = useCallback(() => {
    setLoading(true);
    pathologiesServices
      .getAll()
      .then((res) => setAllPathologies(res.data))
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Não foi possível buscar as patologias cadastradas...",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getAllPathologies();
  }, [getAllPathologies]);

  useEffect(() => {
    updateData &&
      setData({
        pathology: updateData?.timeline_info?.pathology,
        description: updateData?.timeline_info?.description,
      });
    setDefaultProtocol(updateData?.timeline_info?.defaultProtocol);
  }, [updateData]);

  const submit = useCallback(() => {
    if (!data?.pathology) {
      return notification.error({
        message: "Selecione uma patologia",
      });
    }

    setLoading(true);
    timelineService
      .insertPatology({
        pathology: data?.pathology,
        tag: patient.data?.id,
        realizedAt: moment(new Date()),
        technicianId: user?.id,
        description: data?.description,
        defaultProtocol,
      })
      .then(async (_res) => {
        await queryClient.invalidateQueries({
          queryKey: ["LastUpdates", router.query.id],
        });

        notification.success({ message: "Patologia salva com sucesso!" });
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao salvar a patologia...",
        });
      })
      .finally(() => {
        setData({});
        setLoading(false);
        setModal(false);
      });
  }, [data, patient?.data?.id, user?.id, defaultProtocol]);

  const submitUpdate = useCallback(() => {
    setLoading(false);
    timelineService
      .updatePathology(updateData?._id, {
        pathology: data?.pathology,
        tag: patient.data?.id,
        realizedAt: moment(new Date()),
        technicianId: user?.id,
        description: data?.description,
        defaultProtocol,
      })
      .then(async (_res) => {
        await queryClient.invalidateQueries({
          queryKey: ["LastUpdates", router.query.id],
        });

        notification.success({
          message: "Patologia atualizada com sucesso!",
        });
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao atualizar o registro de patologia",
        });
      })
      .finally(() => {
        setData({});
      });
  }, [data, patient?.data?.id, updateData?.id, user?.id, defaultProtocol]);

  const removeData = (id) => {
    setLoading(true);
    timelineService
      .removeComplete(id)
      .then(async (_res) => {
        setLoading(false);
        await queryClient.invalidateQueries({
          queryKey: ["LastUpdates", router.query.id],
        });
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
      patient={patient.data}
      data={data}
      setData={setData}
      allPathologies={allPathologies}
      loading={loading}
      submit={submit}
      modal={modal}
      defaultProtocol={defaultProtocol}
      setDefaultProtocol={setDefaultProtocol}
      setVisible={setModal}
      print={submit}
      remove={undefined}
    />
  ) : (
    <FormChild
      patient={patient.data}
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
      setVisible={undefined}
    />
  );
}

export default Patologies;
