import { DashboardChart } from "@/domain";

import * as S from "./styles";

export function TableChart({ data }: { data: DashboardChart["legend"] }) {
  if (!data || data.length === 0) {
    return <>Nenhum dado até o momento</>;
  }

  return (
    <S.TableChart>
      <table>
        <thead>
          {data.map((item) => (
            <tr key={item.name}>
              {item?.name && <th className="name"></th>}

              {item.percentage !== undefined && <th className="percent"></th>}

              {item.value !== undefined && <th className="value"></th>}
            </tr>
          ))}
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.name}>
              {item?.name && (
                <td className="name">
                  <div>
                    {item?.itemStyle?.color && (
                      <div
                        className="color"
                        style={{ backgroundColor: item?.itemStyle?.color }}
                      ></div>
                    )}

                    <span>{item?.name}</span>
                  </div>
                </td>
              )}

              {item?.percentage !== undefined && (
                <td className="percent">
                  <span> {item.percentage}</span>
                </td>
              )}

              {item?.value !== undefined && (
                <td className="value">
                  <span>{item?.value}</span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </S.TableChart>
  );
}
