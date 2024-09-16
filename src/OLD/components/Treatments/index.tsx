// @ts-nocheck
import React, { useState, useEffect, useCallback, memo } from "react";

import { useTreatments } from "@/OLD/hooks/useTreatment";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Container } from "./styles";
import Filters from "./Filters";
import { Table } from "antd";
import Actions from "./Actions";
import AccessDenied from "@/OLD/components/AccessDenied";
import { PageWrapper } from "infinity-forge";

import { treatmentsColumns } from "./Columns";
import moment from "moment";

const Treatments = memo(function Treatments() {
  const [filters, setFilters] = useState({});
  const [reload, setReload] = useState(false);
  const [formattedTreatments, setFormattedTreatments] = useState([]);

  const { treatments } = useTreatments(filters, reload);

  const listTreatmentsPermission = useUserHasPermission("TRA00");

  const formatTreatments = () => {
    setFormattedTreatments(
      treatments.map((treatment) => ({
        date: moment(treatment?.emissionDate).format("DD/MM/YYYY"),
        code: treatment?.id,
        client: treatment?.client?.name,
        seller: treatment?.seller?.name,
        status: treatment?.status,
        actions: <Actions treatment={treatment} />,
      }))
    );
  };

  useEffect(() => {
    treatments.length > 0 ? formatTreatments() : setFormattedTreatments([]);
  }, [treatments]);

  return !listTreatmentsPermission || listTreatmentsPermission === "loading" ? (
    <AccessDenied loading={listTreatmentsPermission} />
  ) : (
    <PageWrapper title="Tratamentos">
      <Container>
        <Filters filters={filters} setFilters={setFilters} />
        <hr />
        <Table columns={treatmentsColumns} dataSource={formattedTreatments} />
      </Container>
    </PageWrapper>
  );
});

export default Treatments;
