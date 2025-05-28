// @ts-nocheck
// Core
import { memo, useCallback, useEffect, useState } from "react";

// Services
import { subgroupsService } from "@/OLD/services/subgroups.service";

// Components
import { Button, Input, Modal, Select, Switch } from "antd";
import { useMutation } from "@/presentation/use-query";
import { useQueryClient } from "@/presentation/use-query";
const { TextArea } = Input;
const { Option } = Select;

// Utils
import { permissionControl } from "@/OLD/utils/permissionsControlFake";
import { useToast } from "infinity-forge";

const UpdateSubgroup = memo(function UpdateSubgroup({
  subgroupInfo,
  visible,
  hide,
  subgroups = [],
}) {
  const queryClient = useQueryClient();
  const { createToast } = useToast();
  const [data, setData] = useState(null);

  const permissions = permissionControl("subgrupos");

  useEffect(() => {
    if (!subgroupInfo) return;

    setData({
      description: subgroupInfo.description,
      active: subgroupInfo.active,
      parent: subgroupInfo.parent_id,
    });
  }, [subgroupInfo]);

  const { mutate, isLoading } = useMutation({
    queryKey: ["UpdateSubgroup"],
    queryFn: (newData) =>
      subgroupsService.updateSubgroup(subgroupInfo.id, newData),
    onSuccess: () => {
      queryClient.invalidateQueries(["subgroups"]);
      hide();
    },
  });

  const submit = useCallback(() => {
    if (!permissions?.SBG2) {
      return createToast({ message: "Ação não permitida!", status: "error" });
    }

    mutate({
      description: data.description,
      active: data.active,
      parent: data.parent,
    });
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

        <div className="uk-margin-top">
          <span>Subgrupo</span>
          <Select
            className="uk-width-1-1"
            value={data?.parent}
            onChange={(e) => {
              setData({ ...data, parent: e });
            }}
          >
            {subgroups
              .filter((s) => s.id !== subgroupInfo?.id)
              .map((item, i) => (
                <Option key={i} value={item?.id}>
                  {item?.description}
                </Option>
              ))}
          </Select>
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

export default UpdateSubgroup;
