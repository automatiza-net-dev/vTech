// @ts-nocheck
import { Button, DatePicker, Input, Modal, Select, Tooltip } from "antd";
import moment from "moment";
import * as React from "react";
import { useQueryClient } from "react-query";
import { useCancelBudget } from "@/OLD/hooks/useBudgets";
import { useGetAllReasons } from "@/OLD/hooks/useReasons";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { BsXCircle } from "react-icons/bs";
import { useDictionary } from "@/presentation";

const CancelBudget = React.memo(function CancelBudget({
  budget,
  setReload = false
}) {
  const {getWord} = useDictionary()

  const queryClient = useQueryClient();
  const [visible, setVisible] = React.useState(false);
  const [formData, setFormData] = React.useState({
    finishedAt: moment()
  });


  const cancelBudgetPermission = useUserHasPermission("ORC04");

  const { data: reasons } = useGetAllReasons({
    enabled: visible,
    params: { type: "OR" }
  });
  const { mutate, isLoading } = useCancelBudget(budget.id);


  const validBudget =
    budget.status === "ABERTO" || budget.status === `Orçamento em aberto` || budget.status === "Nao Aprovada";

  const submit = React.useCallback(() => {
    if (!validBudget) {
      return;
    }

    mutate(formData, {
      onSuccess: () => {
        setVisible(false);
        setFormData({
          finishedAt: moment()
        });
        queryClient.invalidateQueries(["budgets"]);
        setReload && setReload((prv) => !prv);
      }
    });
  }, [validBudget, formData]);

  React.useEffect(() => {
    setFormData({
      finishedAt: moment()
    });
  }, [visible]);

  return (
    <>
      {cancelBudgetPermission && (
        <Tooltip title={`Cancelar ${getWord("Orçamento")}`}>
          <BsXCircle
            className="icon"
            size={20}
            onClick={() =>
              validBudget ? setVisible((prevState) => !prevState) : null
            }
            style={{ opacity: validBudget ? 1 : 0.5 }}
          />
        </Tooltip>
      )}

      <Modal
        visible={visible}
        footer={null}
        title={`Cancelar ${getWord("Orçamento")} - ${budget?.tag}`}
        width={600}
        onCancel={() => setVisible((prevState) => !prevState)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div className="uk-width-1-1">
            <label>Motivo</label>
            <Select
              placeholder="Motivo"
              value={formData?.reasonId}
              onChange={(value) =>
                setFormData((prevState) => ({ ...prevState, reasonId: value }))
              }
              style={{ width: "100%" }}
              options={reasons?.map((reason) => ({
                label: reason.reason,
                value: reason.id
              }))}
            />
          </div>

          <div className="uk-width-1-1">
            <label>Hora</label>
            <DatePicker
              showTime
              format="HH:mm DD/MM/YYYY"
              style={{ width: "100%" }}
              value={formData.finishedAt}
              onChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  finishedAt: value
                }));
              }}
            />
          </div>

          <div className="uk-width-1-1">
            <label>Observação</label>
            <Input.TextArea
              rows={2}
              value={formData?.canceledObservation}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  canceledObservation: e.target.value
                }))
              }
            />
          </div>
          <div className="uk-width-1-1">
            <label>Observação Interna</label>
            <Input.TextArea
              rows={2}
              value={formData?.internalObservation}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  internalObservation: e.target.value
                }))
              }
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
                  setFormData({
                    finishedAt: moment()
                  });
                  setVisible((prevState) => !prevState);
                }}
              >
                Cancelar
              </Button>
            </div>
          </footer>
        </form>
      </Modal>
    </>
  );
});

export default CancelBudget;
