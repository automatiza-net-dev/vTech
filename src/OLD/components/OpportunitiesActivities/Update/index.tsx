// @ts-nocheck
import { memo, useState, useEffect, useCallback } from "react";

import { opportunitiesService } from "@/OLD/services/opportunities.service";

import { Modal } from "antd";
import FormChild from "../FormChild";

import moment from "moment";
import { Button, useToast } from "infinity-forge";
import CreateActivity from "@/OLD/components/OpportunitiesActivities/Create";
import { useProfile } from "@/OLD/hooks/useProfile";

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
  const [showNewActivity, setShowNewActivity] = useState(false);
  const [newActivityModal, setNewActivityModal] = useState(false);

  const {createToast} = useToast()

  const {user} = useProfile()

  useEffect(() => {
    console.log(activity?.user?.name || activity?.openingUser?.name || user?.name, "@@")
    setData({
      collabName: activity?.user?.name || activity?.openingUser?.name || user?.name,
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

        return createToast({ status: "success",  message: "Atividade executada com sucesso!" })
      });
  };

  async function Submit(showNewActivity = false) {
    try {
      setLoading(true);
      await opportunitiesService.updateActivityOpportunity({
        ...data,
        id: activity?.id,
        executionDate: moment(data?.executionDate).toISOString(),
      });

      await opportunitiesService.executeActivity(activity?.id, data);

      setReload((prv) => !prv);
      setVisible(false);
      setLoading(false);
      setNewActivityModal(true);

      if (!execution) {
        
        return createToast({ status: "success",  message: "Atividade atualizada com sucesso!" })
      } else {
        submitExecution();
      }
    } catch (error) {
      createToast({ status: "error",  message: "Houve um erro ao atualizar a atividade" })
    }
  }

  async function handleSuubmit(showNewActivity = false) {
    try {
      setLoading(true);
      await opportunitiesService.updateActivityOpportunity({
        ...data,
        id: activity?.id,
        executionDate: moment(data?.executionDate).toISOString(),
      });

      setReload((prv) => !prv);
      setVisible(false);
      setLoading(false);

      if (!execution) {
        return createToast({ status: "success",  message: "Atividade atualizada com sucesso!" })
      } else {
        submitExecution();
      }
    } catch (error) {
      return createToast({ status: "error",  message: "Houve um erro ao atualizar a atividade" }) 
    }
  }

  const submitUpdate = useCallback(() => {
    handleSuubmit();
  }, [data, activity, execution]);

  return (
    <>
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
          setExecution={() => Submit(true)}
          loading={loading}
          setVisible={setVisible}
          edit={edit}
          type="update"
          op={op}
        />
      </Modal>

      <Modal
        title="Cadastrar nova atividade"
        visible={newActivityModal}
        onCancel={() => setNewActivityModal(false)}
        footer={
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <Button text="Sim" onClick={() => setShowNewActivity(true)} />
            <Button text="Não" onClick={() => setNewActivityModal(false)} />
          </div>
        }
        width={500}
      >
        <span>Deseja criar uma nova atividade para esta Oportunidade?</span>
      </Modal>

      {showNewActivity && (
        <CreateActivity
          visible={showNewActivity}
          setVisible={setShowNewActivity}
          setReload={setReload}
          opportunity={op}
          colaborators={colaborators}
          actTypes={actTypes}
          customSubmit={() => setNewActivityModal(false)}
        />
      )}
    </>
  );
});

export default Update;
