// @ts-nocheck
import React, { memo, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useOpportunities } from "@/OLD/hooks/useOpportunities";
import { useAuth } from "@/OLD/hooks/useAuth";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useProfile } from "@/OLD/hooks/useProfile";

import { Container } from "./styles";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";
import { Table, Button } from "antd";
import Actions from "./Actions";
import Filters from "./Filters";

import { liftOneOpportunitiesColumns, opportunitiesColumns } from "./columns";
import moment from "moment";
import { currencyFormatter } from "@/OLD/components/Budget";
import masks from "@/OLD/utils/masks";

const Opportunities = memo(function Opportunities({
  title = true,
  clients,
  colaborators,
  crmStatus,
  contactTypes,
  subjects,
  actTypes,
  currentKanbanTab,
}) {
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    openingFrom: moment(),
    openingTo: moment(),
    noSearch: true,
  });
  const [formattedOpportunities, setFormattedOpportunities] = useState([]);

  
  const { user } = useProfile();

  
  const viewAllOpportunitiesPermission = useUserHasPermission("CRM09");

  const router = useRouter();

  const { opportunities, loadingOpportunities } = useOpportunities(
    filters,
    reload,
    currentKanbanTab === "2"
  );

  const formatOpportunities = () => {
    setLoading(true);

    opportunities?.sort((a, b) =>
      moment(b.openingDate).diff(moment(a.openingDate))
    );

    console.log(opportunities, "<<<")

    setFormattedOpportunities(
      opportunities.map((opp) => ({
        patientName: opp?.client?.name,
        contactName: opp?.contact?.name,
        phone: opp?.contact?.cellphone
          ? masks.phone(opp?.contact?.cellphone)
          : "-",
        user: opp?.user?.name,
        status: opp?.status?.description,
        balance: opp?.balance ? opp?.balance : "Em Aberto",
        unit: opp?.unit?.identification,
        value: opp?.value ? currencyFormatter(opp?.value) : "-",
        date: opp?.contactDate
          ? moment(opp?.contactDate).format("DD/MM/YYYY - HH:mm")
          : "-",
        launchDate: opp?.openingDate
          ? moment(opp?.openingDate).format("DD/MM/YYYY - HH:mm")
          : "-",
        actions: (
          <Actions
            setReload={setReload}
            opportunity={opp}
            clients={clients}
            colaborators={colaborators}
            crmStatus={crmStatus}
            contactTypes={contactTypes}
            subjects={subjects}
            actTypes={actTypes}
          />
        ),
      }))
    );
  };

  useEffect(() => {
    opportunities?.length > 0
      ? formatOpportunities()
      : setFormattedOpportunities([]);
  }, [opportunities]);

  useEffect(() => {
    !viewAllOpportunitiesPermission &&
      setFilters({ ...filters, technician: user?.id });
    setReload((prv) => !prv);
  }, [viewAllOpportunitiesPermission]);

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
      <section className="uk-width-1-1">
        {title && <h3 className="uk-margin-remove">Oportunidades</h3>}
        <Filters
          filters={filters}
          setFilters={setFilters}
          setReload={setReload}
          crmStatus={crmStatus}
          colaborators={colaborators}
        />
      </section>
      <hr className="" />
      <Table
        columns={
          process.env.client !== "liftone"
            ? opportunitiesColumns
            : liftOneOpportunitiesColumns
        }
        dataSource={formattedOpportunities}
        loading={loadingOpportunities}
      />
      <footer>
        <CustomButton onClick={() => router.back()}>Voltar</CustomButton>
      </footer>
    </Container>
  );
});

export default Opportunities;
