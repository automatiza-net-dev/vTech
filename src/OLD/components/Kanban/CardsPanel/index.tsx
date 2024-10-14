// @ts-nocheck
import { useState, useEffect } from "react";

import { useKanbanOpportunities } from "@/OLD/hooks/useOpportunities";

import { Container } from "./styles";
import Filters from "./Filters";
import StatusColumns from "./StatusColumns";

import moment from "moment";

const status = [
  { title: "Nova Oportunidade", label: "Nova Oportunidade" },
  { title: "Agendado", label: "Agendado" },
  { title: "Comparecido", label: "Comparecido" },
  { title: "Faltou-Desmarcou", label: "Faltou/Cancelou" },
  { title: "Fechado", label: "Fechado" },
];

function CardsPanel({
  clients,
  colaborators,
  crmStatus,
  contactTypes,
  subjects,
  actTypes,
  currentKanbanTab,
}) {
  const [filters, setFilters] = useState({
    dateFrom: moment(),
    dateTo: moment(),
    noSearch: true,
  });
  const [reload, setReload] = useState(false);

  const { opportunities } = useKanbanOpportunities(
    filters,
    reload,
    currentKanbanTab === "1"
  );

  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        setFilters((prv) => ({ ...prv, noSearch: false }));
        setReload((prv) => !prv);
      }
    });
  }, []);

  return (
    <Container>
      <Filters
        filters={filters}
        setFilters={setFilters}
        setReload={setReload}
      />
      <hr />
      <section className="cards-container">
        {status.map((st, i) => (
          <StatusColumns
            clients={clients}
            colaborators={colaborators}
            crmStatus={crmStatus}
            contactTypes={contactTypes}
            actTypes={actTypes}
            subjects={subjects}
            column={st}
            key={i}
            orderBy={filters?.orderBy}
            opportunities={
              opportunities[
                Object.keys(opportunities).find((it) => {
                  return st?.title?.includes(it);
                })
              ]
            }
            setReload={setReload}
            reload={reload}
          />
        ))}
      </section>
    </Container>
  );
}

export default CardsPanel;
