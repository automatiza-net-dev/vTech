// @ts-nocheck
import React, { memo } from "react";
import { useRouter } from "next/router";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Tooltip } from "antd";
import { Container } from "./styles";

import { GrHostMaintenance } from "react-icons/gr";
import { IoIosTimer } from "react-icons/io";

const Actions = memo(function Actions({ treatment }) {
  const router = useRouter();

  const dayExecutionsPermission = useUserHasPermission("TRA02");

  return (
    <Container className="uk-flex uk-flex-around">
      <Tooltip title="Manutenção / Agendamento execução">
        <GrHostMaintenance
          className="custom-icon"
          size={15}
          onClick={() =>
            router.push(`/dashboard/tratamentos/agendamento/${treatment?.id}`)
          }
        />
      </Tooltip>
      {dayExecutionsPermission && (
        <Tooltip title="Execuções do dia">
          <IoIosTimer
            className="custom-icon"
            size={20}
            onClick={() =>
              router.push(
                `/dashboard/tratamentos/execucoes-dia/${treatment?.id}`
              )
            }
          />
        </Tooltip>
      )}
    </Container>
  );
});

export default Actions;
