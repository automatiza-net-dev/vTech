// @ts-nocheck
// Core
import React, { memo } from "react";
import { useRouter } from "next/router";

// Services
// Icons

// components
import { Tabs } from "antd";
import { Details } from "./Details";
import EditColaborator from "../Edit";
import { Absence } from "../Absence";
import { WorkingDay } from "../WorkingDay";
import AcessData from "./AcessData";
const { TabPane } = Tabs;

const SingleColaborator = memo(function SingleColaborator() {
  const router = useRouter();
  const edit = false;

  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Dados Cadastrais" key="1">
          <Details />
        </TabPane>
        <TabPane tab="Dados de Acesso" key="2">
          <AcessData />
        </TabPane>
        <TabPane tab="Horário de Agenda" key="3">
          <WorkingDay edit={false} />
        </TabPane>
        <TabPane tab="Bloqueios de Agenda" key="4">
          <Absence edit={false} />
        </TabPane>
      </Tabs>
    </div>
  );
});

export default SingleColaborator;
