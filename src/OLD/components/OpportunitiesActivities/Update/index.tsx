// @ts-nocheck
import { memo, useState, useEffect, useCallback } from "react";

import { opportunitiesService } from "@/OLD/services/opportunities.service";

import { Modal, notification } from "antd";
import FormChild from "../FormChild";

import moment from "moment";

const Update = memo(function ({
  setReload,
  visible,
  setVisible,
  activity,
  edit,
  op,
  colaborators,
  actTypes,
}) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [execution, setExecution] = useState(false);

  useEffect(() => {
    setData({
      collabName: activity?.user?.name || activity?.openingUser?.name,
      userId: activity?.user?.id || activity?.openingUser?.id,
      activityId: activity?.activity?.id,
      executionDate: moment(
        activity?.execution_date || activity?.executionDate
      ),
      duration: activity?.duration,
      description: activity?.description,
      observation: activity?.observation,
    });
  }, [activity]);

  const submitExecution = () => {
    opportunitiesService
      .executeActivity(activity?.id, { observation: data?.observation })
      .then((_res) => {
        setReload((prv) => !prv);
        return notification.success({
          message: "Atividade executada com sucesso!",
        });
      });
  };

  const submitUpdate = useCallback(() => {
    setLoading(true);
    opportunitiesService
      .updateActivityOpportunity({
        ...data,
        id: activity?.id,
        executionDate: moment(data?.executionDate).toISOString(),
      })
      .then((_res) => {
        setReload((prv) => !prv);
        setVisible(false);
        setLoading(false);
        if (!execution) {
          return notification.success({
            message: "Atividade atualizada com sucesso!",
          });
        } else {
          submitExecution();
        }
      })
      .catch((err) => {
        if (err?.response?.data?.message) {
          return notification.error({
            message: err?.response?.data?.message?.split[":"][1],
          });
        }
        return notification.error({
          message: "Houve um erro ao atualizar a atividade",
        });
      });
  }, [data, activity, execution]);

  return (
    <Modal
      title={edit ? "Atualizar atividade" : "Detalhes atividade"}
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={1000}
    >
      <FormChild
        colaborators={colaborators}
        actTypes={actTypes}
        data={data}
        setData={setData}
        submit={submitUpdate}
        loading={loading}
        setVisible={setVisible}
        setExecution={setExecution}
        edit={edit}
        type="update"
        op={op}
      />
    </Modal>
  );
});

export default Update;
