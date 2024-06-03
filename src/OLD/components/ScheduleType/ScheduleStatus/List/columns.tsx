// @ts-nocheck
import { Tag } from "antd";
import { Delete } from "../Delete";
import { Edit } from "../Edit";

export const columns = [
  {
    title: "Descrição",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Cor",
    dataIndex: "color",
    key: "color",
    render: (color) => <Tag color={color}>{color}</Tag>,
  },
  {
    title: "Ações",
    render: (status) => {
      return (
        <div className="uk-flex" style={{ gap: "10px" }}>
          <Delete id={status.id} />
          <Edit status={status} />
        </div>
      );
    },
  },
];
