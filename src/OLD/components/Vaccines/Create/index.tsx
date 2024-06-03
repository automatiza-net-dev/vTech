// @ts-nocheck
// Core
import React, { memo, useState, useEffect, useCallback } from "react";
import { useSpecies } from "@/OLD/hooks/useSpecies";
import { useRouter } from "next/router";

// Services
import { vaccinesService } from "@/OLD/services/vaccine-service";
import { groupsService } from "@/OLD/services/groups.service";

// Components
import { Container } from "./styles";
import { Button } from "@/OLD/components/mini-components/Button";
import ProtocolModal from "./Protocol";
import { Input, Select, notification, Table } from "antd";
const { Option } = Select;

// utils
import ColumnsProtocols from "./ColumsProtocols";
import { permissionControl } from "@/OLD/utils/permissionsControlFake";

// Icons
import { EditTwoTone } from "@ant-design/icons";

const CreateVaccine = memo(function CreateVaccine() {
  const [data, setData] = useState({});
  const [protocolVisible, setProtocolVisible] = useState(false);
  const [vaccineId, setVaccineId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allSubgroups, setAllSubgroups] = useState([]);
  const [reload, setReload] = useState(false);
  const [vaccineProtocols, setVaccineProtocols] = useState([]);
  const [edit, setEdit] = useState(false);
  const { species, loadingSpecies, fetchSpecies } = useSpecies("ALL");
  const router = useRouter();

  const permissions = permissionControl("vacinas");

  const getVaccineProtocol = useCallback(() => {
    setLoading(true);
    vaccinesService
      .listProtocols({ vaccine: vaccineId })
      .then((res) => {
        setVaccineProtocols(
          res.data.map((item) => {
            return {
              protocol: item?.name,
              specie: item?.specie?.description,
              doses: item?.doses,
              interval: item?.interval,
              actions: (
                <EditTwoTone
                  size={15}
                  onClick={() => {
                    setEdit(item);
                    setProtocolVisible(true);
                  }}
                />
              ),
            };
          })
        );
      })
      .catch((err) => {
        setLoading(false);
        return notification.error({
          message: "Não foi possível recuperar os protocolos da vacina...",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [vaccineId, reload]);

  const getAllSubgroups = useCallback(() => {
    setLoading(true);
    groupsService
      .listSubgroups()
      .then((res) => setAllSubgroups(res.data))
      .catch((err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao buscar os sub-grupos disponíveis",
        });
      });
  }, []);

  useEffect(() => {
    fetchSpecies();
    getAllSubgroups();
  }, [getAllSubgroups]);

  useEffect(() => {
    vaccineId && getVaccineProtocol();
  }, [getVaccineProtocol]);

  const submitVaccine = useCallback(() => {
    if (!permissions?.VAC1) {
      return notification.error({ message: "Ação não permitida" });
    }

    setLoading(true);
    vaccinesService
      .createVaccine({
        ...data,
        subgroupId: allSubgroups[data?.subgroupId]?.id,
      })
      .then((res) => {
        setVaccineId(res.data.id);
      })
      .catch((err) => {
        return notification.error({
          message: "Houve um erro ao salvar a vacina",
        });
      });
  }, [data]);

  return (
    <div className="uk-padding">
      <h3 className="uk-margin-remove"> Cadastrar Vacina </h3>
      <Container className="uk-margin-top">
        <form className="uk-width-1-1 uk-card uk-card-body">
          <h5 className="uk-heading-line">
            <span>Dados da vacina</span>
          </h5>
          <div className="uk-flex uk-flex-around uk-width-1-1">
            <div className="uk-width-1-3">
              <label>Nome</label>
              <Input
                disabled={vaccineId}
                value={data?.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>

            <div className="uk-width-1-3">
              <label>Descrição</label>
              <Input
                disabled={vaccineId}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
              />
            </div>
          </div>
          <div className="uk-flex uk-flex-around uk-width-1-1 uk-margin-top">
            <div className="uk-width-1-3">
              <label>Tipo</label>
              <Select
                disabled={vaccineId}
                className="uk-width-1-1"
                onChange={(e) => setData({ ...data, type: e })}
              >
                <Option value="vaccine">Vacina</Option>
                <Option value="vermifuge">Vermífugo</Option>
              </Select>
            </div>
            <div className="uk-width-1-3">
              <label>Subgrupo</label>
              <Select
                disabled={vaccineId}
                className="uk-width-1-1"
                onChange={(e) => setData({ ...data, subgroupId: e })}
              >
                <Option>Selecione</Option>
                {allSubgroups.length > 0 &&
                  allSubgroups.map((item, i) => (
                    <Option key={i} value={i}>
                      {item?.description}
                    </Option>
                  ))}
              </Select>
            </div>
          </div>
          {vaccineId && (
            <>
              <h5 className="uk-heading-line">
                <span>Protocolos</span>
              </h5>
              <Table dataSource={vaccineProtocols} columns={ColumnsProtocols} />
              <div className="uk-flex uk-flex-center uk-margin-top">
                <Button
                  type="button"
                  onClick={() => {
                    setEdit(false);
                    setProtocolVisible(true);
                  }}
                >
                  Adicionar Protocolo
                </Button>
              </div>
            </>
          )}
        </form>
      </Container>
      <div className="uk-flex uk-flex-left">
        <div className="uk-flex uk-flex-between uk-width-1-6">
          <Button
            onClick={() => {
              if (!vaccineId) {
                submitVaccine();
              } else {
                notification.success({
                  message: "Informações salvas com sucesso!",
                });
                router.back();
              }
            }}
          >
            Salvar
          </Button>
          <Button onClick={() => router.back()}>Voltar</Button>
        </div>
      </div>
      <ProtocolModal
        edit={edit}
        visible={protocolVisible}
        setVisible={setProtocolVisible}
        species={species}
        vaccineId={vaccineId}
        reload={reload}
        setReload={setReload}
      />
    </div>
  );
});

export default CreateVaccine;
