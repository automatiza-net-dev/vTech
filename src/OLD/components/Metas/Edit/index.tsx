// @ts-nocheck
import { Form, Input, Modal, Select, Button as ButtonA } from "antd";
import { memo, useCallback, useState, useEffect } from "react";
import { useMutation, useQueryClient } from "infinity-forge";
import { FiEdit2 } from "react-icons/fi";
import { metasService } from "@/OLD/services/metas.service";
import { Switch } from "antd";
import { useToast } from "infinity-forge";

export const Edit = memo(({ item, canUpdate }) => {
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(false);
  const { Option } = Select;
  const [payload, setPayload] = useState({});

  const { createToast } = useToast();

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    setPayload({
      description: item.description,
      type: item.type,
      active: item.active,
    });
  }, [item, isVisible]);

  const { mutate, isLoading } = useMutation({
    queryKey: ["Edit"],
    queryFn: (data) => metasService.updateMeta(item.id, data),
    onSuccess: () => {
      createToast({ status: "success", message: "Sucesso" });

      setIsVisible(false);
      queryClient.invalidateQueries(["metas"]);
    },
    onError: () => {
      createToast({ status: "error", message: "Erro ao editar meta!" });
    },
  });

  const handleSubmit = useCallback(() => {
    mutate(payload);
  }, [payload, item.id]);

  const reset = useCallback(() => {
    setPayload({
      description: item.description,
      type: item.type,
      active: item.active,
    });
  }, [item.id]);

  return (
    <div>
      {canUpdate && (
        <FiEdit2 
          style={{ cursor: 'pointer', fontSize: '1.2rem' }} 
          onClick={() => setIsVisible(true)}
        />
      )}

      <Modal
        loading={isLoading}
        title="Editar espécie"
        visible={isVisible}
        onCancel={() => {
          setIsVisible(false);
        }}
        footer={
          <div className="uk-flex uk-flex-right" style={{ gap: "10px" }}>
            <ButtonA onClick={() => reset()}>Resetar</ButtonA>
            <ButtonA onClick={() => setIsVisible(false)}>Cancelar</ButtonA>
          </div>
        }
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

          <Form.Item label="Tipo Pelagem">
            <Select
              onChange={(e) => setPayload({ ...payload, type: e })}
              value={payload?.type}
            >
              <Option value="R$">Valor (R$)</Option>
              <Option value="%">Porcentagem (%)</Option>
              <Option value="Qtd">Quantidade</Option>
            </Select>
          </Form.Item>

          <div className="uk-margin-top uk-flex uk-flex-around">
            <div className="uk-flex uk-flex-column uk-flex-middle uk-margin-bottom">
              <label>Ativo</label>
              <Switch
                checked={payload?.active}
                onChange={(e) => setPayload({ ...payload, active: e })}
              />
            </div>
          </div>

          <div className="uk-flex uk-flex-right" style={{ gap: "10px" }}>
            <ButtonA type="primary" htmlType="submit">
              Editar
            </ButtonA>
          </div>
        </Form>
      </Modal>
    </div>
  );
});
