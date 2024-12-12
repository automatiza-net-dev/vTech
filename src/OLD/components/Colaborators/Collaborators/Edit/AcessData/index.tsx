// @ts-nocheck
// Core
import React, { useEffect, useCallback, memo, useState } from "react";
import { useRouter } from "next/router";

// Hooks
import { useUserBusinessUnits } from "@/OLD/hooks/useUserBusinessUnits";
import { useDeposits } from "@/OLD/hooks/useDeposits";

// Services
import { adminService } from "@/OLD/services/admin.service";
import { clinicService } from "@/OLD/services/clinic.service";

// Components
import {
  Button,
  Select,
  Input,
  useToast,
  InputCheckbox,
  FormHandler,
} from "infinity-forge";

import * as S from "./styles";

// Utils
import { sortItems } from "@/OLD/utils/sortItems";

function AccessData() {
  const router = useRouter();
  const userId = router.query.id;
  const [data, setData] = useState(false);
  const [rolesStructure, setRolesStructure] = useState({});
  const [reload, setReload] = useState(false);
  const [roleIndex, setRoleIndex] = useState(false);
  const [allRoles, setAllRoles] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const { units } = useUserBusinessUnits("", reload);
  const { data: deposits } = useDeposits("movements", {});

  const { createToast } = useToast();

  const getAllRoles = useCallback(() => {
    setLoading(true);
    adminService
      .getAllRoles()
      .then((res) => {
        sortItems(res.data, "name");
        setAllRoles(res.data);
      })
      .catch((err) => {
        setLoading(false);
        return createToast({
          message: "Houve um erro ao recuperar os cargos disponíveis...",
          status: "error",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const getColabData = useCallback(() => {
    setLoading(true);
    clinicService
      .getCollabById(userId)
      .then((res) => {
        setData(res.data);
      })
      .catch((_err) => {
        setLoading(false);
        return createToast({
          message:
            "Houve um erro ao recuperar as informações do colaborador...",
          status: "error",
        });
      })
      .finally(() => setLoading(false));
  }, [userId, reload, units]);

  useEffect(() => {
    getAllRoles();
    getColabData();
  }, [getAllRoles, getColabData]);

  function submitRoles(payload) {
    setLoading(true);
    clinicService
      .updateUnitCollabRoles({
        data: payload?.items
          .map((item, index) => ({
            ...item,
            active: rolesStructure?.items[index]?.active,
          }))
          .filter((item) => item?.role_id),
      })
      .then((res) =>
        createToast({
          message: "Cargos atualizados com sucesso!",
          status: "success",
        })
      )
      .catch((err) => {
        setLoading(false);
        return createToast({
          message: "Houve um erro ao atualizar os cargos do colaborador...",
          status: "error",
        });
      })
      .finally(() => {
        setReload(!reload);
      });
  }

  useEffect(() => {
    setRolesStructure(
      units?.length > 0 &&
        data?.roles && {
          items: units.map((unit) => {
            const unitUserData = data?.roles?.find(
              (data) => data?.unit?.id === unit?.id
            );

            return {
              unit_id: unit?.id,
              unitIdentification: unit?.identification,
              role_id: unitUserData?.id,
              default_sale_deposit_id: unitUserData?.deposit?.id,
              active: unitUserData?.active,
              user_id: userId,
            };
          }),
        }
    );
  }, [units, data]);

  const rolesOptions =
    allRoles?.length > 0 &&
    allRoles?.map((role) => ({
      value: role?.id,
      label: role?.name,
    }));

  return (
    <S.AccessData>
      <h5 className="uk-heading-line">
        <span>Dados de acesso</span>
      </h5>
      <div className="header-table">
        <span>Clinica</span>
        <span>Cargo</span>
        <span>Depósito padrão para venda</span>
        <span>Ativo</span>
      </div>

      {rolesStructure?.items?.length > 0 && (
        <FormHandler
          cleanFieldsOnSubmit={false}
          initialData={rolesStructure}
          customAction={{
            Component: () => (
              <Button text="Voltar" onClick={() => router.back()} />
            ),
          }}
          customSubmit={[
            {
              action: (payload) => submitRoles(payload),
              active: true,
              props: () => ({
                text: "Salvar",
              }),
            },
          ]}
        >
          {rolesStructure?.items?.map((roleStructure, index) => {
            const basePath = `items[${index}]`;
            return (
              <div className="body-table" key={roleStructure?.unit_id}>
                <div>{roleStructure?.unitIdentification}</div>

                {rolesOptions?.length > 0 && (
                  <Select
                    name={`${basePath}.role_id`}
                    options={rolesOptions}
                    onlyOneValue
                  />
                )}

                {deposits && deposits?.length > 0 && (
                  <Select
                    name={`${basePath}.default_sale_deposit_id`}
                    options={deposits
                      .filter(
                        (deposit) =>
                          deposit?.unit?.id === roleStructure?.unit_id
                      )
                      .map((deposit, i) => ({
                        value: deposit?.id,
                        label: deposit?.description,
                      }))}
                    onlyOneValue
                  />
                )}

                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={rolesStructure.items[index].active}
                    onChange={(e) => {
                      const newObj = { ...rolesStructure };
                      newObj.items.splice(index, 1, {
                        ...rolesStructure?.items[index],
                        active: e.target.checked,
                      });

                      setRolesStructure(newObj);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </FormHandler>
      )}
    </S.AccessData>
  );
}

export default AccessData;
