import { api, FormHandler } from "infinity-forge";

import { InputRefCusto } from "./components";
import { flattenHierarchyToObject } from "./utils";

import { Agrupamento, DreItem } from "./types";

import * as S from "./styles";
import { InputTotal } from "./components/total";

export function ReportDRE(props: {
  dre?: DreItem[];
  mutate: () => void;
  setDateDRE: any;
}) {
  const flatten = flattenHierarchyToObject(props.dre);

  return (
    <S.ReportDRE>
      <FormHandler
        isStickyButtons
        debugMode
        cleanFieldsOnSubmit={false}
        button={{ text: "Salvar" }}
        customAction={{
          Component: () => (
            <button
              type="button"
              onClick={() => props.setDateDRE(null)}
              className="cancel"
            >
              Cancelar
            </button>
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
                        .map((flattenId) => dreFlatten[flattenId])
                        ?.filter((item) => item.refs?.length === 0)
                        ?.map((i) => {
                          return {
                            accountPlanId: i.id,
                            cost: Number(i.custo || 0),
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
  }
) {
  return (
    <div className="group">
      <div className="group_top">
        <span
          className={`font-12-${props.groupLevel > 2 ? "regular" : "bold"} description`}
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
            {props.index === 0 && <h3 className="font_title">ORÇADO</h3>}
            <InputRefCusto {...props} />
          </div>

          <div style={{ position: "relative" }}>
            {props.index === 0 && <h3 className="font_title">REALIZADO</h3>}
            <InputTotal {...props} />
          </div>
        </div>
      </div>

      {props?.itens?.map((item) => (
        <Group
          key={item.tag}
          {...item}
          groupLevel={props.groupLevel + 1}
          index={undefined}
          initialFlattenList={props?.initialFlattenList}
        />
      ))}
    </div>
  );
}
