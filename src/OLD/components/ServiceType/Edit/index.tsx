// @ts-nocheck
import { Form, Input, Modal, Select } from "antd";
import { LoadingSpin } from "@/OLD/components/mini-components";
import { Button, useToast } from "infinity-forge";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

// Icons
import { EditTwoTone } from "@ant-design/icons";

export const Edit = ({ icon, id, reload, setReload }) => {
  const { Option } = Select;
  const router = useRouter();
  const idRouter = router?.query?.innerpage;
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { createToast } = useToast();

  const canEditTypeScheduleService = useUserHasPermission("ATS02");

  const handleOk = useCallback(() => {
    document.getElementById("submit-button").click();
  }, []);

  const handleEdit = useCallback(() => {
    setLoading(true);
    scheduleTypeServices
      .editSingleScheduleServiceGroup(!idRouter ? id : idRouter, data)
      .then((_res) => {
        setIsModalVisible(false);
        createToast({
          message: "Tipo de agendamento editado!",
          status: "success",
        });
      })
      .catch((_err) => {
        createToast({
          message: "Erro ao editar tipo de agendamento",
          status: "error",
        });
      })
      .finally(() => {
        setLoading(false);
        setReload(!reload);
      });
  }, [data, router, id, idRouter]);

  const handleGet = useCallback(() => {
    setLoading(true);
    scheduleTypeServices
      .getSingleScheduleServiceGroup(!idRouter ? id : idRouter)
      .then((res) => {
        setData({
          ...res.data,
          reservedMinutes: res.data.reserved_minutes,
          scheduleServiceGroupId: res.data.schedule_service_group_id,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, id]);

  useEffect(() => {
    handleGet();
  }, [router, handleGet, reload]);

  return (
    <div>
      {canEditTypeScheduleService && (
        <EditTwoTone
          onClick={() =>
            permissions?.ATS2
              ? createToast({ message: "Ação não permitida", status: "error" })
              : setIsModalVisible(true)
          }
          className="uk-margin-small-left"
        />
      )}
      <Modal
        title="Editar"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        loading={loading}
      >
        <Form layout="vertical" onSubmitCapture={handleEdit}>
          <Form.Item label="Descrição">
            <Input
              required
              placeholder=""
              value={data?.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Status">
            <Select
              required
              value={data?.active ? "Ativo" : "Inativo"}
              onChange={(e) => {
                setData({ ...data, active: e });
              }}
            >
              <Option value={true}>Ativo</Option>
              <Option value={false}>Inativo</Option>
            </Select>
          </Form.Item>
          <input type="submit" id="submit-button" style={{ display: "none" }} />
        </Form>
      </Modal>
    </div>
  );
};
