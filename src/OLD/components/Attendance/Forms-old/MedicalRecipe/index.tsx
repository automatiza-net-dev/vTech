//@ts-nocheck
import React, { useState, useEffect, useCallback } from "react";

import moment from "moment";
import { useRouter } from "next/router";
import { useToast } from "infinity-forge";
import { useQueryClient } from "infinity-forge";

import { RemoteChangeStatus } from "@/data";
import { container, patientTypes } from "@/container";

import { recipeServices } from "@/OLD/services/recipes.service";
import { timelineService } from "@/OLD/services/timeline.service";
import { textReplaceService } from "@/OLD/services/textReplace.service";

import {
  useLoadPatient,
  useMe,
  useLoadAllScheduleStatuses,
} from "@/presentation/hooks";

import FormChild from "./FormChild";
import { useConfigurationsSystem } from "@/presentation";

function AddMedicalRecipe({
  modal,
  setModal,
  setSelectedUpdate = false,
  updateData = false,
  reloadSchedule,
}: any) {
  const [body, setBody] = useState("");
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipeId, setRecipeId] = useState(false);
  const [recipeSearch, setRecipeSearch] = useState("");

  const userInfo = useMe();
  const router = useRouter();
  const patient = useLoadPatient();
  const { createToast } = useToast();
  const scheduleStatuses = useLoadAllScheduleStatuses();

  const { type } = useConfigurationsSystem()

  const { refetch } = useQueryClient();

  const replaceText = (str, setState) => {

    setLoading(true);
    textReplaceService
      .replaceText({
        base: str,
        businessUnitId: userInfo?.data?.unit?.id,
        userId: userInfo?.data?.id,
        tutorId: type === "Vet"
          ? patient?.data?.tutor?.id
          : patient?.data?.id,
        dependentId: type === "Vet" ? patient?.data?.id : undefined,
      })
      .then((res) => setState(res.data.result))
      .finally(() => setLoading(false));
  };

  const getAllRecipes = useCallback(() => {
    setLoading(true);
    recipeServices
      .getAll()
      .then((res) => setAllRecipes(res.data))
      .catch((_err) => {
        setLoading(false);
        return createToast({
          message: "Houve um erro ao buscar os modelos de receitas",
          status: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getAllRecipes();
  }, [modal, getAllRecipes]);

  useEffect(() => {
    updateData && setBody(updateData?.timeline_info?.recipe);
    updateData &&
      allRecipes.length > 0 &&
      setRecipeId(
        allRecipes.find(
          (item) => item.title === updateData?.timeline_info?.name
        )?.id
      );
  }, [updateData, allRecipes]);

  const submit = useCallback(() => {
    if (!recipeId) {
      return createToast({ message: "Selecione uma receita", status: "error" });
    }

    setLoading(true);
    timelineService
      .insertRecipe({
        tag: patient?.data?.id,
        name: allRecipes.find((item) => item.id === recipeId)?.title,
        recipe: body,
        realizedAt: moment(new Date()),
        technicianId: userInfo?.data?.id,
      })
      .then((_res) => {
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

        setModal(false);
        setLoading(false);
        setBody("");
        setRecipeId(false);
        setRecipeSearch("");
        refetch(["LastUpdates", patient.data?.id])

        return createToast({
          message: "Receita salva com sucesso!",
          status: "success",
        });
      })
      .catch((_err) => {
        setLoading(false);
        return createToast({
          message: "houve um erro ao salvar a receita...",
          status: "error",
        });
      });
  }, [patient?.data?.id, recipeId, userInfo, body]);

  const submitUpdate = useCallback(() => {
    setLoading(true);
    timelineService
      .updateMedicalRecipe(updateData?._id, {
        tag: patient?.data?.id,
        name: allRecipes.find((item) => item.id === recipeId)?.title,
        recipe: body,
        realizedAt: moment(new Date()),
        technicianId: userInfo?.data?.id,
      })
      .then((_res) => {
        refetch(["LastUpdates", patient.data?.id])
        return createToast({
          message: "Receita atualizada com sucesso!",
          status: "success",
        });
      })
      .catch((_err) => {
        setLoading(false);
        return createToast({
          message: "Houve um erro ao atualizar a receita...",
          status: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [updateData, patient?.data?.id, recipeId, userInfo, body]);

  const submitUpdatePrint = useCallback(() => {
    setLoading(true);
    timelineService
      .updateMedicalRecipe(updateData?._id, {
        tag: patient?.data?.id,
        name: allRecipes.find((item) => item.id === recipeId)?.title,
        recipe: body,
        realizedAt: moment(new Date()),
        technicianId: userInfo?.data?.id,
      })
      .then((_res) => {
        refetch(["LastUpdates", patient.data?.id])
        setLoading(false);
        setModal && setModal(false);
        return createToast({
          message: "Receita atualizada com sucesso!",
          status: "success",
        });
      })
      .catch((_err) => {
        setLoading(false);
        return createToast({
          message: "Houve um erro ao atualizar a receita...",
          status: "error",
        });
      });
  }, [updateData, patient?.data?.id, recipeId, userInfo, body]);

  const removeData = (id) => {
    setLoading(true);
    timelineService
      .removeComplete(id)
      .then((_res) => {
        setLoading(false);

        refetch(["LastUpdates", patient.data?.id])
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
      submit={submit}
      recipeId={recipeId}
      allRecipes={allRecipes}
      body={body}
      realizedAt={updateData?.timeline_info?.realizedAt}
      setBody={setBody}
      loading={loading}
      setRecipeId={setRecipeId}
      modal={modal}
      setVisible={setModal}
      replaceText={replaceText}
      recipeSearch={recipeSearch}
      setRecipeSearch={setRecipeSearch}
      submitUpdatePrint={submit}
    />
  ) : (
    <FormChild
      patient={patient.data}
      submit={submitUpdate}
      recipeId={recipeId}
      allRecipes={allRecipes}
      body={body}
      realizedAt={updateData?.timeline_info?.realizedAt}
      setBody={setBody}
      loading={loading}
      setRecipeId={setRecipeId}
      modal={modal}
      setVisible={setModal}
      replaceText={replaceText}
      submitUpdatePrint={submitUpdatePrint}
      recipeSearch={recipeSearch}
      setRecipeSearch={setRecipeSearch}
      remove={() => removeData(updateData?._id)}
    />
  );
}

export default AddMedicalRecipe;
