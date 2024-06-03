// @ts-nocheck
import { convertDate } from "@/OLD/utils/convertDate";
import { Delete } from "./Delete";
import { Edit } from "./Edit";

export const columns = ({
  fetchSpecies,
  reload,
  setReload,
  canEditSpecie,
  canDeleteSpecie,
}) => [
  {
    title: "Espécie",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Criado em",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (createdAt) => convertDate(createdAt),
  },
  {
    title: "Ações",
    render: (item) => {
      return (
        <div className="uk-flex" style={{ gap: "10px" }}>
          {canEditSpecie && (
            <div>
              <Edit
                item={item}
                fetchData={fetchSpecies}
                reload={reload}
                setReload={setReload}
              />
            </div>
          )}
          {canDeleteSpecie && (
            <Delete
              id={item.id}
              reload={reload}
              setReload={setReload}
              fetchData={fetchSpecies}
            />
          )}
        </div>
      );
    },
  },
];
