// @ts-nocheck
import { Form, Input, Modal, notification } from "antd";
import { Button } from "infinity-forge";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { memo, useCallback, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { animalServices } from "@/OLD/services/animal.service";

export const Create = ({ visible, setVisible, reload, setReload, button }) => {
  const queryClient = useQueryClient();
  const [payload, setPayload] = useState();

  const canCreateSpecie = useUserHasPermission("ESP01");

  const { mutate, loading } = useMutation(
    (data) => animalServices.createSpecie(data),
    {
      onSuccess: () => {
        notification.success({
          message: "Sucesso",
          description: "Espécie criada!",
        });
        setPayload(null);
        setVisible(false);
        setReload(!reload);
        queryClient.invalidateQueries("getSpecies");
      },
      onError: () => {
        notification.error({
          message: "Erro",
          description: "Erro ao criar espécie!",
        });
      },
    }
  );

  const handleSubmit = useCallback(() => {
    mutate(payload);
  }, [payload]);

  return (
    <div>
      {button && (
        <Button
          disabled={!canCreateSpecie}
          onClick={() => setVisible(true)}
          text="Criar nova espécie"
        />
      )}
      <Modal
        loading={loading}
        title="Criar espécie"
        visible={visible}
        footer={null}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Form
          layout="vertical"
          onSubmitCapture={handleSubmit}
          id="form-especie-create"
        >
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
          <footer
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <Button
              text="Cancelar"
              type="button"
              onClick={() => setVisible(false)}
            />
            <Button text="Salvar" type="submit" />
          </footer>
        </Form>
      </Modal>
    </div>
  );
};
