// @ts-nocheck
import React, { useState, useCallback, memo, useEffect } from "react";

import { usePlansGroup } from "@/OLD/hooks/usePlansGroup";

import { plansGroupService } from "@/OLD/services/plansGroup.service";

import { plansGroupColumns } from "./Columns/plansGroupColumns";
import moment from "moment";

import { Container } from "./styles";
import { Button, PageWrapper, useToast } from "infinity-forge";
import { Table, Modal } from "antd";
import FormChild from "./FormChild";
import Actions from "./Actions";
import Filters from "./Filters";
import AccessDenied from "@/OLD/components/AccessDenied";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

function PlansGroup() {
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [formatedPlansGroup, setFormatedPlansGroup] = useState([]);
  const [filters, setFilters] = useState({});
  const [data, setData] = useState({ active: true });

  const listPlansGroupPermission = useUserHasPermission("GPC00");
  const canCreatePlansGroup = useUserHasPermission("GPC01");
  const { createToast } = useToast();
  const { plansGroup } = usePlansGroup(filters, reload);

  const formatPlansGroup = () => {
    setFormatedPlansGroup(
      plansGroup?.map((group) => {
        return {
          dreGroup: group?.dreGroup?.id,
          description: group?.description,
          type: group?.type,
          dreGroup: group?.dreGroup?.description || "---",
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
        createToast({
          message: "Grupo de planos de contas cadastrado com sucesso!",
          status: "success",
        })
      )
      .catch((err) => {
        error = true;
        setLoading(false);

        return err?.response?.data.errors
          ? createToast({
              message: `houve um erro ao efetuar o cadastro, verifique o campo: ${err?.response?.data.errors[0].field}`,
              status: "error",
            })
          : createToast({
              message: "Houve um problema ao efetuar o cadastro do grupo...",
              status: "error",
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
    <PageWrapper title="Grupo de planos de contas">
      <Container>
        <div className="uk-flex uk-flex-right">
          <Filters filters={filters} setFilters={setFilters} />
          <div>
            <Button
              text="Cadastrar"
              onClick={() => setCreateVisible(true)}
              disabled={!canCreatePlansGroup}
            />
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
    </PageWrapper>
  );
}

export default PlansGroup;
