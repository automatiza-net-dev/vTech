// @ts-nocheck
import { Form, Input, Modal } from "antd";
import { memo, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "infinity-forge";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";
import { EditTwoTone } from "@ant-design/icons";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useToast } from "infinity-forge";

export const Edit = memo(({ status }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [payload, setPayload] = useState({
    color: status.color,
    description: status.description,
  });

  const canEditScheduleStatus = useUserHasPermission("AST02");

  const queryClient = useQueryClient();
  const { createToast } = useToast();

  const { mutate, loading } = useMutation({
    queryKey: ["Editfsfs"],
    queryFn: (payload) => scheduleTypeServices.editStatus(status.id, payload),
    onError: () => {
      createToast({ message: "Erro ao editar status", status: "error" });
    },
    onSuccess: () => {
      createToast({ message: "Status editado", status: "success" });

      setIsVisible(false);
      queryClient.invalidateQueries("getAllStatus");
    },
  });

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
