// @ts-nocheck
import { Button, PageWrapper } from "infinity-forge";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { memo, useState } from "react";
import { CreateTypeService } from "./Create";
import { List } from "./List";
import { Single } from "./Single";
import { Input } from "./styles";
import AccessDenied from "@/OLD/components/AccessDenied";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

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
    <div>
      {!router?.query?.subpage && (
        <PageWrapper title="Tipos de serviços">
          <div>
            <div>
              <div>
                <Input className="uk-margin-right">
                  <input
                    type="search"
                    placeholder="Digite o tipo de agendamento"
                    onChange={(e) =>
                      setTypeService(normalizeStr(e.target.value))
                    }
                  />
                </Input>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    onClick={() => setIsModalServiceType(true)}
                    //disabled={!canCreateTypeScheduleService}
                    text="Cadastrar"
                  />
                </div>

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
        </PageWrapper>
      )}
      {router?.query?.subpage === "visualizar" && <Single />}
    </div>
  );
}
