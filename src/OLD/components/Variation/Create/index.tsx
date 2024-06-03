// @ts-nocheck
// Core
import { memo, useCallback, useState } from "react";

// Services
import { variationService } from "@/OLD/services/variation.service";

// Components
import { Button, Input, Modal, notification } from "antd";
import { useMutation, useQueryClient } from "react-query";
const { TextArea } = Input;

const CreateVariation = memo(function CreateVariation({ visible, hide }) {
  const queryClient = useQueryClient();

  const [data, setData] = useState({ description: "" });

  const { mutate, isLoading } = useMutation(
    (newData) => variationService.storeVariation(newData),
    {
      onSuccess: () => {
        notification.success({
          message: "Variação cadastrado com sucesso!",
        });
        queryClient.invalidateQueries(["variations"]);
        setData({ description: "" });
        hide();
      },
      onError: (error) => {
        notification.error({
          message: err.response.data.errors[0].message,
        });
      },
    }
  );

  const submitCreate = useCallback(() => {
    mutate(data);
  }, [data]);

  return (
    <Modal visible={visible} footer={null} title="Cadastro de variação">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitCreate();
        }}
      >
        <div className="uk-margin-top">
          <label>Descrição</label>
          <TextArea
            value={data?.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </div>

        <hr />
        <footer className="uk-flex uk-flex-right">
          <div className="uk-width-1-2 uk-flex uk-flex-around">
            <Button htmlType="submit" type="primary" disabled={isLoading}>
              Salvar
            </Button>
            <Button
              onClick={() => {
                setData({ description: "" });
                hide();
              }}
            >
              Cancelar
            </Button>
          </div>
        </footer>
      </form>
    </Modal>
  );
});

export default CreateVariation;
