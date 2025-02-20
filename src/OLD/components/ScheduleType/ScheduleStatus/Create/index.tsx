// @ts-nocheck
import { Form, Input, Modal } from "antd";
import { Button, useToast } from "infinity-forge";
import { memo, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";

export const Create = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [payload, setPayload] = useState();
  const queryClient = useQueryClient();

  const canCreateScheduleStatus = useUserHasPermission("AST01");
  const { createToast } = useToast();

  const { mutate, loading } = useMutation(
    (payload) => scheduleTypeServices.createStatus(payload),
    {
      onError: () => {
        createToast({ message: "Erro ao cadastrar status", status: "error" });
      },
      onSuccess: () => {
        createToast({ message: "Status cadastrado", status: "success" });

        setPayload(null);
        setIsVisible(false);
        queryClient.invalidateQueries("getAllStatus");
      },
    }
  );

  return (
    <div>
      <Button
        onClick={() => setIsVisible(true)}
        disabled={!canCreateScheduleStatus}
        text="Criar status"
      />

      <Modal
        loading={loading}
        title="Criar status"
        onCancel={() => setIsVisible(false)}
        onOk={() => document.getElementById("submit-create").click()}
        visible={isVisible}
      >
        <Form layout="vertical" onSubmitCapture={() => mutate(payload)}>
          <Form.Item label="Descrição">
            <Input
              type="text"
              required
              placeholder="Escreva uma descrição"
              value={payload?.description}
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
              onChange={(e) =>
                setPayload({ ...payload, color: e.target.value })
              }
            />
          </Form.Item>
          <input id="submit-create" type="submit" style={{ display: "none" }} />
        </Form>
      </Modal>
    </div>
  );
});
