// Core
import { memo, useCallback, useState } from "react";

// Services
import { variationGroupService } from "@/OLD/services/variation-group.service";

// Components
import { Button, Input, Modal } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { useToast } from "infinity-forge";
const { TextArea } = Input;

const CreateVariationGroup = memo(function CreateVariationGroup({
  visible,
  hide,
}: any) {
  const queryClient = useQueryClient();

  const [data, setData] = useState({ description: "" });

  const {createToast} = useToast()

  const { mutate, isLoading } = useMutation(
    (newData) => variationGroupService.storeVariationGroup(newData),
    {
      onSuccess: () => {
    

        createToast({ status: "success", message: "Grupo de variação cadastrado com sucesso!" })

        queryClient.invalidateQueries(["variation-groups"]);
        setData({ description: "" });
        hide();
      },
      onError: (err: any) => {
        createToast({ status: "error", message:  err.response.data.errors[0].message })
      },
    }
  );

  const submitCreate = useCallback(() => {
    mutate(data as any);
  }, [data]);

  return (
    <Modal
      visible={visible}
      footer={null}
      title="Cadastro de grupos de variação"
    >
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

export default CreateVariationGroup;
