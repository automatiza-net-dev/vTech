// @ts-nocheck
import { Form, Input, Modal, Select } from "antd";
import { Button, useToast } from "infinity-forge";
import { memo, useCallback, useEffect, useState } from "react";
import { useMutation } from "infinity-forge";
import { useQueryClient } from "infinity-forge";
import { metasService } from "@/OLD/services/metas.service";

export const Create = ({ canCreate }) => {
  const queryClient = useQueryClient();
  const [payload, setPayload] = useState({
    description: "",
    type: "R$",
  });

  const { createToast } = useToast();

  const [visible, setVisible] = useState(false);
  const { Option } = Select;

  useEffect(() => {
    if (!canCreate) {
      return;
    }

    setPayload({
      description: "",
      type: "R$",
    });
  }, [canCreate]);

  const { mutate, isLoading } = useMutation({
    queryKey: ["CreateRandomb"],
    queryFn: (data) => metasService.create(data),
    onSuccess: () => {
      setVisible(false);
      setPayload({});
      queryClient.invalidateQueries(["metas"]);
      return createToast({
        message: "Meta criada com sucesso",
        status: "success",
      });
    },
    onError: (error) => {
      const errorData = error?.response?.data;

      if (errorData && errorData?.message?.includes("Meta já cadastrada")) {
        return createToast({
          message: "Meta existente com a descrição informada",
          status: "error",
        });
      }
    },
  });

  const handleSubmit = useCallback(() => {
    mutate(payload);
  }, [payload]);

  return (
    <div>
      {canCreate && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px",
          }}
        >
          <Button onClick={() => setVisible(true)} text="Criar nova meta" />
        </div>
      )}
      <Modal
        loading={isLoading}
        title="Criar meta"
        visible={visible}
        footer={null}
      >
        <Form
          layout="vertical"
          onSubmitCapture={handleSubmit}
          id="form-create-meta"
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
          <Form.Item label="Tipo Meta">
            <Select
              onChange={(e) => setPayload({ ...payload, type: e })}
              value={payload?.type}
            >
              <Option value="R$">Valor (R$)</Option>
              <Option value="%">Porcentagem (%)</Option>
              <Option value="Qtd">Quantidade</Option>
            </Select>
          </Form.Item>
          <hr />
          <div className="uk-flex uk-flex-right" style={{ gap: "10px" }}>
            <Button type="primary" htmlType="submit" text="Criar" />
            <Button
              text="Cancelar"
              type="button"
              onClick={() => setVisible(false)}
            />
          </div>
        </Form>
      </Modal>
    </div>
  );
};
