// @ts-nocheck
import React, { memo, useCallback, useState } from "react";

import { opportunitiesService } from "@/OLD/services/opportunities.service";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import UpdateActivity from "../Update";
import { notification, Popconfirm, Tooltip } from "antd";

import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { AiOutlineEye } from "react-icons/ai";
import { BsArrowCounterclockwise } from "react-icons/bs";

const Actions = memo(function Actions({
  activity,
  setReload,
  op,
  colaborators,
  actTypes,
}) {
  const [editVisible, setEditVisible] = useState(false);
  const [edit, setEdit] = useState(false);

  const editActivityPermission = useUserHasPermission("CRM07");
  const removeActivityPermission = useUserHasPermission("CRM08");
  const reopenActivityPermission = useUserHasPermission("CRM11");

  const removeActivity = useCallback(() => {
    opportunitiesService
      .excludeActivityOpportunity(activity?.id)
      .then((_res) => {
        setReload((prv) => !prv);
        return notification.success({ message: "Atividade removida!" });
      });
  }, [activity?.id]);

  const reopenActivity = useCallback(() => {
    opportunitiesService
      .reopenActivity(activity?.id)
      .then((res) => {
        setReload((prv) => !prv);
        return notification.success({
          message: "Atividade reaberta com sucesso!",
        });
      })
      .catch((err) => {
        return notification.error({
          message: "Houve um erro ao reabrir a atividade",
        });
      });
  }, [activity?.id]);

  return (
    <div className="uk-flex uk-flex-around">
      {activity?.status === "Aberta" && (
        <>
          {!activity?.balance && (
            <>
              {editActivityPermission && (
                <Tooltip title="Alterar atividade">
                  <EditTwoTone
                    onClick={() => {
                      setEditVisible(true);
                      setEdit(true);
                    }}
                  />
                </Tooltip>
              )}
              {removeActivityPermission && (
                <Tooltip title="Excluir atividade">
                  <Popconfirm
                    title="Tem certeza que deseja remover esta atividade?"
                    onConfirm={() => {
                      removeActivity();
                    }}
                  >
                    <DeleteTwoTone twoToneColor="red" />
                  </Popconfirm>
                </Tooltip>
              )}
            </>
          )}
        </>
      )}
      {activity?.status === "Executada" && reopenActivityPermission && (
        <Tooltip title="Reabrir atividade">
          <BsArrowCounterclockwise
            style={{ cursor: "pointer" }}
            onClick={() => reopenActivity()}
          />
        </Tooltip>
      )}
      <Tooltip title="Detalhes atividade">
        <AiOutlineEye
          onClick={() => {
            setEditVisible(true);
            setEdit(false);
          }}
          style={{ cursor: "pointer" }}
        />
      </Tooltip>
      <UpdateActivity
        colaborators={colaborators}
        actTypes={actTypes}
        setReload={setReload}
        visible={editVisible}
        setVisible={setEditVisible}
        activity={activity}
        edit={edit}
        op={{
          ...op,
          description: activity?.opportunity?.description || op?.description,
        }}
      />
    </div>
  );
});

export default Actions;
