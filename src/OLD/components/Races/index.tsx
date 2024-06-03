// @ts-nocheck
import { Table, AutoComplete } from "antd";
import { Input, FilterContainer } from "./styles";
import { useRaces } from "@/OLD/hooks/useRaces";
import { memo, useCallback, useEffect, useState } from "react";
import { columns } from "./columns";
import { Create } from "./Create";
import { SearchIcon } from "@/OLD/common/icons";
import { useSpecies } from "@/OLD/hooks/useSpecies";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { normalizeStr } from "@/OLD/utils/normalizeString";

import AccessDenied from "@/OLD/components/AccessDenied";

const RacesManagement = memo(() => {
  const [search, setSearch] = useState({ description: "" });
  const [visible, setVisible] = useState(false);
  const [reload, setReload] = useState(false);
  const { races, loadingRaces, fetchRaces } = useRaces(
    search,
    reload,
    setReload,
    true
  );

  const { species } = useSpecies("ALL");

  const listRacesPermission = useUserHasPermission("RAC00");

  useEffect(() => {
    fetchRaces();
  }, [search, reload]);

  const sortByAlphabetRace = useCallback((a, b) => {
    if (a.description > b.description) {
      if (a.specie.description > b.specie.description) {
        return 1;
      }

      if (a.specie.description < b.specie.description) {
        return -1;
      }

      return 1;
    }

    if (a.description < b.description) {
      if (a.specie.description > b.specie.description) {
        return 1;
      }

      if (a.specie.description < b.specie.description) {
        return -1;
      }

      return -1;
    }

    return 0;
  }, []);

  // Filtros de Espécie
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const handleSpeciesFilter = (e) => {
    setSearch({ ...search, specie: e });
  };

  // Filtros de Tipo de Pelagem
  const [selectedFur, setSelectedFur] = useState("");
  const handleFurFilter = (e) => {
    setSelectedFur(e.target.value);
  };

  const filteredRaces = Array.isArray(races)
    ? races.filter((race) => {
        // Filtrar por espécie
        if (selectedSpecies && selectedSpecies !== "ALL") {
          return race.specie.description.indexOf(selectedSpecies) > -1;
        }

        // Filtrar por tipo de pelagem
        if (selectedFur && selectedFur !== "ALL") {
          return race.fur === selectedFur;
        }

        return true;
      })
    : [];

  return !listRacesPermission || listRacesPermission === "loading" ? (
    <AccessDenied loading={listRacesPermission} />
  ) : (
    <div className="uk-margin-medium-top uk-container">
      <div className="uk-flex uk-flex-between uk-margin-medium">
        <h3 className="uk-line uk-margin-remove">Gestão de Raças</h3>
        <Create
          visible={visible}
          setVisible={setVisible}
          button={true}
          reload={reload}
          setReload={setReload}
        />
      </div>
      <div>
        <FilterContainer>
          <Input>
            <input
              type="search"
              placeholder="Pesquisar"
              value={search.description}
              onChange={(e) =>
                setSearch({
                  ...search,
                  description: normalizeStr(e.target.value)
                })
              }
            />
            <SearchIcon />
          </Input>
          {/* Filtro de Espécie */}
          <AutoComplete
            style={{
              display: "flex",
              alignItems: "center",
              height: "40px",
              backgroundColor: "#fff",
              borderRadius: "40px",
              width: "50%",
              padding: "0 20px",
              marginBottom: "10px",
              marginLeft: "10px"
            }}
            options={species?.map((specie) => ({
              ...specie,
              value: specie.description
            }))}
            filterOption={(value, option) =>
              normalizeStr(option.value.toUpperCase()).includes(
                normalizeStr(value.toUpperCase())
              )
            }
            placeholder="Espécie"
            value={search.specie}
            onChange={handleSpeciesFilter}
            onSelect={(value, option) => {
              setSearch({ ...search, specie: option.value });
            }}
          />
          {/* Filtro de Tipo de Pelagem */}
          <Input>
            <input
              placeholder="Tipo de Pelagem"
              value={selectedFur}
              onChange={handleFurFilter}
            />
            <SearchIcon />
          </Input>
        </FilterContainer>
        <Table
          locale={{
            emptyText: "Nenhum registro encontrado para essa pesquisa"
          }}
          dataSource={
            filteredRaces.length > 0
              ? filteredRaces.sort(sortByAlphabetRace)
              : []
          }
          loading={loadingRaces}
          columns={columns()}
        />
      </div>
    </div>
  );
});

export default RacesManagement;
