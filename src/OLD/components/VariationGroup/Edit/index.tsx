// @ts-nocheck
// Core
import { memo, useCallback, useEffect, useState } from "react";

// Services
import { variationGroupService } from "@/OLD/services/variation-group.service";

// Components
import { Button, Input, Modal, Select, Switch } from "antd";
import { useMutation, useQueryClient } from "react-query";
const { TextArea } = Input;
const { Option } = Select;

const UpdateVariationGroup = memo(function UpdateVariationGroup({
  groupInfo,
  visible,
  hide,
}: any) {
  const queryClient = useQueryClient();

  const [data, setData] = useState(null);

  useEffect(() => {
    if (!groupInfo) return;

    setData({
      description: groupInfo.description,
      active: groupInfo.active,
    });
  }, [groupInfo]);

  const { mutate, isLoading } = useMutation(
    (newData) =>
      variationGroupService.updateVariationGroup(groupInfo.id, newData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["variation-groups"]);
        hide();
      },
    }
  );

  const submit = useCallback(() => {
    mutate({
      description: data.description,
      active: data.active,
      parent_id: data.parent_id,
    } as any);
  }, [data]);

  return (
    <Modal
      title="Atualizar informações do subgrupo"
      visible={visible}
      onCancel={hide}
      footer={null}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="uk-margin-top">
          <label>Descrição</label>
          <TextArea
            value={data?.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </div>

        <div className="uk-margin-top uk-flex uk-flex-around">
          <div className="uk-flex uk-flex-column uk-flex-middle uk-margin-bottom">
            <label>Ativo</label>
            <Switch
              checked={data?.active}
              onChange={(e) => setData({ ...data, active: e })}
            />
          </div>
        </div>
        <hr />
        <footer className="uk-flex uk-flex-right">
          <div className="uk-width-1-2 uk-flex uk-flex-around">
            <Button htmlType="submit" type="primary" disabled={isLoading}>
              Salvar
            </Button>
            <Button onClick={hide}> Cancelar </Button>
          </div>
        </footer>
      </form>
    </Modal>
  );
});

export default UpdateVariationGroup;
