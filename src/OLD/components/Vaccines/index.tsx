// @ts-nocheck
// Core
import React, { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

// Components
import { Container } from "./styles";
import { Input } from "./styles";
import { Button } from "@/OLD/components/mini-components";
import { notification, Table } from "antd";
import AccessDenied from "@/OLD/components/AccessDenied";

// Services
import { vaccinesService } from "@/OLD/services/vaccine-service";

// utils
import Columns from "./Columns";
import moment from "moment";
import "moment/locale/pt-br";

// Icons
import { EditTwoTone } from "@ant-design/icons";
import { DeleteTwoTone } from "@ant-design/icons";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { useDeleteVaccine } from "@/presentation/hooks/patient/vaccines/use-delete-vaccine";

export function VaccinesList() {
  const [filters, setFilters] = useState(false);
  const [allProtocols, setAllProtocols] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(false);

  const router = useRouter();

  const listVaccinesPermission = useUserHasPermission("VAC00");
  const canCreateVaccine = useUserHasPermission("VAC01");
  const canEditVaccine = useUserHasPermission("VAC02");
  const canDeleteVaccine = useUserHasPermission("VAC03");

  const { mutateAsync } = useDeleteVaccine({
    id: selectedId,
  });

  const getAllProtocols = useCallback(() => {
    setLoading(false);
    vaccinesService
      .listProtocols(filters)
      .then((res) => {
        setAllProtocols(
          res.data.map((item) => {
            return {
              vaccine: item?.vaccine?.name,
              type: item?.vaccine?.type === "vaccine" ? "Vacina" : "Vermífugo",
              specie: item?.specie?.description,
              protocol: `${item?.name} - ${item?.doses} - ${item?.interval}`,
              status: item?.active ? "Ativo" : "Inativo",
              createdAt: moment(item?.created_at).format("DD/MM/YYYY - HH:mm"),
              actions: (
                <div className="uk-flex uk-flex-around">
                  <div>
                    {canEditVaccine && (
                      <EditTwoTone
                        size={15}
                        onClick={() =>
                          !canEditVaccine
                            ? notification.error({
                                message: "Ação não permitida",
                              })
                            : router.push(
                                `/dashboard/vacinas/editar/${item?.vaccine?.id}`
                              )
                        }
                      />
                    )}
                  </div>
                  {canDeleteVaccine && (
                    <DeleteTwoTone
                      size={15}
                      twoToneColor="red"
                      onMouseOver={() => setSelectedId(item.id)}
                      onClick={() => {
                        !canDeleteVaccine
                          ? notification.error({
                              message: "Ação não permitida",
                            })
                          : mutateAsync();
                      }}
                    />
                  )}
                </div>
              ),
            };
          })
        );
      })
      .catch((err) => {
        console.log(err, "<<<");
        return notification.error({
          message: "Houve um erro ao buscar os protocolos registrados...",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filters]);

  useEffect(() => {
    getAllProtocols();
  }, [getAllProtocols, canDeleteVaccine, canEditVaccine]);

  return !listVaccinesPermission || listVaccinesPermission === "loading" ? (
    <AccessDenied loading={listVaccinesPermission} />
  ) : (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove"> Gestão de vacinas </h3>
      <section className="uk-flex uk-flex-around uk-margin-top">
        <Input>
          <input
            placeholder="Tipo"
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          />
        </Input>
        <Input>
          <input
            placeholder="Vacina"
            onChange={(e) =>
              setFilters({ ...filters, vaccine: e.target.value })
            }
          />
        </Input>
        <Input>
          <input
            placeholder="Protocolo"
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
        </Input>
        <Input>
          <input
            placeholder="Espécie"
            onChange={(e) => setFilters({ ...filters, specie: e.target.value })}
          />
        </Input>
        <div className="uk-margin-small-top">
          <div onClick={() => router.push("/dashboard/vacinas/cadastrar")}>
            <Button disabled={!canCreateVaccine}>Adicionar</Button>
          </div>
        </div>
      </section>
      <hr />
      <Table
        columns={Columns}
        dataSource={allProtocols}
        className="uk-margin-large-top"
      />
    </Container>
  );
}

export default VaccinesList;
