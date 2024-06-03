// @ts-nocheck
import { notification, Table } from "antd";
import { Button } from "@/OLD/components/mini-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { useColaborator } from "@/OLD/hooks/useColaborators";
import { memo, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { calendarService } from "@/OLD/services/calendar.service";
import { columns } from "./columns";
import { Create } from "./Create";
import { dataTeste } from "./mockData";

// Components
import { Container } from "./styles";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";

export const Absence = memo(({ edit }) => {
  const router = useRouter();
  const userId = router?.query?.id;
  const { colaborator } = useColaborator(userId, false);

  const { data, loading } = useQuery(
    ["getAbsences", userId],
    () => calendarService.getAbsences(userId),
    {
      onError: () => {
        notification.error({
          message: "Erro",
          description: "Erro ao buscar ausencias e indisponibilidades",
        });
      },
      staleTime: 1000 * 20,
      refetchInterval: 1500 * 20,
    }
  );

  return (
    <>
      <div className="uk-flex uk-flex-between uk-margin-small-bottom">
        <div>
          <h2>Colaborador: {colaborator?.name}</h2>
        </div>
        <div className="uk-flex">
          <div>
            <CustomButton
              classCallback="uk-margin-small-right"
              onClick={() => router.back()}
            >
              Voltar
            </CustomButton>
          </div>
          <div>
            <CustomButton
              onClick={() =>
                router.push(
                  `/dashboard/colaboradores/editar-colaborador/${colaborator?.id}`
                )
              }
            >
              Editar colaborador
            </CustomButton>
          </div>
        </div>
      </div>
      <Container className="uk-padding">
        <h3 className="uk-margin-remove">Bloqueios de agenda</h3>
        <div className="uk-margin-top">
          <Table
            dataSource={data}
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
        <div className="uk-margin-small-top">
          <div className="uk-width-1-4 uk-flex uk-flex-between">
            <Button
              onClick={() => {
                notification.success({
                  message: "Informações salvas com sucesso!",
                });
                router.back();
              }}
            >
              Salvar
            </Button>
            <Button onClick={() => router.back()}>Voltar</Button>
          </div>
        </div>
      )}
    </>
  );
});
