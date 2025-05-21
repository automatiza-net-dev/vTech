// @ts-nocheck
import React, { useState, memo, useEffect, useCallback } from "react";

import { opportunitiesService } from "@/OLD/services/opportunities.service";

import { useProfile } from "@/OLD/hooks/useProfile";

import FormChild from "../FormChild";
import { Modal } from "antd";

import moment from "moment";
import { useAuthAdmin, useToast } from "infinity-forge";

const Create = memo(function Create({
  visible,
  setVisible,
  setReload,
  opportunity,
  colaborators,
  actTypes,
  customSubmit,
}) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { user } = useAuthAdmin();

  const { createToast} = useToast()

  useEffect(() => {
    setData({ ...data, collabName: user?.user?.name, userId: user?.id });
  }, [user]);

  const submitActivity = useCallback(() => {
    setLoading(true);

    opportunitiesService
      .createActivity({
        opportunityId: opportunity?.id,
        userId: data?.userId,
        description: data?.description,
        duration: data?.duration,
        activityId: data?.activityId,
        executionDate: moment(data?.executionDate).toISOString(),
      })
      .then((_res) => {
        setReload((prv) => !prv);
        setLoading(false);
        setVisible(false);
        setData({ collabName: user?.name, userId: user?.id });

        return createToast({ status: "success",  message: "Atividade criada com sucesso!" })
      })
      .catch((_err) => {
        setLoading(false);
        return createToast({ status: "error",  message:  "Houve um erro ao cadastrar a atividade, verifique os campos informados" })
      });

    customSubmit && customSubmit();
  }, [JSON.stringify(data), opportunity?.id]);

  return (
    <Modal
      title="Cadastrar nova atividade"
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
    >
      <FormChild
        colaborators={colaborators}
        actTypes={actTypes}
        op={opportunity}
        data={data}
        setData={setData}
        submit={submitActivity}
        loading={loading}
        setVisible={setVisible}
        edit={true}
      />
    </Modal>
  );
});

export default Create;
