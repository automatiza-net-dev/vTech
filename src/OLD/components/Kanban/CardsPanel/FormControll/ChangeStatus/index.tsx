// @ts-nocheck
import { memo, useState, useCallback } from "react";

import { opportunitiesService } from "@/OLD/services/opportunities.service";

import { Modal, notification } from "antd";
import FormChild from "../FormChild";

import { useListCrmStatus } from "@/OLD/hooks/useCrmStatus";

const ChangeStatus = memo(function ChangeStatus({
  formData,
  visible,
  close,
  setReload,
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const { crmStatus } = useListCrmStatus();

  const submitChangeStatus = useCallback(() => {
    setLoading(true);

    if (!data?.selectedId) {
      return notification.warning({ message: "Informe o novo status!" });
    }

    opportunitiesService
      .updateStatus(formData?.op?.id, {
        statusId: data?.selectedId,
      })
      .then((_res) => {
        setReload((prv) => !prv);
        close();
        setLoading(false);
        setData({});
        return notification.success({
          message: "Status alterado com sucesso!",
        });
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao atualizar o status da oportunidade...",
        });
      });
  }, [formData, data]);

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
        submit={submitChangeStatus}
        formData={formData}
        close={close}
        options={crmStatus}
      />
    </Modal>
  );
});

export default ChangeStatus;
