import React, { useState, useCallback, useEffect } from "react";

import moment from "moment";

import FormChild from "./FormChild";

import { pathologiesServices } from "@/OLD/services/pathologies.service";
import { timelineService } from "@/OLD/services/timeline.service";
import { useLoadPatient } from "@/presentation/hooks";

import { useProfile } from "@/OLD/hooks/useProfile";
import { useRouter } from "next/router";

import { useToast } from "infinity-forge";
import { useQueryClient } from "infinity-forge";

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
  const { createToast } = useToast();

  const patient = useLoadPatient();

  const {refetch} = useQueryClient();
  const router = useRouter();

  const getAllPathologies = useCallback(() => {
    setLoading(true);
    pathologiesServices
      .getAll()
      .then((res) => setAllPathologies(res.data))
      .catch((_err) => {
        setLoading(false);
        return createToast({
          message: "Não foi possível buscar as patologias cadastradas...",
          status: "error",
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
      return createToast({
        message: "Selecione uma patologia",
        status: "error",
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

        await refetch(["LastUpdates", router.query.id])

        createToast({
          message: "Patologia salva com sucesso!",
          status: "success",
        });
      })
      .catch((_err) => {
        setLoading(false);
        return createToast({
          message: "Houve um erro ao salvar a patologia...",
          status: "error",
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
        await refetch(["LastUpdates", router.query.id])
        return createToast({
          message: "Patologia atualizada com sucesso!",
          status: "success",
        });
      })
      .catch((_err) => {
        setLoading(false);
        return createToast({
          message: "Houve um erro ao atualizar o registro de patologia",
          status: "error",
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
     await refetch(["LastUpdates", router.query.id])
        return createToast({
          message: "Registro removido com sucesso!",
          status: "success",
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
      realizedAt={updateData?.timeline_info.realizedAt}
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
      realizedAt={updateData?.timeline_info.realizedAt}
    />
  );
}

export default Patologies;
