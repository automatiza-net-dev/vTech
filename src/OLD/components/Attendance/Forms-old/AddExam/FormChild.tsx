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
import {
  Button,
  Input,
  DatePicker,
  Upload,
  AutoComplete,
  Popconfirm,
  notification,
} from "antd";
import { Container } from "./styles";
import { Button as ButtonA } from "@/OLD/components/mini-components/Button";
import Editor from "@/OLD/components/Editor";
import Print from "@/OLD/components/mini-components/Print";

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

  const beforeUpload = useCallback((file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (isJpgOrPng) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        return notification.error({
          message: "Você só pode upar imagens até 2MB!",
        });
      }
    }

    return true;
  }, []);

  sortItems(allExams, "name");

  return (
    <Container>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          examPatientData ? submitUpdatePatientExam() : submitExamLauching();
        }}
      >
        {!modal && (
          <div className="uk-flex uk-flex-right">
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              className="uk-margin-small-right"
            >
              Atualizar
            </Button>
            <Popconfirm
              title="Tem certeza que deseja remover este registro?"
              onConfirm={() => remove(examPatientData?.timelineId)}
            >
              <Button loading={loading} type="primary" htmlType="button">
                Excluir
              </Button>
            </Popconfirm>
          </div>
        )}
        <div>
          <label>Exame</label>
          <br />
          <AutoComplete
            disabled={examPatientData}
            className="uk-width-1-1"
            options={allExams.map((exam) => ({
              ...exam,
              value: exam?.name,
            }))}
            value={examSearch}
            onChange={(val) => {
              setExamSearch(val);
            }}
            onSelect={(val, opt) => {
              setExamSearch(opt?.name);
              setData({ ...data, examId: opt?.id });
              setSelectedExam(opt);
              replaceText(opt?.description, setRequest);
            }}
            filterOption={(val, opt) =>
              normalizeStr(opt?.name?.toUpperCase()).includes(
                normalizeStr(val?.toUpperCase())
              )
            }
          />
          {data?.examId && (
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
                    defaultValue={moment(new Date())}
                    disabled={examPatientData}
                    format={"DD/MM/YYYY"}
                    value={data?.realizedAt}
                    onChange={(e) => setData({ ...data, realizedAt: e })}
                  />
                </div>
              </div>
              <div className="uk-flex uk-flex-around uk-margin-top">
                <p className="uk-margin-remove">Solicitação</p>
                <p className="uk-margin-remove">Laudo | Conclusões</p>
              </div>
              <div className="uk-flex">
                <div className="uk-width-1-1 uk-margin-small-right">
                  <Editor editorState={request} setEditorState={setRequest} />
                  <Print
                    patient={patient.data}
                    triggerComponent={
                      <Button
                        className="uk-margin-right uk-margin-top"
                        type="primary"
                      >
                        Imprimir Solicitação
                      </Button>
                    }
                    content={typeof request === "string" ? request : ""}
                    title={
                      allExams.find((item) => item?.id === data?.examId)?.name
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
                      patient={patient}
                      triggerComponent={
                        <Button
                          className="uk-margin-right uk-margin-top"
                          type="primary"
                        >
                          Imprimir Laudo
                        </Button>
                      }
                      content={typeof report === "string" ? report : ""}
                      title={
                        allExams.find((item) => item?.id === data?.examId)?.name
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
                    <ButtonA>
                      <PlusOutline size={15} className="upload-icon" />{" "}
                      Adicionar anexos
                    </ButtonA>
                  </Upload>
                </div>
                <div className="">
                  <ButtonA onClick={() => setPhotosOpen(true)}>
                    <BsPaperclip size={15} /> Visualizar Arquivos anexados{" "}
                  </ButtonA>
                </div>
              </div>
            </div>
          )}
        </div>
        {modal && (
          <footer className="uk-margin-top">
            <hr />
            <div className="uk-flex uk-flex-right">
              <Button
                type="primary"
                htmlType="submit"
                className="uk-margin-small-right"
                loading={loading}
              >
                Salvar
              </Button>
              <Button
                onClick={() => {
                  setVisible(false);
                  setSelectedExam({});
                  setFileList([]);
                  setData({});
                  setVisible(false);
                  setReport("");
                  setRequest("");
                }}
              >
                {" "}
                Cancelar{" "}
              </Button>
            </div>
          </footer>
        )}
      </form>
    </Container>
  );
}
