// @ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { Col, Row, Checkbox } from "antd";
import { useQuery, useMutation } from "infinity-forge";
import { useQueryClient } from "@/presentation/use-query";
import { Button, useToast } from "infinity-forge";

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

import moment from "moment";

export function WorkingDay({ edit }) {
  const [data, setData] = useState();
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rowEditing, setRowEditing] = useState(false);

  const router = useRouter();
  const userId = router?.query?.id;
  const queryClient = useQueryClient();
  const { workingDays, loadingWorkingDays } = useWorkingDays(userId, reload);
  const { colaborator } = useColaborator(userId, reload);
  const { createToast } = useToast();

  useEffect(() => {
    setData(
      workingDays.map((day) => ({
        ...day,
        userId,
        dayOfWeek: day?.week_day,
        startHour: moment(day?.start_hour, "HH:mm"),
        endHour: moment(day?.end_hour, "HH:mm"),
      }))
    );
  }, [workingDays]);

  const handleEdit = useCallback(() => {
    userService
      .editWorkingDay({
        items: data?.map((day) => {
          return {
            ...day,
            startHour: moment(day?.startHour).format("HH:mm"),
            endHour: moment(day?.endHour).format("HH:mm"),
          };
        }),
      })
      .then((res) => {
        setRowEditing(false);
        createToast({
          message: "Horários salvos com sucesso!",
          status: "success",
        });
      })
      .catch((err) => {
        createToast({
          status: "error",
          message: "Erro ao editar jornada de trabalho",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [data, router]);

  const { loadingWorkingDays: isMutating, mutate } = useMutation({
    queryKey: ["WorkingDayMutation"],
    queryFn: (_data) => userService.createWorkingDay(_data),
    onSuccess: () => {
      queryClient.invalidateQueries(["workingDay"]);
      setReload(!reload);
    },
  });

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
              onClick={() => {
                if (rowEditing) {
                  handleEdit();
                  rowEditing && queryClient.invalidateQueries(["workingDay"]);
                } else {
                  setRowEditing((prv) => !prv);
                  rowEditing && setReload(!reload);
                }
              }}
              text={!rowEditing ? "Editar" : "Concluir"}
            />
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
          <RowTime
            data={data}
            edit={edit}
            reload={reload}
            setData={setData}
            setReload={setReload}
            rowEditing={rowEditing}
          />
        )}

        <div className="uk-flex uk-flex-between">
          {
            <Button
              text="Adicionar Horário de agenda"
              onClick={() => mutate(defaultData)}
              loading={isMutating}
            />
          }
        </div>
      </div>
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
                status: "success",
                message: "Informações salvas com sucesso!",
              });

              router.back();
            }}
            text="Salvar"
          />

          <Button onClick={() => router.back()} text="Voltar" />
        </footer>
      )}
    </Container>
  );
}
