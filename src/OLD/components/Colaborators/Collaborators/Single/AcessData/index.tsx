// @ts-nocheck
// Core
import React, { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/router";

// Components
import { Container } from "./styles";
import { notification } from "antd";
import { Button } from "infinity-forge";

// Services
import { clinicService } from "@/OLD/services/clinic.service";

export function AccessData() {
  const router = useRouter();
  const [data, setData] = useState({});
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const userId = router.query.id;

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
        return notification.error({
          message:
            "Houve um erro ao recuperar as informações do colaborador...",
        });
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    getColabData();
  }, [getColabData]);

  return (
    <>
      <div className="uk-flex uk-flex-between uk-margin-small-bottom">
        <div>
          <h2>Colaborador: {data?.name}</h2>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <div>
            <Button
              onClick={() => router.back()}
              text="Voltar"
            />
          </div>
          <div>
            <Button
              onClick={() =>
                router.push(
                  `/dashboard/colaborador/editar-colaborador/${data?.id}`
                )
              }
              text="Editar Colaborador"
            />
          </div>
        </div>
      </div>
      <Container className="uk-padding uk-margin-top">
        <h4 className="uk-heading-line">
          <span>Dados de acesso</span>
        </h4>
        <div className="uk-flex uk-flex-around">
          <div className="uk-width-1-2">
            <h4>Clinica, cargo e depósito padrão</h4>
            <div>
              {data?.roles?.length > 0 &&
                data?.roles?.map((role, i) => (
                  <div
                    className="uk-flex uk-flex-between uk-margin-small-top"
                    key={i}
                  >
                    <p
                      className="uk-margin-remove uk-heading-line uk-width-1-2"
                      key={i}
                    >
                      <span>{role?.unit?.name}</span>
                    </p>
                    <p
                      className="uk-margin-remove uk-width-1-3 uk-heading-line"
                      key={i}
                    >
                      <span className="uk-margin-small-left">{role?.name}</span>
                    </p>
                    <p className="uk-margin-remove uk-width-1-3" key={i}>
                      <span className="uk-margin-small-left">
                        {role?.deposit?.description}
                      </span>
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default AccessData;
