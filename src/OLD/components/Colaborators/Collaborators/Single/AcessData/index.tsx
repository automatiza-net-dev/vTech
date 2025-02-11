// @ts-nocheck
// Core
import React, { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/router";

// Components

import { Button, useToast } from "infinity-forge";

import * as S from "./styles";

// Services
import { clinicService } from "@/OLD/services/clinic.service";

export function AccessData() {
  const router = useRouter();
  const [data, setData] = useState({});
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const userId = router.query.id;

  const { createToast } = useToast();

  const getColabData = useCallback(() => {
    setLoading(true);
    clinicService
      .getCollabById(userId)
      .then((res) => {
        setData(res.data);
        setSelectedRoles(res?.data);
      })
      .catch((_err) => {
        setLoading(false);

        createToast({
          message:
            "Houve um erro ao recuperar as informações do colaborador...",
          status: "error",
        });

        return;
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    getColabData();
  }, [getColabData]);

  return (
    <S.AccessData>
      <div className="uk-flex uk-flex-between uk-margin-small-bottom">
        <div>
          <h2>Colaborador: {data?.name}</h2>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <div>
            <Button onClick={() => router.back()} text="Voltar" />
          </div>
          <div>
            <Button
              onClick={() =>
                router.push(
                  `/dashboard/colaboradores/editar-colaborador/${data?.id}`
                )
              }
              text="Editar Colaborador"
            />
          </div>
        </div>
      </div>

      <h4 className="uk-heading-line">
        <span>Dados de acesso</span>
      </h4>
      <table>
        <thead>
          <tr>
            <th>Clinica</th>
            <th>cargo </th>
            <th>depósito padrão</th>
          </tr>
        </thead>
        <tbody>
          {data?.roles?.length > 0 &&
            data?.roles?.map((role, i) => (
              <tr key={i}>
                <td key={i}>
                  <span>{role?.unit?.name}</span>
                </td>
                <td key={i}>
                  <span>{role?.name}</span>
                </td>
                <td key={i}>
                  <span>{role?.deposit?.description}</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </S.AccessData>
  );
}

export default AccessData;
