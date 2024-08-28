// @ts-nocheck
import React, { useEffect } from "react";

import { AutoComplete, Popconfirm } from "antd";

import Editor from "@/OLD/components/Editor";
import { sortItems } from "@/OLD/utils/sortItems";
import Print from "@/OLD/components/mini-components/Print";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { Select, FormHandler, Button } from "infinity-forge";

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
    <FormHandler isStickyButtons>
      <div>
        {modal ? (
          <>
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
          </>
        ) : (
          <h3>{recipeSearch}</h3>
        )}
      </div>
      <div className="uk-margin-top">
        <Editor editorState={body} setEditorState={setBody} />
      </div>
      <footer
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Print
          patient={patient}
          content={typeof body === "string" ? body : ""}
          triggerComponent={
            <Button
              text="Imprimir"
              type="button"
              style={{ marginRight: "10px" }}
            />
          }
          onBeforePrint={() => {
            submitUpdatePrint && submitUpdatePrint();
          }}
          string={true}
        />
        {modal ? (
          <>
            <Button
              onClick={submit}
              loading={loading}
              text="Salvar"
              style={{ marginRight: "10px" }}
            />

            <Button
              onClick={() => setVisible(false)}
              type="button"
              text="Cancelar"
              style={{ backgroundColor: "#ff7b5a" }}
            />
          </>
        ) : (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={submit}
              text="Atualizar"
              loading={loading}
              style={{ marginRight: "10px" }}
            />
            <Popconfirm
              title="Deseja remover este registro?"
              onConfirm={() => remove()}
            >
              <Button
                loading={loading}
                type="button"
                text="Excluir"
                style={{ backgroundColor: "#ff7b5a" }}
              />
            </Popconfirm>
          </div>
        )}
      </footer>
    </FormHandler>
  );
}

export default FormChild;
