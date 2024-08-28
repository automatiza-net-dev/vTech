import { DashboardChart } from "@/domain";

import * as S from "./styles";

export function TableChart({ data }: { data: DashboardChart["legend"] }) {
  if (!data) {
    return <>Nenhum dado até o momento</>;
  }

  return (
    <S.TableChart>
      <table>
        <thead>
          {data.map((list, listIndex) => (
            <tr key={listIndex}>
              {list.map(
                (item, itemIndex) =>
                  listIndex === 0 &&
                  item.value !== "" &&
                  item?.title && (
                    <th className="name" key={itemIndex}>
                      <span>{item.title}</span>
                    </th>
                  )
              )}
            </tr>
          ))}
        </thead>

        <tbody>
          {data.map((list, listIndex) => (
            <tr key={listIndex}>
              {list.map(
                (item, itemIndex) =>
                  item?.value && (
                    <td className="name" key={itemIndex}>
                      <div>
                        {item?.itemStyle?.color && (
                          <div
                            className="color"
                            style={{ backgroundColor: item?.itemStyle?.color }}
                          ></div>
                        )}

                        <span>{item?.value}</span>
                      </div>
                    </td>
                  )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </S.TableChart>
  );
}
