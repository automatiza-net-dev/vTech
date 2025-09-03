// @ts-nocheck
// Core
import React, { memo, useEffect, useCallback, useState } from "react";
import { useRouter } from "next/router";

// Services
import { examService } from "@/OLD/services/exams.service";

// Utils
import Columns from "./Columns";
import moment from "moment";
import "moment/locale/pt-br";

// Icons
import { FiEdit2 } from "react-icons/fi";

// Components
import { Container, Input } from "./styles";
import { Button, PageWrapper, useToast } from "infinity-forge";
import EditExam from "./Edit";
import RemoveExam from "./Delete";
import { Table, Select } from "antd";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
const { Option } = Select;
import AccessDenied from "@/OLD/components/AccessDenied";

const Exams = memo(function Exams() {
  const [filters, setFilters] = useState({ active: "true" });
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allExams, setAllExams] = useState([]);
  const router = useRouter();

  const listExamsPermission = useUserHasPermission("EXA00");
  const canCreateExams = useUserHasPermission("EXA01");
  const canEditExams = useUserHasPermission("EXA02");
  const canDeleteExams = useUserHasPermission("EXA03");

  const { createToast } = useToast()

  const getAllExams = useCallback(() => {
    setLoading(true);
    examService
      .listExams(filters)
      .then((res) => {
        res.data.sort((a, b) =>
          moment(b.created_at).diff(moment(a.created_at))
        );
        setAllExams(
          res.data.map((item) => {
            return {
              name: item?.name,
              createdAt: moment(item?.created_at).format("DD/MM/YYYY - HH:mm"),
              status: item?.active ? "Ativo" : "Inativo",
              type: item?.type === "" ? "Tipo não informado" : item?.type,
              ownLaboratory: item?.own_laboratory ? "Sim" : "Não",
              actions: item.economic_group_id ? (
                <div className="uk-flex uk-flex-around">
                  {canEditExams && (
                    <FiEdit2
                      size={15}
                      onClick={() => {
                        router.push(`/dashboard/exames/editar/${item?.id}`);
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                  {canDeleteExams && (
                    <RemoveExam
                      reload={reload}
                      setReload={setReload}
                      id={item?.id}
                    />
                  )}
                </div>
              ) : (
                <div className="">
                  <span style={{ fontWeight: 'bold' }}>Padrão</span>
                </div>
              ),
            };
          })
        );
      })
      .catch((err) => {
        setLoading(false);
        return createToast({ status: "error", message: "Houve um problema ao recuperar os exames cadastrados..." })
      })
      .finally(() => {
        setLoading(false);
      });
  }, [reload, filters, canEditExams, canDeleteExams]);

  useEffect(() => {
    getAllExams();
  }, [getAllExams]);

  return !listExamsPermission || listExamsPermission === "loading" ? (
    <AccessDenied loading={listExamsPermission} />
  ) : (
    <PageWrapper title="Controle de exames">
      <Container>
        <div className="uk-margin-right uk-flex uk-flex-between uk-margin-top">
          <Input>
            <input
              type="search"
              placeholder="Nome"
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />

          </Input>
          <Input>
            <input
              type="search"
              placeholder="Descrição"
              onChange={(e) =>
                setFilters({ ...filters, description: e.target.value })
              }
            />

          </Input>
          <Input>
            <input
              type="search"
              placeholder="Tipo"
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            />

          </Input>
          <div className="uk-margin-small-top">
            {canCreateExams && (
              <Button
                onClick={() => router.push("/dashboard/exames/criar")}
                text="Cadastrar"
              />
            )}
          </div>
        </div>
        <hr />
        <div className="uk-width-1-6 uk-margin-left">
          <h5>Filtrar por:</h5>
          <Select
            className="uk-width-1-1"
            value={filters?.active}
            onChange={(e) => setFilters({ ...filters, active: e })}
          >
            <Option value="true">Ativo</Option>
            <Option value="false">Inativo</Option>
            <Option value="">Todos</Option>
          </Select>
        </div>
        <Table
          className="uk-margin-top"
          dataSource={allExams}
          columns={Columns}
        />
      </Container>
    </PageWrapper>
  );
});

export default Exams;
