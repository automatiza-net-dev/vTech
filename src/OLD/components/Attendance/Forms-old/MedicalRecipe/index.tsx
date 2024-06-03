// @ts-nocheck
// Core
import React, { memo, useState, useEffect, useCallback } from "react";
import { useProfile } from "@/OLD/hooks/useProfile";

// Components
import { Modal, notification } from "antd";
import FormChild from "./FormChild";

// Services
import { recipeServices } from "@/OLD/services/recipes.service";
import { timelineService } from "@/OLD/services/timeline.service";
import { textReplaceService } from "@/OLD/services/textReplace.service";

// Utils
import moment from "moment";

function AddMedicalRecipe({
  visible,
  setVisible,
  patient,
  reload,
  setReload,
  setSelectedUpdate = false,
  modal = true,
  updateData = false
}) {
  const [body, setBody] = useState("");
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipeId, setRecipeId] = useState(false);
  const [recipeSearch, setRecipeSearch] = useState("");
  const { user, clinic } = useProfile();

  const systemName = process.env.clientName;

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
        dependentId: patient?.id
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
        return notification.error({
          message: "Houve um erro ao buscar os modelos de receitas"
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    (visible || !modal) && getAllRecipes();
  }, [visible, getAllRecipes]);

  useEffect(() => {
    updateData && setBody(updateData?.timeline_info?.recipe);
    updateData &&
      allRecipes.length > 0 &&
      setRecipeId(
        allRecipes.find(
          (item) => item.title === updateData?.timeline_info?.name
        )?.id
      );
  }, [updateData, allRecipes, reload]);

  const submit = useCallback(() => {
    if (!recipeId) {
      return notification.error({
        message: "Selecione uma receita"
      });
    }

    setLoading(true);
    timelineService
      .insertRecipe({
        tag: patient?.id,
        name: allRecipes.find((item) => item.id === recipeId)?.title,
        recipe: body,
        realizedAt: moment(new Date()),
        technicianId: user?.id
      })
      .then((_res) =>
        notification.success({
          message: "Receita salva com sucesso!"
        })
      )
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "houve um erro ao salvar a receita..."
        });
      })
      .finally(() => {
        setVisible(false);
        setLoading(false);
        setBody("");
        setRecipeId(false);
        setReload(!reload);
        setRecipeSearch("");
      });
  }, [patient?.id, recipeId, user?.id, body]);

  const submitUpdate = useCallback(() => {
    setLoading(true);
    timelineService
      .updateMedicalRecipe(updateData?.id, {
        tag: patient?.id,
        name: allRecipes.find((item) => item.id === recipeId)?.title,
        recipe: body,
        realizedAt: moment(new Date()),
        technicianId: user?.id
      })
      .then((_res) =>
        notification.success({
          message: "Receita atualizada com sucesso!"
        })
      )
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao atualizar a receita..."
        });
      })
      .finally(() => {
        setLoading(false);
        setSelectedUpdate({});
        setReload(!reload);
      });
  }, [updateData, patient?.id, recipeId, user?.id, body]);

  const submitUpdatePrint = useCallback(() => {
    setLoading(true);
    timelineService
      .updateMedicalRecipe(updateData?.id, {
        tag: patient?.id,
        name: allRecipes.find((item) => item.id === recipeId)?.title,
        recipe: body,
        realizedAt: moment(new Date()),
        technicianId: user?.id
      })
      .then((_res) => {
        notification.success({
          message: "Receita atualizada com sucesso!"
        });
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao atualizar a receita..."
        });
      })
      .finally(() => {
        setLoading(false);
        setReload(!reload);
        modal && setVisible(false);
      });
  }, [updateData, patient?.id, recipeId, user?.id, body]);

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
      title={`Lançamento de receita médica - ${
        systemName === "LiftOne" ? "Cliente" : "Paciente"
      }: ${patient?.name}`}
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={1000}
    >
      <FormChild
        patient={patient}
        submit={submit}
        recipeId={recipeId}
        allRecipes={allRecipes}
        body={body}
        setBody={setBody}
        loading={loading}
        setRecipeId={setRecipeId}
        modal={modal}
        setVisible={setVisible}
        replaceText={replaceText}
        recipeSearch={recipeSearch}
        setRecipeSearch={setRecipeSearch}
        submitUpdatePrint={submit}
      />
    </Modal>
  ) : (
    <FormChild
      patient={patient}
      submit={submitUpdate}
      recipeId={recipeId}
      allRecipes={allRecipes}
      body={body}
      setBody={setBody}
      loading={loading}
      setRecipeId={setRecipeId}
      modal={modal}
      setVisible={setVisible}
      replaceText={replaceText}
      submitUpdatePrint={submitUpdatePrint}
      recipeSearch={recipeSearch}
      setRecipeSearch={setRecipeSearch}
      remove={() => removeData(updateData?._id)}
    />
  );
};

export default AddMedicalRecipe;
