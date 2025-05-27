// @ts-nocheck
import { Form, Input, Modal } from "antd";
import { memo, useCallback, useState } from "react";
import { useMutation, useQueryClient } from "infinity-forge";
import { animalServices } from "@/OLD/services/animal.service";
import { FiEdit2 } from "react-icons/fi";
import { useToast } from "infinity-forge";

export const Edit = memo(({ item, reload, setReload }) => {
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(false);
  const [payload, setPayload] = useState({
    description: item.description,
    code: item.code,
  });

  const { createToast } = useToast();

  const { mutate, loading } = useMutation({
    queryKey: ["Editaaa"],
    queryFn: (data) => animalServices.editSpecie(data, item.id),
    onSuccess: () => {
      createToast({ message: "Espécie editada!", status: "success" });

      setReload(!reload);
      setPayload();
      setIsVisible(false);
      queryClient.invalidateQueries(["getSpecies"]);
    },
    onError: () => {
      createToast({ message: "Erro ao editar espécie!", status: "error" });
    },
  });

  const handleSubmit = useCallback(() => {
    mutate(payload);
  }, [payload]);

  return (
    <div>
      <FiEdit2
        onClick={() => {
          setIsVisible(true);
        }}
        style={{ cursor: 'pointer', fontSize: '1.2rem' }}
      />
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
