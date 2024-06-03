// @ts-nocheck
import dynamic from "next/dynamic";

import { Error } from "infinity-forge";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import CardsCashiers from "./CardsCashiers";
import CardsFinances from "./CardsFinances";
import NextConsultationsPanel from "./NextConsultationsPanel";
import { Container } from "./styles";
const Indicators = dynamic(() => import("@/OLD/components/Indicators"));

const colorsCard = {
  emergency: {
    dark: "#F5222D",
    light: "#FFF1F0",
  },
  veryUrgent: {
    dark: "#FA972B",
    light: "#FFF7E6",
  },
  urgent: {
    dark: "#FAD82B",
    light: "#FCFAF2",
  },
  littleUrgent: {
    dark: "#2496FF",
    light: "#E6F7FF",
  },
  notUrgent: {
    dark: "#D9D9D9",
    light: "#fff",
  },
};

const tagsCaption = [
  {
    color: colorsCard.emergency.dark,
    label: "Emergência",
  },
  {
    color: colorsCard.veryUrgent.dark,
    label: "Muito urgente",
  },
  {
    color: colorsCard.urgent.dark,
    label: "Urgente",
  },
  {
    color: colorsCard.littleUrgent.dark,
    label: "Pouco urgente",
  },
  {
    color: colorsCard.notUrgent.dark,
    label: "Não urgente",
  },
];

function Dashboard() {
  const accessConfirmQueries = useUserHasPermission("PRI01");
  const accessConfirmedQueries = useUserHasPermission("PRI02");
  const accessFinances = useUserHasPermission("PRI03");
  const accessCashiers = useUserHasPermission("PRI04");
  const indicatorsPermission = useUserHasPermission("PRI05");

  return (
    <Container>
      {/*
      <div className="header">
        <div className="subinfos">
          <h6>{clinic.fantasy_name}</h6>
        </div>
      </div>
        */}
      <Error name="indicators">
        {indicatorsPermission && indicatorsPermission !== "loading" && (
          <div className="consults-day">
            <Indicators />
          </div>
        )}
      </Error>
      <Error name="confirmar consultas">
        {accessConfirmQueries && accessConfirmQueries !== "loading" && (
          <div className="consults-day">
            <NextConsultationsPanel
              title="Confirmar consultas"
              confirmed={false}
              type="confirmar"
            />
          </div>
        )}
      </Error>
      <Error name="já confirmadas">
        {accessConfirmedQueries && accessConfirmQueries !== "loding" && (
          <div className="consults-day uk-margin-top">
            <NextConsultationsPanel
              title="Consultas já confirmadas"
              confirmed={true}
            />
          </div>
        )}
      </Error>
      <Error name="finanças">
        {accessFinances && accessFinances !== "loading" && (
          <div className="consults-day uk-margin-top">
            <CardsFinances />
          </div>
        )}
      </Error>
      <Error name="caixas">
        {accessCashiers && accessCashiers !== "loading" && (
          <div className="consults-day uk-margin-top">
            <CardsCashiers />
          </div>
        )}
      </Error>
    </Container>
  );
}

export default Dashboard;
