// @ts-nocheck
// Core
import { memo, useCallback, useState } from "react";

// Services
import { subgroupsService } from "@/OLD/services/subgroups.service";

// Components
import { Button, Input, Select } from "antd";
import { useMutation, useQueryClient } from "infinity-forge";

  import { Modal } from "infinity-forge"

const { TextArea } = Input;

export default function CreateSubgroup({
  visible,
  hide,
  subgroups = [],
}) {
  const queryClient = useQueryClient();

  const [data, setData] = useState({ description: "", parent: null });

  const { mutate, isLoading } = useMutation(
    (newData) => subgroupsService.storeSubgroup(newData),
    {
      onSuccess: () => {
        createToast({
          message: "Exame cadastrado com sucesso!",
          status: "success",
        });

        queryClient.invalidateQueries(["subgroups"]);
        setData({ description: "", parent: null });
      },
      onError: (error) => {
        createToast({
          message: err.response.data.errors[0].message,
          status: "error",
        });
      },
    }
  );

  const submitExam = useCallback(() => {
    mutate(data);
  }, [data]);

  console.log(visible)

  return (
    <Modal open={visible} onClose={() => hide()}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitExam();

        hide();

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
          <span>Subgrupo Pai</span>
          <Select
            className="uk-width-1-1"
            value={
              subgroups.find((item) => item?.id === data?.parent)?.description
            }
            onChange={(e) => setData({ ...data, parent: e })}
          >
            {subgroups
              .sort((a, b) => a.description.localeCompare(b.description))
              .map((item, i) => (
                <Option key={i} value={item?.id}>
                  {item?.description}
                </Option>
              ))}
          </Select>
        </div>

        <hr />
        <footer className="uk-flex uk-flex-right">
          <div className="uk-width-1-2 uk-flex uk-flex-around">
            <Button htmlType="submit" type="primary" disabled={isLoading}>
              Salvar
            </Button>
            <Button
              onClick={() => {
                setData({ description: "", parent: null });
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
}

