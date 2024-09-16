// @ts-nocheck
import { convertDate } from "@/OLD/utils/convertDate";
import { Delete } from "./Delete";
import { Edit } from "./Edit";

export const columns = (edit) => {
  const columns = [
    {
      title: "Descrição",
      key: "title",
      dataIndex: "title",
    },
    {
      title: "Dia da semana",
      dataIndex: "frequency",
      render: (text) => (
        <div>
          {text.map((item) => (
            <>{item}&nbsp;|&nbsp; </>
          ))}
        </div>
      ),
    },
    {
      title: "Hora de entrada",
      dataIndex: "start_hour",
      key: "start_hour",
    },
    {
      title: "Hora de saída",
      dataIndex: "end_hour",
      key: "end_hour",
    },
    {
      title: "Data de entrada",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "Data de saída",
      dataIndex: "end_date",
      key: "end_date",
    },
  ];

  edit &&
    columns.push({
      title: "Ações",
      render: (item) => {
        return (
          <div className="uk-flex" style={{ gap: "10px" }}>
            <Delete id={item.id} />
            <Edit item={item} />
          </div>
        );
      },
    });

  return columns;
};
