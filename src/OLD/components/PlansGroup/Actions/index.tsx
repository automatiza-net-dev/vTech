// @ts-nocheck
import React, { memo, useEffect, useState, useCallback } from "react";

import { plansGroupService } from "@/OLD/services/plansGroup.service";

import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Modal, notification, Popconfirm } from "antd";
import FormChild from "../FormChild";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

const Actions = memo(function ({ reload, setReload, group }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);

  const canEditPlansGroup = useUserHasPermission("GPC02");
  const canDeletePlansGroup = useUserHasPermission("GPC03");

  const formatGroup = () => {
    setData({
      description: group?.description,
      type: group?.type,
      active: group?.active,
    });
  };

  useEffect(() => {
    group && formatGroup();
  }, [group]);

  const removePlansGroup = useCallback(() => {
    if (!canDeletePlansGroup) {
      return notification.error({ message: "Ação não permitida" });
    }

    setLoading(true);
    plansGroupService
      .remove(group?.id)
      .then((_res) =>
        notification.success({
          message: "Grupo removido com sucesso!",
        })
      )
      .catch((_err) => {
        setLoading(false);
        notification.error({
          message: "Houve um erro ao remover o plano selecionado...",
        });
      })
      .finally(() => setTimeout(setReload(!reload)));
  }, [group?.id]);

  const submitUpdatePlansGroup = useCallback(() => {
    if (!permissions?.GPC2) {
      return notification.error({ message: "Ação não permitida" });
    }

    let error = false;
    setLoading(true);
    plansGroupService
      .update(group?.id, data)
      .then((_res) =>
        notification.success({
          message: "Grupo atualizado com sucesso!",
        })
      )
      .catch((err) => {
        error = true;
        setLoading(false);

        return err?.response?.data.errors
          ? notification.error({
              message: `houve um erro ao efetuar a atualização de dados, verifique o campo: ${err?.response?.data.errors[0].field}`,
            })
          : notification.error({
              message:
                "Houve um problema ao efetuar a atualização das informações do grupo...",
            });
      })
      .finally(() => {
        if (!error) {
          setData({});
          setUpdateVisible(false);
          setReload(!reload);
        }
      });
  }, [data, group?.id]);

  return (
    <section className="uk-flex uk-flex-around uk-flex-middle">
      {canEditPlansGroup && (
        <EditTwoTone
          onClick={() =>
            !canEditPlansGroup
              ? notification.error({ message: "Ação não permitida" })
              : setUpdateVisible(true)
          }
        />
      )}
      <Popconfirm
        title="Deseja remover este grupo de planos de contas ?"
        onConfirm={() => {
          !canDeletePlansGroup
            ? notification.error({ message: "Ação não permitida" })
            : removePlansGroup();
        }}
      >
        {canDeletePlansGroup && <DeleteTwoTone twoToneColor="red" />}
      </Popconfirm>
      <Modal
        title="Atualizar informações de Grupo de planos de contas"
        visible={updateVisible}
        onCancel={() => setUpdateVisible(false)}
        footer={null}
      >
        <FormChild
          data={data}
          setData={setData}
          setVisible={setUpdateVisible}
          submit={submitUpdatePlansGroup}
        />
      </Modal>
    </section>
  );
});

export default Actions;
