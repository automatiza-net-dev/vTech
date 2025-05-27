// @ts-nocheck
import React, { memo, useEffect, useState, useCallback } from "react";

import { plansGroupService } from "@/OLD/services/plansGroup.service";

import FormChild from "../FormChild";
import { PermissionItem, useToast } from "infinity-forge";
import { Modal, Popconfirm } from "antd";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

const Actions = memo(function ({ reload, setReload, group }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);

  const canEditPlansGroup = useUserHasPermission("GPC02");
  const canDeletePlansGroup = useUserHasPermission("GPC03");
  const { createToast } = useToast();
  const formatGroup = () => {
    setData({
      description: group?.description,
      type: group?.type,
      active: group?.active,
      dreGroupId: group?.dreGroup?.id,
    });
  };

  useEffect(() => {
    group && formatGroup();
  }, [group]);

  const removePlansGroup = useCallback(() => {
    if (!canDeletePlansGroup) {
      return createToast({ message: "Ação não permitida", status: "error" });
    }

    setLoading(true);
    plansGroupService
      .remove(group?.id)
      .then((_res) =>
        createToast({
          message: "Grupo removido com sucesso!",
          status: "success",
        })
      )
      .catch((_err) => {
        setLoading(false);
        createToast({
          message: "Houve um erro ao remover o plano selecionado...",
          status: "error",
        });
      })
      .finally(() => setTimeout(setReload(!reload)));
  }, [group?.id]);

  const submitUpdatePlansGroup = useCallback(() => {
    let error = false;
    setLoading(true);
    plansGroupService
      .update(group?.id, data)
      .then((_res) =>
        createToast({
          message: "Grupo atualizado com sucesso!",
          status: "success",
        })
      )
      .catch((err) => {
        error = true;
        setLoading(false);

        return err?.response?.data.errors
          ? createToast({
              message: `houve um erro ao efetuar a atualização de dados, verifique o campo: ${err?.response?.data.errors[0].field}`,
              status: "error",
            })
          : createToast({
              message:
                "Houve um problema ao efetuar a atualização das informações do grupo...",
              status: "error",
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
        <FiEdit2
          onClick={() =>
            !canEditPlansGroup
              ? createToast({
                  message: "Ação não permitida",
                  status: "error",
                })
              : setUpdateVisible(true)
          }
          style={{ cursor: 'pointer', fontSize: '1.2rem' }}
        />
      )}
      <Popconfirm
        title="Deseja remover este grupo de planos de contas ?"
        onConfirm={() => {
          !canDeletePlansGroup
            ? createToast({
                message: "Ação não permitida",
                status: "error",
              })
            : removePlansGroup();
        }}
      >
        {canDeletePlansGroup && <FiTrash2
          className="uk-margin-small-left"
          style={{ cursor: 'pointer', fontSize: '1.2rem' }}
        />}
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
