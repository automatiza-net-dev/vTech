// @ts-nocheck
import React, { useState, useCallback, memo, useEffect } from "react";

import { usePlansGroup } from "@/OLD/hooks/usePlansGroup";

import { plansGroupService } from "@/OLD/services/plansGroup.service";

import { plansGroupColumns } from "./Columns/plansGroupColumns";
import moment from "moment";

import { Container } from "./styles";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";
import { Table, Modal, notification } from "antd";
import FormChild from "./FormChild";
import Actions from "./Actions";
import Filters from "./Filters";
import AccessDenied from "@/OLD/components/AccessDenied";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

const PlansGroup = memo(function PlansGroup() {
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [formatedPlansGroup, setFormatedPlansGroup] = useState([]);
  const [filters, setFilters] = useState({});
  const [data, setData] = useState({ active: true });

  const listPlansGroupPermission = useUserHasPermission("GPC00");
  const canCreatePlansGroup = useUserHasPermission("GPC01");

  const { plansGroup } = usePlansGroup(filters, reload);

  const formatPlansGroup = () => {
    setFormatedPlansGroup(
      plansGroup?.map((group) => {
        return {
          description: group?.description,
          type: group?.type,
          active: group?.active ? "Ativo" : "Inativo",
          createdAt: moment(group?.created_at).format("DD/MM/YYYY"),
          actions: (
            <Actions reload={reload} setReload={setReload} group={group} />
          ),
        };
      })
    );
  };

  useEffect(() => {
    plansGroup?.length > 0 && formatPlansGroup();
  }, [plansGroup]);

  const submitCreatePlansGroup = useCallback(() => {
    setLoading(true);
    let error = false;
    plansGroupService
      .create(data)
      .then((_res) =>
        notification.success({
          message: "Grupo de planos de contas cadastrado com sucesso!",
        })
      )
      .catch((err) => {
        error = true;
        setLoading(false);

        return err?.response?.data.errors
          ? notification.error({
              message: `houve um erro ao efetuar o cadastro, verifique o campo: ${err?.response?.data.errors[0].field}`,
            })
          : notification.error({
              message: "Houve um problema ao efetuar o cadastro do grupo...",
            });
      })
      .finally(() => {
        if (!error) {
          setLoading(false);
          setData({ active: true });
          setReload(!reload);
          setCreateVisible(false);
        }
      });
  }, [data]);

  return !listPlansGroupPermission || listPlansGroupPermission === "loading" ? (
    <AccessDenied loading={listPlansGroupPermission} />
  ) : (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">Grupos de Planos de Contas</h3>
      <div className="uk-flex uk-flex-right">
        <Filters filters={filters} setFilters={setFilters} />
        <div>
          <CustomButton
            onClick={() => setCreateVisible(true)}
            disabled={!canCreatePlansGroup}
          >
            Cadastrar
          </CustomButton>
        </div>
      </div>
      <hr />
      <Table columns={plansGroupColumns} dataSource={formatedPlansGroup} />
      <Modal
        visible={createVisible}
        onCancel={() => setCreateVisible(false)}
        title="Cadastro de grupos de planos de contas"
        footer={null}
      >
        <FormChild
          data={data}
          setData={setData}
          setVisible={setCreateVisible}
          submit={submitCreatePlansGroup}
        />
      </Modal>
    </Container>
  );
});

export default PlansGroup;
