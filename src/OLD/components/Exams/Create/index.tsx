// @ts-nocheck
// Core
import React, { useState, useCallback, memo } from "react";
import { useRouter } from "next/router";

// Hooks
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

// Services
import { examService } from "@/OLD/services/exams.service";

// Components
import { Input, Switch } from "antd";
import { Container } from "./styles";
import Editor from "@/OLD/components/Editor";
import { Button, PageWrapper, useToast } from "infinity-forge";
import LabelsPanel from "@/OLD/components/mini-components/LabelsPanel";
import AccessDenied from "@/OLD/components/AccessDenied";

const CreateExam = memo(function CreateExam() {
  const [data, setData] = useState({ ownLaboratory: false, active: true });
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState("");

  const router = useRouter();
  const canCreateExams = useUserHasPermission("EXA01");

  const {createToast} = useToast()

  const submitExam = useCallback(() => {
    setLoading(true);
    examService
      .createExam({ ...data, description: body })
      .then((_res) => {
        return createToast({ status: "success", message: "Exame cadastrado com sucesso!" })
      })
      .catch((err) => {
        error = true;
        return  createToast({ status: "success", message: err.response.data.errors[0].message })
      })
      .finally(() => {
        setLoading(false);
        router.back();
      });
  }, [data, body]);

  return !canCreateExams || canCreateExams === "loading" ? (
    <AccessDenied loading={canCreateExams} />
  ) : (
    <PageWrapper title="Cadasatrar exame">
      <Container>
        <hr />
        <div className="uk-flex">
          <div className="uk-width-5-6">
            <form
              className="uk-margin-top"
              onSubmit={(e) => {
                e.preventDefault();
                submitExam();
              }}
            >
              <div>
                <label>Nome Exame</label>
                <Input
                  value={data?.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  required
                />
              </div>
              <div className="uk-margin-top">
                <label>Tipo</label>
                <Input
                  value={data?.type}
                  onChange={(e) => setData({ ...data, type: e.target.value })}
                />
              </div>
              <div className="uk-margin-top">
                <label>Descrição</label>
                <Editor editorState={body} setEditorState={setBody} />
              </div>
              <div className="uk-margin-top uk-flex uk-flex-around">
                <div className="uk-flex uk-flex-column uk-flex-middle">
                  <label>Laboratório próprio</label>
                  <Switch
                    checked={data?.ownLaboratory}
                    onChange={(e) => setData({ ...data, ownLaboratory: e })}
                  />
                </div>
                <div className="uk-flex uk-flex-column uk-flex-middle uk-margin-bottom">
                  <label>Ativo</label>
                  <Switch
                    checked={data?.active}
                    onChange={(e) => setData({ ...data, active: e })}
                  />
                </div>
              </div>
              <hr />
              <footer
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <Button type="submit" text="Salvar" />
                <Button onClick={() => router.back()} text="Voltar" />
              </footer>
            </form>
          </div>
          <LabelsPanel body={body} setBody={setBody} />
        </div>
      </Container>
    </PageWrapper>
  );
});

export default CreateExam;
