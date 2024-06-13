// @ts-nocheck
import React, { useEffect } from "react";

import { Button, AutoComplete, Popconfirm } from "antd";

import Editor from "@/OLD/components/Editor";
import { sortItems } from "@/OLD/utils/sortItems";
import Print from "@/OLD/components/mini-components/Print";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { Select, FormHandler } from "infinity-forge";

function FormChild({
  submit,
  recipeId,
  allRecipes,
  body,
  setBody,
  loading,
  setRecipeId,
  modal,
  setVisible,
  replaceText,
  submitUpdatePrint,
  recipeSearch,
  setRecipeSearch,
  patient,
  remove,
}) {
  useEffect(() => {
    if (!modal && recipeId) {
      setRecipeSearch(
        allRecipes?.find((recipe) => recipe?.id === recipeId)?.description
      );
    }
  }, [modal, recipeId]);

  sortItems(allRecipes, "description");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div>
        <label>Receita Médica</label>
        <FormHandler>
          <Select
            menuPlacement="bottom"
            name="exam"
            options={allRecipes.map((recipe) => ({
              label: recipe?.description,
              value: recipe?.id,
            }))}
            disabled={!modal}
            onlyOneValue
            onChangeSelect={async (value) => {
              const selectedRecipe = allRecipes.find(
                (recipe) => recipe.id === value
              );

              setRecipeSearch(selectedRecipe?.description);
              setRecipeId(selectedRecipe?.id);
              replaceText(selectedRecipe?.template, setBody);
            }}
          />
        </FormHandler>
      </div>
      <div className="uk-margin-top">
        <Editor editorState={body} setEditorState={setBody} />
      </div>
      <footer className="uk-margin-top uk-flex uk-flex-around">
        <Print
          patient={patient}
          content={typeof body === "string" ? body : ""}
          triggerComponent={<Button>Imprimir</Button>}
          onBeforePrint={() => {
            submitUpdatePrint && submitUpdatePrint();
          }}
          string={true}
        />
        {modal ? (
          <>
            <Button type="primary" htmlType="submit" loading={loading}>
              Salvar
            </Button>
            <Button onClick={() => setVisible(false)}>Cancelar</Button>
          </>
        ) : (
          <div className="uk-margin-top uk-flex uk-flex-right">
            <Popconfirm
              title="Deseja remover este registro?"
              onConfirm={() => remove()}
            >
              <Button
                loading={loading}
                htmlType="button"
                type="danger"
                className="uk-margin-small-right"
              >
                Excluir
              </Button>
            </Popconfirm>
            <Button type="primary" htmlType="submit">
              Atualizar
            </Button>
          </div>
        )}
      </footer>
    </form>
  );
}

export default FormChild;
