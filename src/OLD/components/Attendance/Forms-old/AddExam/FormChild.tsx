// @ts-nocheck
// Core
import React, { memo, useCallback, useState, useEffect } from "react";

// Utils
import moment from "moment";
import { normalizeStr } from "@/OLD/utils/normalizeString";

// Icons
import { PlusOutline } from "styled-icons/evaicons-outline";
import { BsPaperclip } from "react-icons/bs";

// Components
import { Input, DatePicker, Upload, AutoComplete, Popconfirm } from "antd";
import { Container } from "./styles";
import Editor from "@/OLD/components/Editor";
import Print from "@/OLD/components/mini-components/Print";
import { Select, FormHandler, Button, useToast } from "infinity-forge";

import { sortItems } from "@/OLD/utils/sortItems";

export default function FormChild({
  loading,
  examPatientData,
  data,
  allExams,
  setData,
  selectedExam,
  request,
  setRequest,
  report,
  setReport,
  fileList,
  setSelectedExam,
  setFileList,
  submitExamLauching,
  setVisible,
  submitUpdatePatientExam,
  clinic,
  modal,
  patient,
  replaceText,
  examSearch,
  setExamSearch,
  setPhotosOpen,
  remove = false,
}: any) {
  useEffect(() => {
    if (data?.examId && !modal) {
      setExamSearch(allExams?.find((exam) => exam?.id === data?.examId)?.name);
    }
  }, [data?.examId, allExams, modal]);

  const { createToast } = useToast();

  const beforeUpload = useCallback((file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (isJpgOrPng) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        createToast({
          status: "error",
          message: "Você só pode upar imagens até 2MB!",
        });
      }
    }

    return true;
  }, []);

  sortItems(allExams, "name");

  return (
    <Container>
      <FormHandler isStickyButtons disableEnterKeySubmitForm>
        <div>
          {modal ? (
            <>
              <label>Exame</label>
              <br />
              {allExams && allExams.length > 0 && (
                <Select
                  menuPlacement="bottom"
                  name="exam"
                  options={allExams.map((exam) => ({
                    label: exam?.name,
                    value: exam?.id,
                  }))}
                  disabled={!modal}
                  onlyOneValue
                  onChangeInput={async (value) => {
                    const optionSelected = allExams?.find(
                      (exam) => exam.id === value
                    );

                    await replaceText(optionSelected?.description, setRequest);

                    setSelectedExam(optionSelected);
                    setExamSearch(optionSelected?.name);
                    setData({ ...data, examId: optionSelected?.id });
                  }}
                />
              )}
            </>
          ) : (
            <h2>{examSearch}</h2>
          )}

          <div>
            <div className="uk-margin-right uk-width-1-2 uk-flex uk-flex-between uk-margin-top">
              <div className="uk-width-1-3">
                <label>Laboratório</label>
                <Input
                  value={
                    !examPatientData
                      ? selectedExam?.own_laboratory
                        ? clinic?.fantasy_name
                        : data?.laboratory
                      : data?.laboratory
                  }
                  onChange={(e) =>
                    setData({ ...data, laboratory: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Data de solicitação</label>
                <br />
                <DatePicker
                  defaultValue={moment()}
                  disabled={examPatientData}
                  format={"DD/MM/YYYY"}
                  value={data?.requestedAt}
                  onChange={(e) => setData({ ...data, requestedAt: e })}
                />
              </div>

          {data?.createdAt &&    <div>
                <label>Data lançamento</label>
                <br />
                <DatePicker
                  disabled={true}
                  format={"DD/MM/YYYY"}
                  value={data?.createdAt}
                />
              </div>}
            </div>
            <div className="uk-flex uk-flex-around uk-margin-top">
              <p className="uk-margin-remove">Solicitação</p>
              <p className="uk-margin-remove">Laudo | Conclusões</p>
            </div>
            <div className="uk-flex">
              <div className="uk-width-1-1 uk-margin-small-right">
                <Editor editorState={request} setEditorState={setRequest} />
                <Print
                  title="Solicitação de Exame"
                  patient={patient.data}
                  triggerComponent={
                    <Button
                      className="uk-margin-right uk-margin-top"
                      text="Imprimir solicitação"
                    />
                  }
                  content={typeof request === "string" ? request : ""}
                  title={
                    <>
                      <h1>Solicitação de Exame</h1>
                      {allExams.find((item) => item?.id === data?.examId)?.name}
                    </>
                  }
                  string={true}
                  onBeforePrint={() =>
                    examPatientData
                      ? submitUpdatePatientExam(true)
                      : submitExamLauching(true)
                  }
                />
              </div>
              <div className="uk-width-1-1">
                <div className="editor-container uk-width-1-1">
                  <Editor editorState={report} setEditorState={setReport} />

                  <Print
                    patient={patient.data}
                    triggerComponent={
                      <Button
                        className="uk-margin-right uk-margin-top"
                        text="Imprimir laudo"
                      />
                    }
                    content={typeof report === "string" ? report : ""}
                    title={
                      <>
                        <h1>Laudo Exame</h1>
                        {
                          allExams.find((item) => item?.id === data?.examId)
                            ?.name
                        }
                      </>
                    }
                    string={true}
                    onBeforePrint={() =>
                      examPatientData
                        ? submitUpdatePatientExam(true)
                        : submitExamLauching(true)
                    }
                  />
                </div>
              </div>
            </div>
            <div className="uk-flex uk-flex-middle uk-flex-center uk-margin-top">
              <div className="uk-flex uk-flex-column uk-flex-middle">
                <Upload
                  name="pet-photos"
                  className="avatar-uploader uk-text-center"
                  multiple={true}
                  beforeUpload={beforeUpload}
                  showUploadList={false}
                  fileList={fileList}
                  onChange={(info) => {
                    setFileList(info.fileList);
                  }}
                >
                  <Button
                    style={{ marginRight: "10px" }}
                    text={
                      <>
                        <PlusOutline size={15} className="upload-icon" />{" "}
                        Adicionar Anexos
                      </>
                    }
                  />
                </Upload>
              </div>

              <div className="">
                <Button
                  onClick={() => setPhotosOpen(true)}
                  text={
                    <>
                      <BsPaperclip size={15} /> Visualizar Arquivos anexados
                    </>
                  }
                />
              </div>
            </div>
            {!modal && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "10px",
                }}
              >
                <Button
                  loading={loading}
                  onClick={submitUpdatePatientExam}
                  text="Atualizar"
                  style={{ marginRight: "10px" }}
                />

                <Popconfirm
                  title="Tem certeza que deseja remover este registro?"
                  onConfirm={() => remove(examPatientData?.timelineId)}
                >
                  <Button
                    loading={loading}
                    text="Excluir"
                    type="button"
                    style={{ backgroundColor: "#ff7b5a" }}
                  />
                </Popconfirm>
              </div>
            )}
          </div>
        </div>
        {modal && (
          <footer className="uk-margin-top">
            <hr />
            <div className="uk-flex uk-flex-right">
              <Button
                onClick={submitExamLauching}
                loading={loading}
                text="Salvar"
                style={{ marginRight: "10px" }}
              />

              <Button
                style={{ backgroundColor: "#ff7b5a" }}
                text="Cancelar"
                onClick={() => {
                  setVisible(false);
                  setSelectedExam({});
                  setFileList([]);
                  setData({});
                  setVisible(false);
                  setReport("");
                  setRequest("");
                }}
              />
            </div>
          </footer>
        )}
      </FormHandler>
    </Container>
  );
}
