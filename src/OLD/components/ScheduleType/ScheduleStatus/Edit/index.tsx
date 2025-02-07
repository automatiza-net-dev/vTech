// @ts-nocheck
import { Form, Input, Modal, notification } from "antd";
import { memo, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";
import { EditTwoTone } from "@ant-design/icons";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

export const Edit = memo(({ status }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [payload, setPayload] = useState({
    color: status.color,
    description: status.description,
  });

  const canEditScheduleStatus = useUserHasPermission("AST02");

  const queryClient = useQueryClient();

  const { mutate, loading } = useMutation(
    (payload) => scheduleTypeServices.editStatus(status.id, payload),
    {
      onError: () => {
        notification.error({
          message: "Erro",
          description: "Erro ao editar status",
        });
      },
      onSuccess: () => {
        notification.success({
          message: "Sucesso",
          description: "Status editado",
        });
        setIsVisible(false);
        queryClient.invalidateQueries("getAllStatus");
      },
    }
  );

  return (
    <div>
        {canEditScheduleStatus && (
          <EditTwoTone onClick={() => setIsVisible(true)}>Editar</EditTwoTone>
        )}

      <Modal
        loading={loading}
        title="Editar status"
        onCancel={() => setIsVisible(false)}
        onOk={() => document.getElementById(`submit-edit-${status.id}`).click()}
        visible={isVisible}
      >
        <Form layout="vertical" onSubmitCapture={() => mutate(payload)}>
          <Form.Item label="Descrição">
            <Input
              type="text"
              required
              value={payload?.description}
              placeholder="Escreva uma descrição"
              onChange={(e) =>
                setPayload({ ...payload, description: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Cor">
            <Input
              type="color"
              required
              value={payload?.color}
              onChange={(e) => {
                setPayload({ ...payload, color: e.target.value });
              }}
            />
          </Form.Item>
          <input
            id={`submit-edit-${status.id}`}
            type="submit"
            style={{ display: "none" }}
          />
        </Form>
      </Modal>
    </div>
  );
});
