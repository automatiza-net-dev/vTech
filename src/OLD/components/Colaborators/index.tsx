// @ts-nocheck
// Core
import React, { memo } from "react";
import { useRouter } from "next/router";

// Components
import { Tabs } from "antd";
import CollaboratorsList from "./Collaborators";
import { Invites } from "./Invites";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import AccessDenied from "@/OLD/components/AccessDenied";
const { TabPane } = Tabs;

export const Collaborators = memo(function Collaborators() {
  const router = useRouter();

  const canShowInvites = useUserHasPermission("COL07");
  const listColaboratorsPermission = useUserHasPermission("COL00");

  return (
    <>
      {!listColaboratorsPermission ||
      listColaboratorsPermission === "loading" ? (
        <AccessDenied loading={listColaboratorsPermission} />
      ) : (
        <div className="uk-container uk-padding">
          <Tabs defaultActiveKey="Colaboradores">
            <TabPane tab="Colaboradores" key="1">
              <CollaboratorsList />
            </TabPane>
            {canShowInvites && (
              <TabPane tab="Convites" key="2">
                <Invites />
              </TabPane>
            )}
          </Tabs>
        </div>
      )}
    </>
  );
});
