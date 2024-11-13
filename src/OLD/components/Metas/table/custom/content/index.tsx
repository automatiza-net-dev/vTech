import {
  FormHandler,
  InputManager,
  LoaderCircle,
  useToast,
} from "infinity-forge";

import { container, metasTypes } from "@/container";
import { RemoteMetas } from "@/data";
import { useLoadPerfomanceRange } from "@/presentation";

import * as S from "./styles";

export function ModalContent({ mutateTable, ...props }) {
  const { data, isLoading, mutate } = useLoadPerfomanceRange(props.id);

  const { createToast } = useToast();

  if (isLoading) {
    return <LoaderCircle color="#444" size={30} />;
  }

  if (!data) {
    return <></>;
  }

  return (
    <S.ModalContent>
      <h2>Faixas de Desempenho</h2>

      <h3 className="font-24-bold">{props?.description}</h3>

      <FormHandler
        debugMode
        isStickyButtons
        initialData={{ ranges: data?.ranges }}
        onSucess={async (payload) => {
          await container
            .get<RemoteMetas>(metasTypes.RemoteMetas)
            .perfomanceRange({
              ...payload,
              ranges: payload?.ranges.map((range) => ({
                ...range,
                startValue: range?.startValue || "0",
                endValue: range?.endValue || "0",
              })),
              metaId: props?.id,
            });

          mutate();

          mutateTable && mutateTable();

          createToast({
            status: "success",
            message: "Ação realizada com sucesso!",
          });
        }}
        button={{ text: "Salvar" }}
      >
        <div className="input-manager-box">
          <InputManager
            gridColumns={1}
            name="ranges"
            loading={isLoading}
            inputPath="ranges"
            inputs={[
              [
                {
                  InputComponent: "Input",
                  type: "number",
                  name: "startValue",
                  label: "De (%)",
                  min: 0,
                },
                {
                  InputComponent: "Input",
                  type: "number",
                  name: "endValue",
                  label: "De (%)",
                  min: 0,
                },
                {
                  InputComponent: "InputColor",
                  name: "color",
                  label: "Cor",
                },
              ],
            ]}
          />
        </div>
      </FormHandler>
    </S.ModalContent>
  );
}
