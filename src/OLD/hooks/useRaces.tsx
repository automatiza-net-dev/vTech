// @ts-nocheck
import { useEffect, useState } from "react";
import { animalServices } from "@/OLD/services/animal.service";
import { useUserHasPermission } from "./useProfile";

export function useRaces(
  filter,
  reload,
  setReload,
  isFiltering = true,
  search = true
) {
  const [races, setRaces] = useState("");
  const [loading, setLoading] = useState(false);

  const canDeleteRace = useUserHasPermission("RAC03");

  const fetchData = () => {
    if (!search) {
      return;
    }
    setLoading(true);
    animalServices
      .getRaces(filter)
      .then((res) => {
        if (!!filter || !isFiltering) {
          setRaces(
            res
              .sort((a, b) => a.description.localeCompare(b.description))
              .map((item) => {
                return {
                  ...item,
                  actions: (
                    <div className="uk-flex" style={{ gap: "10px" }}>
                      <Edit item={item} setReload={setReload} reload={reload} />
                      <Delete
                        id={item.id}
                        reload={reload}
                        setReload={setReload}
                      />
                    </div>
                  ),
                };
              })
          );
        } else {
          setRaces([]);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, JSON.stringify(filter)]);

  return { races, loadingRaces: loading, fetchRaces: fetchData };
}
