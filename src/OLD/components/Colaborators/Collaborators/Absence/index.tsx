// @ts-nocheck
import { useState } from "react";
import { Table } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useColaborator } from "@/OLD/hooks/useColaborators";
import { memo, useEffect } from "react";
import { useMutation, useQuery } from "infinity-forge";
import { calendarService } from "@/OLD/services/calendar.service";
import { columns } from "./columns";
import { Create } from "./Create";
import { dataTeste } from "./mockData";

import moment from "moment";

// Components
import { Container } from "./styles";
import { Button, Select, FormHandler, useToast } from "infinity-forge";

export const Absence = ({ edit }) => {
  const router = useRouter();
  const userId = router?.query?.id;
  const [params, setParams] = useState({ user: userId });
  const { colaborator } = useColaborator(userId, false);

  const { createToast } = useToast();

  const { data, loading } = useQuery({
    queryKey: ["getAbsences", params],
    queryFn: () => calendarService.getAbsences(params),
    refetchOnWindowFocus: false,
    onError: () => {
      createToast({
        message: "Erro ao buscar ausencias e indisponibilidades",
        status: "error",
      });
    },
  });

  return (
    <>
      <div className="uk-flex uk-flex-between uk-margin-small-bottom">
        <div>
          <h2>Colaborador: {colaborator?.name}</h2>
        </div>
        {!edit && (
          <div style={{ display: "flex", gap: "10px" }}>
            <div>
              <Button onClick={() => router.back()} text="Voltar" />
            </div>
            <div>
              <Button
                onClick={() =>
                  router.push(
                    `/dashboard/colaboradores/editar-colaborador/${colaborator?.id}`
                  )
                }
                text="Editar Colaborador"
              />
            </div>
          </div>
        )}
      </div>
      <Container className="uk-padding">
        <h3 className="uk-margin-remove">Bloqueios de agenda</h3>
        <div style={{ display: "flex", justifyContent: "right" }}>
          <FormHandler
            initialData={params}
            onChangeForm={{
              callbackResult: (payload) => {
                if (payload?.active !== "all") {
                  setParams({ user: userId, active: payload?.active });
                } else {
                  setParams({
                    user: userId,
                  });
                }
              },
            }}
          >
            <Select
              label="Status"
              onlyOneValue
              name="active"
              menuPlacement="bottom"
              options={[
                { value: "true", label: "Ativo" },
                { value: "false", label: "Inativo" },
                { value: "all", label: "Todos" },
              ]}
            />
          </FormHandler>
        </div>
        <div className="uk-margin-top">
          <Table
            dataSource={data?.map((item) => ({
              ...item,
              start_date: item?.start_date
                ? moment(item?.start_date, "YYYY-MM-DD[T]HH:mm:ss").format(
                    "DD/MM/YYYY"
                  )
                : "---",
              end_date: item?.end_date
                ? moment(item?.end_date, "YYYY-MM-DD[T]HH:mm:ss").format(
                    "DD/MM/YYYY"
                  )
                : "---",
            }))}
            loading={loading}
            columns={columns(edit)}
            className="uk-margin-small-top"
          />
          {edit && (
            <div className="uk-flex uk-flex-left uk-margin-small-top">
              <Create />
            </div>
          )}
        </div>
      </Container>
      {edit && (
        <footer
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
            marginTop: "10px",
          }}
        >
          <Button
            onClick={() => {
              createToast({
                message: "Informações salvas com sucesso!",
                status: "success",
              });

              router.back();
            }}
            text="Salvar"
          />

          <Button onClick={() => router.back()} text="Voltar" />
        </footer>
      )}
    </>
  );
};
