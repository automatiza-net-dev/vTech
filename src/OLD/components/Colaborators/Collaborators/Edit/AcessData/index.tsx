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
import { Container } from "./styles";
import { Select, notification, Input, Checkbox } from "antd";
import { Button } from "infinity-forge";
const { Option } = Select;

// Utils
import { sortItems } from "@/OLD/utils/sortItems";

function AccessData() {
  const router = useRouter();
  const userId = router.query.id;
  const [data, setData] = useState(false);
  const [rolesStructure, setRolesStructure] = useState();
  const [reload, setReload] = useState(false);
  const [roleIndex, setRoleIndex] = useState(false);
  const [allRoles, setAllRoles] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const { units } = useUserBusinessUnits("", reload);
  const { data: deposits } = useDeposits("movements", {});

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
        return notification.error({
          message: "Houve um erro ao recuperar os cargos disponíveis...",
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
        setRolesStructure(
          res?.data?.roles.map((item) => {
            return {
              user_id: userId,
              role_id: item?.id,
              active: item?.active,
              unit_id: item?.unit?.id,
              default_sale_deposit_id: item?.deposit?.id,
            };
          })
        );
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message:
            "Houve um erro ao recuperar as informações do colaborador...",
        });
      })
      .finally(() => setLoading(false));
  }, [userId, reload]);

  useEffect(() => {
    getAllRoles();
    getColabData();
  }, [getAllRoles, getColabData]);

  const submitRoles = useCallback(() => {
    setLoading(true);
    clinicService
      .updateUnitCollabRoles({ data: rolesStructure })
      .then((res) =>
        notification.success({ message: "Cargos atualizados com sucesso!" })
      )
      .catch((err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao atualizar os cargos do colaborador...",
        });
      })
      .finally(() => {
        setReload(!reload);
      });
  }, [rolesStructure]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitRoles();
      }}
      className=""
    >
      <Container className="uk-padding">
        <h5 className="uk-heading-line">
          <span>Dados de acesso</span>
        </h5>
        <div className="uk-flex uk-flex-center">
          <div className="uk-width-1-4">
            <div>
              <label>Clinica</label>
              {units &&
                units.length > 0 &&
                units.map((unit, i) => (
                  <p className="uk-heading-line" key={i}>
                    <span>{unit?.fantasyName}</span>
                  </p>
                ))}
            </div>
          </div>
          <div className="uk-width-1-4 uk-margin-small-left">
            <div className="">
              <label>Cargo</label>
              {units?.length > 0 &&
                units?.map((unit, i) => (
                  <Select
                    key={i}
                    onChange={(e) => {
                      const existRole = rolesStructure?.find(
                        (role) => role?.unit_id === unit?.id
                      );
                      let newArr = [...rolesStructure];
                      if (existRole) {
                        newArr.splice(rolesStructure.indexOf(existRole), 1);
                        newArr.push({ ...existRole, role_id: e });
                        setRolesStructure(newArr);
                      } else {
                        newArr.push({
                          user_id: userId,
                          role_id: e,
                          unit_id: unit?.id,
                          active: true,
                        });
                        setRolesStructure(newArr);
                      }
                    }}
                    className="uk-width-1-1 uk-margin-small-top"
                    value={
                      rolesStructure?.find((role) => role?.unit_id === unit?.id)
                        ?.role_id
                    }
                  >
                    {allRoles.length > 0 &&
                      allRoles.map((item, i) => (
                        <Option value={item.id} key={i}>
                          {item.name}
                        </Option>
                      ))}
                  </Select>
                ))}
            </div>
          </div>
          <div className="uk-width-1-4 uk-margin-small-left">
            <label>Depósito padrão para venda</label>
            {units?.length > 0 &&
              units?.map((unit, i) => (
                <div className="">
                  <Select
                    key={i}
                    onChange={(e) => {
                      const existRole = rolesStructure?.find(
                        (role) => role?.unit_id === unit?.id
                      );
                      let newArr = [...rolesStructure];
                      if (existRole) {
                        newArr.splice(rolesStructure.indexOf(existRole), 1);
                        newArr.push({
                          ...existRole,
                          default_sale_deposit_id: e,
                        });
                        setRolesStructure(newArr);
                      } else {
                        newArr.push({
                          user_id: userId,
                          default_sale_deposit_id: e,
                          unit_id: unit?.id,
                          active: true,
                        });
                        setRolesStructure(newArr);
                      }
                    }}
                    className="uk-width-1-1 uk-margin-small-top"
                    value={
                      rolesStructure?.find((role) => role?.unit_id === unit?.id)
                        ?.default_sale_deposit_id
                    }
                  >
                    {deposits?.length > 0 &&
                      deposits
                        ?.filter((dep) => dep?.unit?.id === unit?.id)
                        ?.map((deposit, i) => (
                          <Option value={deposit.id} key={i}>
                            {deposit.description}
                          </Option>
                        ))}
                  </Select>
                </div>
              ))}
          </div>
          <div className="uk-margin-left">
            <label>Ativo</label>
            {units?.length > 0 &&
              units?.map((unit, i) => {
                const existRole = rolesStructure?.find(
                  (role) => role?.unit_id === unit?.id
                );
                return (
                  <p className="" key={i}>
                    <Checkbox
                      disabled={!existRole}
                      onChange={(e) => {
                        let newArr = [...rolesStructure];
                        newArr.splice(rolesStructure.indexOf(existRole), 1);
                        newArr.push({
                          ...existRole,
                          active: e.target.checked,
                        });
                        setRolesStructure(newArr);
                      }}
                      checked={
                        rolesStructure?.find(
                          (role) => role?.unit_id === unit?.id
                        )?.active
                      }
                    />
                  </p>
                );
              })}
          </div>
        </div>
      </Container>
      <footer
        style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}
      >
        <Button type="submit" text="Salvar" />
        <Button type="button" onClick={() => router.back()} text="Voltar" />
      </footer>
    </form>
  );
}

export default AccessData;
