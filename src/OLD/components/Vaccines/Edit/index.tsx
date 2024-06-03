// @ts-nocheck
// Core
import React, { memo, useEffect, useCallback, useState } from "react";
import { useSpecies } from "@/OLD/hooks/useSpecies";
import { useRouter } from "next/router";

// Components
import { Container } from "./styles";
import { notification, Input, Select, Table, Switch } from "antd";
import { Button } from "@/OLD/components/mini-components";
import ProtocolModal from "../Create/Protocol";

// Services
import { vaccinesService } from "@/OLD/services/vaccine-service";
import { groupsService } from "@/OLD/services/groups.service";

// Utils
import ColumnsProtocols from "../Create/ColumsProtocols";
import { permissionControl } from "@/OLD/utils/permissionsControlFake";

// Icons
import { EditTwoTone } from "@ant-design/icons";

const EditVaccine = memo(function EditVaccine() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [vaccineProtocols, setVaccineProtocols] = useState([]);
  const [allSubgroups, setAllSubgroups] = useState([]);
  const [reload, setReload] = useState(false);
  const [protocolVisible, setProtocolVisible] = useState(false);
  const [edit, setEdit] = useState(false);
  const { species, loadingSpecies, fetchSpecies } = useSpecies("ALL");
  const router = useRouter();
  const vaccineId = router.query.innerpage;

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
                    if (!permissions?.VAC2) {
                      return notification.error({
                        message: "Ação não permitida!",
                      });
                    }

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

  const getVaccineById = useCallback(() => {
    setLoading(false);
    vaccinesService
      .showVacine(vaccineId)
      .then((res) => {
        setData({ ...res.data, subgroupId: res.data?.subgroup_id });
      })
      .catch((err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao buscar as informações da vacina....",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [vaccineId]);

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
    getVaccineById();
    getAllSubgroups();
    getVaccineProtocol();
  }, [getVaccineById, getAllSubgroups, getVaccineProtocol]);

  const updateVaccine = useCallback(() => {
    if (!permissions?.VAC2) {
      return notification.error({ message: "Ação não permitida" });
    }

    setLoading(true);
    vaccinesService
      .updateVacine(vaccineId, {
        subgroupId: data?.subgroupId,
        name: data?.name,
        active: data?.active,
        type: data?.type,
        description: data?.description,
      })
      .then((_res) => {
        return notification.success({
          message: "Vacina atualizada com sucesso!",
        });
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao atualizar a vacina...",
        });
      })
      .finally(() => {
        setLoading(false);
        router.back();
      });
  }, [data, vaccineId]);

  return (
    <div className="uk-padding">
      <h3 className="uk-margin-remove"> Editar Vacina </h3>
      <Container className="uk-margin-top">
        <form className="uk-width-1-1 uk-card uk-card-body">
          <h5 className="uk-heading-line">
            <span>Dados da vacina</span>
          </h5>
          <div className="uk-flex uk-flex-right">
            <div>
              <Switch
                checked={data?.active}
                onChange={(e) => setData({ ...data, active: e })}
              />
              &nbsp;
              <label>Ativo</label>
            </div>
          </div>
          <div className="uk-flex uk-flex-around uk-width-1-1">
            <div className="uk-width-1-3">
              <label>Nome</label>
              <Input
                value={data?.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>

            <div className="uk-width-1-3">
              <label>Descrição</label>
              <Input
                value={data?.description}
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
                value={data?.type}
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
                value={
                  allSubgroups.find((item) => item.id === data?.subgroupId)
                    ?.description
                }
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
          <h5 className="uk-heading-line">
            <span>Protocolos</span>
          </h5>
          <Table dataSource={vaccineProtocols} columns={ColumnsProtocols} />
          <div className="uk-flex uk-flex-center">
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
        </form>
      </Container>
      <div className="uk-flex uk-flex-left">
        <div className="uk-flex uk-flex-between uk-width-1-6">
          <Button onClick={() => updateVaccine()}>Salvar</Button>
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

export default EditVaccine;
