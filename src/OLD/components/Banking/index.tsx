// @ts-nocheck
// Core
import React, { memo, useEffect, useState } from "react";
import { useRouter } from "next/router";

// Hooks
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

// Utils
import { Columns } from "./Columns";
import moment from "moment";
import { currencyFormatter } from "@/OLD/components/Budget";

// Components
import { Container } from "./styles";
import { Button, PageWrapper } from "infinity-forge";
import { Table, Tooltip } from "antd";
import { useBankings } from "@/OLD/hooks/useBankings";
import Filters from "./Filters";
import Actions from "./Actions";
import AccessDenied from "@/OLD/components/AccessDenied";

const Banking = memo(function Banking() {
  const [filters, setFilters] = useState({});
  const [reload, setReload] = useState(false);
  const [formatedBankings, setFormatedBankings] = useState([]);
  const { bankings } = useBankings(filters, reload);
  const router = useRouter();

  const createMovementPermission = useUserHasPermission("BAN01");
  const listMovementsPermission = useUserHasPermission("BAN00");

  useEffect(() => {
    setFilters({ from: moment(), to: moment() });
  }, []);

  const formatBankings = () => {
    setFormatedBankings(
      bankings.map((banking) => {
        return {
          document: (
            <Tooltip title="Clique para visualizar detalhes">
              <span
                onClick={() =>
                  router.push(
                    `/dashboard/controle-bancario/visualizar/${banking?.id}`
                  )
                }
                className="uk-link"
              >
                {banking?.document}
              </span>
            </Tooltip>
          ),
          type: banking?.type,
          account: banking?.checkingAccount?.description,
          historic: banking?.historic,
          date: banking?.issue_date
            ? moment(banking?.issue_date).format("DD/MM/YYYY")
            : "Não informado",
          value: currencyFormatter(banking?.total_value),
          actions: (
            <Actions banking={banking} reload={reload} setReload={setReload} />
          ),
        };
      })
    );
  };

  useEffect(() => {
    bankings?.length > 0 ? formatBankings() : setFormatedBankings([]);
  }, [bankings]);

  return !listMovementsPermission || listMovementsPermission === "loading" ? (
    <AccessDenied loading={listMovementsPermission} />
  ) : (
    <PageWrapper title="Consulta bancário">
      <Container>
        <div className="uk-flex uk-flex-right">
          {createMovementPermission && (
            <Button
              onClick={() => router.push(`/dashboard/controle-bancario/novo`)}
              text="Nova Movimentação"
            />
          )}
        </div>
        <Filters
          filters={filters}
          setFilters={setFilters}
          reload={reload}
          setReload={setReload}
          firstItem={bankings[0]}
          lastItem={bankings[bankings?.length - 1]}
        />
        <section className="uk-margin-top">
          <Table columns={Columns} dataSource={formatedBankings} />
        </section>
      </Container>
    </PageWrapper>
  );
});

export default Banking;
