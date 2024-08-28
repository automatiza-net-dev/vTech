// @ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { useProfile } from "@/OLD/hooks/useProfile";

import FormChild from "./FormChild";
import { useToast } from "infinity-forge";

import { recipeServices } from "@/OLD/services/recipes.service";
import { timelineService } from "@/OLD/services/timeline.service";
import { textReplaceService } from "@/OLD/services/textReplace.service";

import { useLoadPatient } from "@/presentation/hooks";

import moment from "moment";
import { useQueryClient } from "react-query";

function AddMedicalRecipe({
  modal,
  setModal,
  setSelectedUpdate = false,
  updateData = false,
}: any) {
  const [body, setBody] = useState("");
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipeId, setRecipeId] = useState(false);
  const [recipeSearch, setRecipeSearch] = useState("");
  const { user, clinic } = useProfile();
  const { createToast } = useToast();
  const patient = useLoadPatient();

  const systemName = process.env.clientName;

  const queryClient = useQueryClient();

  const replaceText = (str, setState) => {
    setLoading(true);
    textReplaceService
      .replaceText({
        base: str,
        businessUnitId: clinic?.id,
        userId: user?.id,
        tutorId:
          systemName !== "LiftOne"
            ? patient?.data?.tutor?.id
            : patient?.data?.id,
        dependentId: patient?.data?.id,
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
        technicianId: user?.id,
      })
      .then((_res) => {
        setModal(false);
        setLoading(false);
        setBody("");
        setRecipeId(false);
        setRecipeSearch("");
        queryClient.invalidateQueries({
          queryKey: ["LastUpdates", patient.data?.id],
        });
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
  }, [patient?.data?.id, recipeId, user?.id, body]);

  const submitUpdate = useCallback(() => {
    setLoading(true);
    timelineService
      .updateMedicalRecipe(updateData?._id, {
        tag: patient?.data?.id,
        name: allRecipes.find((item) => item.id === recipeId)?.title,
        recipe: body,
        realizedAt: moment(new Date()),
        technicianId: user?.id,
      })
      .then((_res) => {
        queryClient.invalidateQueries({
          queryKey: ["LastUpdates", patient.data?.id],
        });
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
  }, [updateData, patient?.data?.id, recipeId, user?.id, body]);

  const submitUpdatePrint = useCallback(() => {
    setLoading(true);
    timelineService
      .updateMedicalRecipe(updateData?._id, {
        tag: patient?.data?.id,
        name: allRecipes.find((item) => item.id === recipeId)?.title,
        recipe: body,
        realizedAt: moment(new Date()),
        technicianId: user?.id,
      })
      .then((_res) => {
        queryClient.invalidateQueries({
          queryKey: ["LastUpdates", patient.data?.id],
        });
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
  }, [updateData, patient?.data?.id, recipeId, user?.id, body]);

  const removeData = (id) => {
    setLoading(true);
    timelineService
      .removeComplete(id)
      .then((_res) => {
        setLoading(false);

        queryClient.invalidateQueries({
          queryKey: ["LastUpdates", patient.data?.id],
        });
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
