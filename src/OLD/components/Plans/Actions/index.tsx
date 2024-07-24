// @ts-nocheck
import React, { useState, useCallback, memo, useEffect } from "react";

import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";

import { useToast } from "infinity-forge";
import { planService } from "@/OLD/services/plan.service";

import FormChild from "../FormChild";
import { Modal, notification, Popconfirm } from "antd";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

const Actions = memo(function Actions({ plansGroup, reload, setReload, plan }) {
  const [loading, setLoading] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [updateVisible, setUpdateVisible] = useState(false);

  const { createToast } = useToast();
  const canEditAccountPlans = useUserHasPermission("PCT02");
  const canDeleteAccountPlans = useUserHasPermission("PCT03");

  const formatUpdateData = () => {
    setUpdateData({
      id: plan?.id,
      description: plan?.description,
      code: plan?.code,
      active: plan?.active,
      type: plan?.type,
      accountPlanGroupId: plan?.group?.id,
      parentId: plan?.parent?.id,
    });
  };

  useEffect(() => {
    plan && formatUpdateData();
  }, [plan, updateVisible]);

  const removePlan = useCallback(() => {
    if (!canDeleteAccountPlans) {
      return createToast({ message: "Ação não permitida", status: "error" });
    }

    setLoading(true);
    planService
      .removeAccountPlan(plan.id)
      .then((_res) =>
        createToast({
          message: "Plano removido com sucesso!",
          status: "success",
        })
      )
      .catch((err) => {
        setLoading(false);
        return createToast({
          message: "Houve um erro ao remover o plano selecionado...",
          status: "error",
        });
      })
      .finally(() => {
        setLoading(false);
        setReload(!reload);
      });
  }, [plan?.id]);

  const submitUpdatePlan = useCallback(() => {
    if (!canEditAccountPlans) {
      return createToast({
        message: "Ação não permitida",
        status: "error",
      });
    }

    setLoading(true);
    let error = false;
    const newObj = { ...updateData };
    delete newObj?.id;
    planService
      .updateAccountPlan(plan?.id, updateData)
      .then((res) => {
        setLoading(false);
        setReload(!reload);
        setUpdateVisible(false);
        return createToast({
          message: "Plano atualizado com sucesso!",
          status: "success",
        });
      })
      .catch((err) => {
        setLoading(false);
        error = true;
        if (err?.response?.data?.errors) {
          return createToast({
            message: `houve um erro ao efetuar a atualização de informações do plano, verifique o campo: ${err?.response?.data.errors[0].field}`,
            status: "error",
          });
        }
        if (err?.response?.data?.code === "E_NOT_FOUND") {
          return createToast({
            message: "Plano base do sistema, usuário não autorizado",
            status: "error",
          });
        }

        return createToast({
          message:
            "Houve um problema ao efetuar a atualização das informações do plano...",
          status: "error",
        });
      });
  }, [plan?.id, updateData]);

  return (
    <div className="uk-flex uk-flex-around">
      {canEditAccountPlans && (
        <EditTwoTone onClick={() => setUpdateVisible(true)} />
      )}
      <Popconfirm
        title="Deseja remover este plano?"
        onConfirm={() =>
          !canDeleteAccountPlans
            ? createToast({ message: "Ação não permitida", status: "error" })
            : removePlan()
        }
      >
        {canDeleteAccountPlans && <DeleteTwoTone twoToneColor="red" />}
      </Popconfirm>
      <Modal
        title="Atualizar informações de plano de contas"
        visible={updateVisible}
        onCancel={() => setUpdateVisible(false)}
        footer={null}
      >
        <FormChild
          data={updateData}
          setData={setUpdateData}
          setVisible={setUpdateVisible}
          plansGroup={plansGroup}
          submit={submitUpdatePlan}
        />
      </Modal>
    </div>
  );
});

export default Actions;
