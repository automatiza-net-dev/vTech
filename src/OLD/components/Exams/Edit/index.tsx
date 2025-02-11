// @ts-nocheck
// Core
import React, { useState, useCallback, memo, useEffect } from "react";
import { useRouter } from "next/router";

// Hooks
import { useSingleExam } from "@/OLD/hooks/useSingleExam";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

// Services
import { examService } from "@/OLD/services/exams.service";
import { groupsService } from "@/OLD/services/groups.service";

// Components
import { Input, Switch, Select } from "antd";
import Editor from "@/OLD/components/Editor";
import { Container } from "./styles";
import { Button, useToast } from "infinity-forge";
import LabelsPanel from "@/OLD/components/mini-components/LabelsPanel";
import AccessDenied from "@/OLD/components/AccessDenied";

const UpdateExam = memo(function UpdateExam() {
  const [data, setData] = useState({});
  const [allSubgroups, setAllSubgroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState("");
  const router = useRouter();
  const id = router?.query?.innerpage;
  const { exam } = useSingleExam(id);

  const canEditExams = useUserHasPermission("EXA02");

  const {createToast} = useToast()

  const getAllSubgroups = useCallback(() => {
    setLoading(true);
    groupsService
      .listSubgroups()
      .then((res) => setAllSubgroups(res.data))
      .catch((_err) => {
        setLoading(false);

        return createToast({ status: "error", message: "Houve um erro ao recuperar os subgrupos disponíveis..." })
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getAllSubgroups();
    setData(exam);
    setBody(exam?.description);
  }, [getAllSubgroups, exam]);

  const submit = useCallback(() => {
    setLoading(true);
    examService
      .updateExams(data?.id, {
        subgroupId: data?.subgroup_id,
        name: data?.name,
        description: body,
        active: data?.active,
        type: data?.type,
        ownLaboratory: data?.own_laboratory,
      })
      .then((_res) => {
       

       return createToast({ status: "success", message: "Exame atualizado com sucesso!" })
      })
      .catch((err) => {
        setLoading(false);

       return createToast({ status: "error", message: err.response.data.errors[0].message })
      })
      .finally(() => {
        setLoading(false);
        router.back();
      });
  }, [data, body]);

  return !canEditExams || canEditExams === "loading" ? (
    <AccessDenied loading={canEditExams} />
  ) : (
    <Container className="uk-margin-top uk-padding uk-container">
      <h3 className="uk-margin-remove">Atualizar Exame</h3>
      <hr />
      <div className="uk-flex">
        <div className="uk-width-5-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div>
              <label>Nome</label>
              <Input
                value={data?.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
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
            <footer className="uk-flex uk-flex-right">
              <div className="uk-width-1-2 uk-flex uk-flex-around">
                <Button type="submit" text="Salvar" />
                <Button onClick={() => router.back()} text="Voltar" />
              </div>
            </footer>
          </form>
        </div>
        <LabelsPanel body={body} setBody={setBody} />
      </div>
    </Container>
  );
});

export default UpdateExam;
