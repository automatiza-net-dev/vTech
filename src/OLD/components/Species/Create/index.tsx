// @ts-nocheck
import { Form, Input, Modal, notification } from "antd";
import { Button } from "@/OLD/components/mini-components";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { memo, useCallback, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { animalServices } from "@/OLD/services/animal.service";

export const Create = memo(
  ({ visible, setVisible, reload, setReload, button }) => {
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
          <Button disabled={!canCreateSpecie} onClick={() => setVisible(true)}>
            Criar nova espécie
          </Button>
        )}
        <Modal
          loading={loading}
          title="Criar espécie"
          visible={visible}
          onOk={() => document.getElementById("create-specie").click()}
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
            <input
              type={"submit"}
              id="create-specie"
              style={{ display: "none" }}
            />
          </Form>
        </Modal>
      </div>
    );
  }
);
