// @ts-nocheck
import React, { useState, useCallback, memo, useEffect } from "react";

import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";

import { planService } from "@/OLD/services/plan.service";

import { Modal, notification, Popconfirm } from "antd";
import FormChild from "../FormChild";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

const Actions = memo(function Actions({ plansGroup, reload, setReload, plan }) {
  const [loading, setLoading] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [updateVisible, setUpdateVisible] = useState(false);

  const canEditAccountPlans = useUserHasPermission("PCT02");
  const canDeleteAccountPlans = useUserHasPermission("PCT03");

  const formatUpdateData = () => {
    setUpdateData({
      id: plan?.id,
      description: plan?.description,
      code: plan?.code,
      active: plan?.active,
      type: plan?.type,
      accountPlanGroupId: plan?.account_plan_group_id,
      parentId: plan?.parentId,
    });
  };

  useEffect(() => {
    plan && formatUpdateData();
  }, [plan, updateVisible]);

  const removePlan = useCallback(() => {
    if (!canDeleteAccountPlans) {
      return notification.error({ message: "Ação não permitida" });
    }

    setLoading(true);
    planService
      .removeAccountPlan(plan.id)
      .then((_res) =>
        notification.success({
          message: "Plano removido com sucesso!",
        })
      )
      .catch((err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao remover o plano selecionado...",
        });
      })
      .finally(() => {
        setLoading(false);
        setReload(!reload);
      });
  }, [plan?.id]);

  const submitUpdatePlan = useCallback(() => {
    if (!canEditAccountPlans) {
      return notification.error({ message: "Ação não permitida" });
    }

    setLoading(true);
    let error = false;
    const newObj = { ...updateData };
    delete newObj?.id;
    planService
      .updateAccountPlan(plan?.id, updateData)
      .then((res) =>
        notification.success({ message: "Plano atualizado com sucesso!" })
      )
      .catch((err) => {
        setLoading(false);
        error = true;
        return err?.response?.data.errors
          ? notification.error({
              message: `houve um erro ao efetuar a atualização de informações do plano, verifique o campo: ${err?.response?.data.errors[0].field}`,
            })
          : notification.error({
              message:
                "Houve um problema ao efetuar a atualização das informações do plano...",
            });
      })
      .finally(() => {
        if (!error) {
          setLoading(false);
          setReload(!reload);
          setUpdateVisible(false);
        }
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
            ? notification.error({ message: "Ação não permitida" })
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
