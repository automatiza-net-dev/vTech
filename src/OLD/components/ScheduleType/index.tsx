// @ts-nocheck

import { useRouter } from "next/router";
import React, { memo, useState } from "react";
import { Create } from "./Create";
import { List } from "./List";
import { Single } from "./Single";
import { Input } from "./styles";
import AccessDenied from "@/OLD/components/AccessDenied";

// Hooks
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

// Icons
import { SearchIcon } from "@/OLD/common/icons";

//Utils
import { normalizeStr } from "@/OLD/utils/normalizeString";

export const ScheduleType = memo(() => {
  const router = useRouter();
  const [refreshTable, setRefreshTable] = useState(false);
  const [filters, setFilters] = useState({});

  const listScheduleServicesPermission = useUserHasPermission("ASV00");

  return !listScheduleServicesPermission ||
    listScheduleServicesPermission === "loading" ? (
    <AccessDenied loading={listScheduleServicesPermission} />
  ) : (
    <div className="uk-padding">
      <div>
        <div className="uk-flex uk-margin-bottom uk-flex-between">
          <h3 className="uk-margin-remove">Serviços de Agendamento</h3>
          <div className="uk-flex uk-flex-between">
            <Input>
              <input
                type="search"
                placeholder="Digite a descrição"
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    description: normalizeStr(e.target.value),
                  })
                }
              />
              <SearchIcon />
            </Input>

            <Input>
              <input
                type="search"
                placeholder="Digite o tipo de serviço"
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    group: normalizeStr(e.target.value),
                  })
                }
              />
              <SearchIcon />
            </Input>

            <Create setRefreshTable={() => setRefreshTable(!refreshTable)} />
          </div>
        </div>
        <hr />
        <div className="uk-margin-bottom">
          <List
            refreshTable={refreshTable}
            setRefreshTable={() => setRefreshTable(!refreshTable)}
            filters={filters}
          />
        </div>
      </div>
    </div>
  );
});
