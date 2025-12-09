import { api, FormHandler } from "infinity-forge";

import { InputRefCusto } from "./components";
import InputTotal from "./components/total";

import { flattenHierarchyToObject } from "./utils";

import { Agrupamento, DreItem } from "./types";

import * as S from "./styles";
import { useEffect, useState } from "react";

export function ReportDRE(props: {
  dre?: DreItem[];
  mutate: () => void;
  setDateDRE: any;
  dateDRE?: string;
  months?: number;
  setMonths: React.Dispatch<React.SetStateAction<number>>;
}) {
  const flatten = flattenHierarchyToObject(props.dre);

  const [renderingState, setRenderingState] = useState<"not-ready" | "ready">(
    "not-ready",
  );
  useEffect(() => {
    setRenderingState("ready");
  }, []);

  return (
    <S.ReportDRE>
      <FormHandler
        isStickyButtons
        debugMode
        cleanFieldsOnSubmit={false}
        button={{ text: "Salvar" }}
        customAction={{
          Component: () => (
            <>
              {!props.months && (
                <button
                  type="button"
                  className="retroativo"
                  onClick={() => props.setMonths(1)}
                >
                  REPLICAR CUSTO DO MÊS ANTERIOR
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  props.setMonths(0);
                  props.setDateDRE(null);
                }}
                className="cancel"
              >
                Cancelar
              </button>
            </>
          ),
          props: {},
        }}
        onSucess={async ({
          dre,
          dreFlatten,
        }: {
          dre: DreItem;
          dreFlatten?: { [key in string]: Agrupamento };
        }) => {
          if (dre && Array.isArray(dre)) {
            for (const dreItem of dre as DreItem[]) {
              if (dreItem) {
                await api({
                  url: "dre-groups/store-planning",
                  method: "post",
                  body: {
                    period: dreItem?.periodo,
                    accountPlans:
                      dreFlatten &&
                      Object.keys(dreFlatten)
                        .map((tag) => dreFlatten[tag])
                        ?.filter(
                          (item) =>
                            (!item.refs || item.refs?.length === 0) &&
                            item.custo,
                        )
                        ?.map((i) => {
                          const custo = Number(i.custo || 0);
                          return {
                            accountPlanId: i.id,
                            cost: custo < 0 ? custo * -1 : custo,
                          };
                        }),
                  },
                });
              }
            }
          }

          await props.mutate();

          props.setDateDRE(null);
        }}
        initialData={{
          dre: props?.dre,
          basear: flatten?.basear,
          dreFlatten: flatten?.dreFlatten,
          dreFlattenArray: flatten?.dreSplittedArray,
        }}
      >
        <div
          className="top_titles"
          style={{ display: "flex", marginBottom: 5 }}
        >
          <div style={{ width: 300, marginRight: 65 }}></div>

          <div
            style={{
              width: 252,
              marginRight: 20,
              textAlign: "center",
              background: "#000",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h3
              className="font_title"
              style={{ color: "#fff", marginBottom: 0, fontWeight: 700 }}
            >
              ORÇADO
            </h3>
          </div>
          <div
            style={{
              width: 252,
              textAlign: "center",
              background: "#000",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h3
              className="font_title"
              style={{ color: "#fff", marginBottom: 0, fontWeight: 700 }}
            >
              REALIZADO
            </h3>
          </div>
        </div>

        {props.dre?.map((report: DreItem) => {
          return (
            <div key={report.id}>
              {report.itens.map((item, index) => (
                <Group
                  key={item.tag}
                  {...item}
                  groupLevel={1}
                  index={index}
                  initialFlattenList={flatten.dreFlatten}
                  renderingState={renderingState}
                />
              ))}
            </div>
          );
        })}
      </FormHandler>
    </S.ReportDRE>
  );
}

function Group(
  props: Agrupamento & {
    initialFlattenList: any;
    index?: number;
    groupLevel: number;
    renderingState: "ready" | "not-ready";
  },
) {
  function GroupRecursive() {
    return (
      <>
        {props?.itens?.map((item) => (
          <Group
            key={item.tag}
            {...item}
            groupLevel={props.groupLevel + 1}
            index={undefined}
            initialFlattenList={props?.initialFlattenList}
            renderingState={props.renderingState}
          />
        ))}
      </>
    );
  }

  return (
    <div className="group">
      {props.groupLevel === 1 && <GroupRecursive />}

      <div className="group_top">
        <span
          className={`font-12-${
            props.groupLevel > 2 ? "regular" : "bold"
          } description`}
          style={{
            paddingLeft:
              props.groupLevel === 3
                ? "10px"
                : props.groupLevel === 4
                  ? "20px"
                  : "5px",
          }}
        >
          {props?.description || "--"}
        </span>

        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ position: "relative" }}>
            <InputRefCusto
              {...props}
              trick={props.renderingState === "ready" && props.tag === "100066"}
            />
          </div>

          <div style={{ position: "relative" }}>
            <InputTotal {...props} />
          </div>
        </div>
      </div>

      {props.groupLevel > 1 && <GroupRecursive />}
    </div>
  );
}
