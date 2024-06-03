// @ts-nocheck
import React, { useState } from "react";
import { Col, Row, Button, notification, Checkbox } from "antd";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { Button as ButtonA } from "@/OLD/components/mini-components/Button";

import { userService } from "@/OLD/services/user.service";
import { clinicService } from "@/OLD/services/clinic.service";
import { useColaborator } from "@/OLD/hooks/useColaborators";
import { RowTime } from "./RowTime";
import { useRouter } from "next/router";
import { LoadingSkeleton } from "@/OLD/components/mini-components";
import Link from "next/link";

// Hooks
import { useWorkingDays } from "@/OLD/hooks/useWorkingDays";

// Components
import { Container } from "./styles";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";

export const WorkingDay = React.memo(function WorkingDay({ edit }) {
  const [reload, setReload] = useState(false);
  const [rowEditing, setRowEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const userId = router?.query?.id;
  const queryClient = useQueryClient();
  const { workingDays, loadingWorkingDays } = useWorkingDays(userId, reload);
  const { colaborator } = useColaborator(userId, reload);

  /*
  const { data, isLoading } = useQuery(
    "workingDay",
    userService.getWorkingDays,
    {
      onError: (error) => {
        notification.error({
          message: "Erro",
          description: "Erro ao buscar as escalas de trabalho",
        });
      },
      staleTime: 20000,
      refetchInterval: 25000,
    }
  );*/

  const { loadingWorkingDays: isMutating, mutate } = useMutation(
    (_data) => userService.createWorkingDay(_data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("workingDay");
        setReload(!reload);
      },
    }
  );

  const defaultData = {
    userId: userId,
    dayOfWeek: "segunda",
    startHour: "08:00:00",
    endHour: "18:00:00",
  };

  const updateColaborator = (bool) => {
    setLoading(true);
    clinicService
      .updateCollaborator(userId, {
        active: colaborator?.active,
        address: colaborator?.address,
        city: colaborator?.city,
        complement: colaborator?.complement,
        district: colaborator?.district,
        document: colaborator?.document,
        email: colaborator?.email,
        name: colaborator?.name,
        number: colaborator?.number,
        phone: colaborator?.phone,
        postalCode: colaborator?.postalCode,
        state: colaborator?.state,
        onDuty: bool,
      })
      .finally(() => setReload(!reload));
  };

  return (
    <Container className="uk-margin-small-top">
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
              {" "}
              Editar colaborador{" "}
            </CustomButton>
          </div>
        </div>
      </div>
      <div className="uk-card uk-card-body uk-width-1-1">
        <h4 className="uk-heading-line">Horário de agenda</h4>
        <div className="uk-margin-large-bottom">
          <Checkbox
            checked={colaborator?.on_duty}
            onChange={(e) => updateColaborator(e.target.checked)}
            disabled={!edit} // Condição para tornar o Checkbox somente leitura
          >
            Plantonista / Avulso
          </Checkbox>
        </div>
        {edit && (
          <div className="uk-flex uk-flex-right" type="primary">
            <Button
              type="primary"
              onClick={() => {
                setRowEditing((prv) => !prv);
                rowEditing && setReload(!reload);
                rowEditing && queryClient.invalidateQueries("workingDay");
              }}
            >
              {!rowEditing ? "Editar" : "Concluir"}
            </Button>
          </div>
        )}
        <Row className="uk-margin-bottom">
          <Col span={6}>
            <h5 className="uk-margin-remove">Dia</h5>
          </Col>
          <Col span={8}>
            <h5 className="uk-margin-remove">Entrada</h5>
          </Col>
          <Col span={8}>
            <h5 className="uk-margin-remove">Saída</h5>
          </Col>
        </Row>

        {loadingWorkingDays ? (
          <LoadingSkeleton />
        ) : (
          (workingDays ?? []).map((item, key) => {
            return (
              <RowTime
                day={item}
                key={key}
                edit={edit}
                reload={reload}
                setReload={setReload}
                rowEditing={rowEditing}
              />
            );
          })
        )}

        <div className="uk-flex uk-flex-between">
          {edit && !rowEditing && (
            <Button
              type="primary"
              className="uk-border-pill uk-margin-top"
              onClick={() => mutate(defaultData)}
              loading={isMutating}
            >
              Adicionar Horário de agenda
            </Button>
          )}
        </div>
      </div>
      {edit && (
        <div className="uk-margin-small-top">
          <div className="uk-width-1-3 uk-flex uk-flex-around">
            <ButtonA
              onClick={() => {
                notification.success({
                  message: "Informações salvas com sucesso!",
                });
                router.back();
              }}
            >
              Salvar
            </ButtonA>
            <ButtonA onClick={() => router.back()}>Voltar</ButtonA>
          </div>
        </div>
      )}
    </Container>
  );
});
