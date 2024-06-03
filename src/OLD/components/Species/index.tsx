// @ts-nocheck
import { notification, Table } from "antd";
import { useSpecies } from "@/OLD/hooks/useSpecies";
import { memo, useCallback, useEffect, useState } from "react";
import { columns } from "./columns";
import { Create } from "./Create";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import AccessDenied from "@/OLD/components/AccessDenied";

const SpeciesManagement = memo(() => {
  const [search, setSearch] = useState("");
  const { species, loadingSpecies, fetchSpecies } = useSpecies(search);
  const [reload, setReload] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);

  const listSpeciesPermission = useUserHasPermission("ESP00");
  const canEditSpecie = useUserHasPermission("ESP02");
  const canDeleteSpecie = useUserHasPermission("ESP03");

  const sortByAlphabetSpecies = useCallback((a, b) => {
    if (a.description > b.description) {
      return 1;
    }

    if (a.description < b.description) {
      return -1;
    }

    return 0;
  }, []);

  useEffect(() => {
    fetchSpecies();
  }, [search, reload]);

  return !listSpeciesPermission || listSpeciesPermission === "loading" ? (
    <AccessDenied loading={listSpeciesPermission} />
  ) : (
    <div className="uk-container uk-margin-medium-top">
      <div className="uk-flex uk-flex-between uk-margin-medium">
        <h3 className="uk-line uk-margin-remove">Gestão de Espécies</h3>
        <Create
          button={true}
          reload={reload}
          setReload={setReload}
          visible={createVisible}
          setVisible={setCreateVisible}
        />
      </div>
      <div>
        <div className="uk-flex uk-flex-between uk-margin-small-bottom">
          <input
            className="uk-input"
            type="text"
            placeholder="Pesquisar..."
            value={search.description}
            onChange={(e) =>
              setSearch({ ...search, description: e.target.value })
            }
          />
          <button className="uk-button uk-button-primary">Pesquisar</button>
        </div>
        <Table
          locale={{
            emptyText: "Nenhum registro encontrado para essa pesquisa",
          }}
          dataSource={species.length && species.sort(sortByAlphabetSpecies)}
          rowKey="id"
          loading={loadingSpecies}
          columns={columns({
            fetchSpecies,
            reload,
            setReload,
            canEditSpecie,
            canDeleteSpecie,
          })}
        />
      </div>
    </div>
  );
});

export default SpeciesManagement;
