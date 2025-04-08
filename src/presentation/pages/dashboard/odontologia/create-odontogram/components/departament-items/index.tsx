import { useFormikContext } from "formik";
import { ItemDepartament, useDepartamentItems } from "../../hooks";

import * as S from "./styles";
import { Departament } from "../departaments";
import { Tooltip, useWindow } from "infinity-forge";

export function DepartamentItems() {
  const { data } = useDepartamentItems();
  const _window = useWindow();
  const isMobile = _window && _window.innerWidth <= 1400;

  const isDeparment4 = isMobile ? 13 : 16;

  const { values, setFieldValue } = useFormikContext<{
    departament: number;
    departamentItems: ItemDepartament[];
  }>();

  const departamentItems = values?.departamentItems;

  return (
    <S.DepartamentItems>
      <div
        className={"items-container"}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${
            values?.departament === 4
              ? isDeparment4
              : values?.departament === 3
              ? 2
              : 1
          }, 1fr)`,
        }}
      >
        {data?.[0]?.items?.map((item) => (
          <div
            key={item.description}
            className="item-card"
            onClick={() => {
              setFieldValue(
                "departamentItems",
                departamentItems?.some((i) => i.id === item.id)
                  ? departamentItems?.filter((i) => i.id !== item.id)
                  : [...(departamentItems || []), item]
              );
            }}
          >
            <img
              src={item.photo}
              alt={item.description}
              style={{
                maxHeight: values?.departament === 1 ? "200px" : "100px",
              }}
            />
            <input
              type="checkbox"
              checked={departamentItems?.some((i) => i.id === item.id)}
              readOnly
            />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Tooltip
          idTooltip="action"
          enableHover
          trigger={
            <button
              type="button"
              className="font-14-bold action"
              onClick={() => setFieldValue("departamentItems", [])}
            >
              <svg
                width="60"
                height="80"
                viewBox="0 0 60 80"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="4"
                  y="6"
                  width="12"
                  height="12"
                  rx="2"
                  stroke="black"
                  stroke-width="2"
                  fill="none"
                />
                <line
                  x1="20"
                  y1="12"
                  x2="50"
                  y2="12"
                  stroke="black"
                  stroke-width="2"
                />

                <rect
                  x="4"
                  y="23"
                  width="12"
                  height="12"
                  rx="2"
                  stroke="black"
                  stroke-width="2"
                  fill="none"
                />
                <line
                  x1="20"
                  y1="29"
                  x2="50"
                  y2="29"
                  stroke="black"
                  stroke-width="2"
                />

                <rect
                  x="4"
                  y="40"
                  width="12"
                  height="12"
                  rx="2"
                  stroke="black"
                  stroke-width="2"
                  fill="none"
                />
                <line
                  x1="20"
                  y1="46"
                  x2="50"
                  y2="46"
                  stroke="black"
                  stroke-width="2"
                />
              </svg>
            </button>
          }
          position="top-center"
          content={"Limpar Itens Selecionados"}
        />
      </div>
    </S.DepartamentItems>
  );
}
