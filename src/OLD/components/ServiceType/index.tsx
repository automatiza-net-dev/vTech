// @ts-nocheck
import { Button } from "@/OLD/components/mini-components";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { memo, useState } from "react";
import { CreateTypeService } from "./Create";
import { List } from "./List";
import { Single } from "./Single";
import { Input } from "./styles";
import { notification } from "antd";
import AccessDenied from "@/OLD/components/AccessDenied";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

// Icons
import { SearchIcon } from "@/OLD/common/icons";

// Utils
import { normalizeStr } from "@/OLD/utils/normalizeString";

export function ServiceType() {
  const router = useRouter();
  const [refreshTable, setRefreshTable] = useState(false);
  const [isModalServiceType, setIsModalServiceType] = useState(false);
  const [serviceType, setTypeService] = useState("");

  const listServicesScheduleTypesPermission = useUserHasPermission("ATS00");
  const canCreateTypeScheduleService = useUserHasPermission("ATS01");

  return !listServicesScheduleTypesPermission ||
    listServicesScheduleTypesPermission === "loading" ? (
    <AccessDenied loading={listServicesScheduleTypesPermission} />
  ) : (
    <div className="uk-padding">
      {!router?.query?.subpage && (
        <div>
          <div className="uk-flex uk-margin-bottom uk-flex-between">
            <h3 className="uk-margin-remove">Tipos de serviços</h3>
            <div className="uk-flex uk-width-2-3 uk-flex-right">
              <Input className="uk-margin-right">
                <input
                  type="search"
                  placeholder="Digite o tipo de agendamento"
                  onChange={(e) => setTypeService(normalizeStr(e.target.value))}
                />
                <SearchIcon />
              </Input>

              <Button
                onClick={() => setIsModalServiceType(true)}
                disabled={!canCreateTypeScheduleService}
              >
                Cadastrar
              </Button>
              <CreateTypeService
                isModalVisible={isModalServiceType}
                setIsModalVisible={setIsModalServiceType}
                setRefresh={() => setRefreshTable(!refreshTable)}
              />
            </div>
          </div>
          <hr />
          <List
            refreshTable={refreshTable}
            setRefreshTable={() => setRefreshTable(!refreshTable)}
            serviceType={serviceType}
          />
        </div>
      )}
      {router?.query?.subpage === "visualizar" && <Single />}
    </div>
  );
}
