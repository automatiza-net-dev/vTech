// @ts-nocheck
import { Button, Form, Input, Modal, notification, Select } from "antd";
import { memo, useCallback, useState } from "react";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";

import { permissionControl } from "@/OLD/utils/permissionsControlFake";

export const CreateTypeService = memo(
  ({ isModalVisible, setIsModalVisible, setRefresh }) => {
    const { Option } = Select;
    const [loading, setLoading] = useState();
    const [data, setData] = useState(null);

    const permissions = permissionControl("tipoServicosAgendamento");

    const handleOk = useCallback(() => {
      document.getElementById("submit-button-service").click();
    }, []);

    const handleSubmit = useCallback(() => {
      if (!permissions?.ATS1) {
        return notification.error({ message: "Ação não permitida" });
      }

      setLoading(true);

      scheduleTypeServices
        .createScheduleServiceGroup(data)
        .then((res) => {
          setIsModalVisible(false);
          notification.success({
            message: "Sucesso",
            description: "Tipo de serviço cadastrado",
          });
        })
        .catch((err) => {
          notification.error({
            message: "Erro",
            description: "Erro ao criar tipo de serviço",
          });
        })
        .finally(() => {
          setLoading(false);
          setData({});
          setRefresh();
        });
    }, [data, loading]);

    return (
      <Modal
        title="Criar tipo de serviço"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        loading={loading}
      >
        <Form layout="vertical" onSubmitCapture={handleSubmit}>
          <Form.Item label="Descrição">
            <Input
              required
              placeholder="Descrição"
              value={data?.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
          </Form.Item>
          <input
            type="submit"
            id="submit-button-service"
            style={{ display: "none" }}
          />
        </Form>
      </Modal>
    );
  }
);
