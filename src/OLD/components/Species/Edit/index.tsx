// @ts-nocheck
import { Form, Input, Modal, notification } from "antd";
import { memo, useCallback, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { animalServices } from "@/OLD/services/animal.service";
import { EditTwoTone } from "@ant-design/icons";

export const Edit = memo(({ item, reload, setReload }) => {
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(false);
  const [payload, setPayload] = useState({
    description: item.description,
    code: item.code,
  });

  const { mutate, loading } = useMutation(
    (data) => animalServices.editSpecie(data, item.id),
    {
      onSuccess: () => {
        notification.success({
          message: "Sucesso",
          description: "Espécie editada!",
        });
        setReload(!reload);
        setPayload();
        setIsVisible(false);
        queryClient.invalidateQueries("getSpecies");
      },
      onError: () => {
        notification.error({
          message: "Erro",
          description: "Erro ao editar espécie!",
        });
      },
    }
  );

  const handleSubmit = useCallback(() => {
    mutate(payload);
  }, [payload]);

  return (
    <div>
        <EditTwoTone onClick={() => setIsVisible(true)}>Editar</EditTwoTone>
      <Modal
        loading={loading}
        title="Editar espécie"
        visible={isVisible}
        onOk={() => document.getElementById(`edit-specie-${item.id}`).click()}
        onCancel={() => {
          setIsVisible(false);
        }}
      >
        <Form layout="vertical" onSubmitCapture={handleSubmit}>
          <Form.Item label="Descrição">
            <Input
              required
              max="14"
              value={payload?.description}
              onChange={(e) =>
                setPayload({ ...payload, description: e.target.value })
              }
            />
          </Form.Item>
          <input
            type={"submit"}
            id={`edit-specie-${item.id}`}
            style={{ display: "none" }}
          />
        </Form>
      </Modal>
    </div>
  );
});
