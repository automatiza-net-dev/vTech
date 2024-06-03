// @ts-nocheck
import { memo, useCallback, useState } from "react";

import { opportunitiesService } from "@/OLD/services/opportunities.service";

import { useColaborators } from "@/OLD/hooks/useColaborators";

import { Modal, notification } from "antd";
import FormChild from "../FormChild";

const ChangeTechnician = memo(function ChangeTechnician({
  formData,
  visible,
  close,
  setReload,
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const { colaborators } = useColaborators();

  const submitGain = useCallback(() => {
    setLoading(true);

    if (!data?.completeId) {
      return notification.warning({ message: "Informe o novo usuário!" });
    }

    opportunitiesService
      .updateUser(formData?.op?.id, {
        userId: data?.completeId,
      })
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        close();
        setData({});
        return notification.success({ message: "Responsável alterado!" });
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao atualizar o usuário responsável",
        });
      });
  }, [formData?.op?.id, data]);

  return (
    <Modal
      title={formData?.title}
      footer={null}
      visible={visible}
      onCancel={() => close()}
    >
      <FormChild
        data={data}
        setData={setData}
        submit={submitGain}
        formData={formData}
        close={close}
        options={colaborators.map((collab) => ({
          ...collab,
          value: collab?.name,
          key: collab?.id,
        }))}
      />
    </Modal>
  );
});

export default ChangeTechnician;
