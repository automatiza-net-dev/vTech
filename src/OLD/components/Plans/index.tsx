// @ts-nocheck
import { memo, useState, useCallback, useEffect } from "react";

import { usePlans } from "@/OLD/hooks/usePlans";
import { usePlansGroup } from "@/OLD/hooks/usePlansGroup";

import { plansColumns } from "./Columns/Plans";

import { planService } from "@/OLD/services/plan.service";

import { Container } from "./styles";
import { Button, PageWrapper, useToast } from "infinity-forge";
import { Table, Modal } from "antd";
import FormChild from "./FormChild";
import Filters from "./Filters";
import Actions from "./Actions";
import AccessDenied from "@/OLD/components/AccessDenied";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

const Plans = memo(function Plans() {
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [filters, setFilters] = useState(false);
  const [groupFilters, setGroupFilters] = useState({});
  const [data, setData] = useState({ active: true });
  const [createVisible, setCreateVisible] = useState(false);
  const [formatedPlans, setFormatedPlans] = useState([]);

  const { plans } = usePlans(filters, reload);
  const { createToast } = useToast();

  const { plansGroup } = usePlansGroup(groupFilters);

  const listAccountPlansPermission = useUserHasPermission("PCT00");
  const canCreateAccountPlans = useUserHasPermission("PCT01");

  const sortByGroupOrParent = () => {
    filters?.orderBy &&
      plans.sort((a, b) => {
        if (
          `${a[filters?.orderBy]?.description}` <
          `${b[filters?.orderBy]?.description}`
        ) {
          return -1;
        }
        if (
          `${a[filters?.orderBy]?.description}` >
          `${b[filters?.orderBy]?.description}`
        ) {
          return 1;
        }

        return 0;
      });
  };

  const sortPlans = () => {
    filters?.orderBy &&
      plans.sort((a, b) => {
        if (filters?.orderBy !== "code") {
          if (`${a[filters?.orderBy]}` < `${b[filters?.orderBy]}`) {
            return -1;
          }
          if (`${a[filters?.orderBy]}` > `${b[filters?.orderBy]}`) {
            return 1;
          }
        } else {
          return a.code - b.code;
        }
        return 0;
      });
  };

  const formatPlans = useCallback(() => {
    filters?.orderBy === "group" || filters.orderBy === "parent"
      ? sortByGroupOrParent()
      : sortPlans();

    setFormatedPlans(
      plans.map((plan) => {
        return {
          description: plan?.description,
          planGroup: plan?.group?.description,
          code: plan?.code,
          dre: plan?.dre ? "Sim" : "Não",
          type: plan?.type,
          status: plan?.active ? "Ativo" : "Inativo",
          parent: plan?.parent?.description,
          actions: plan.economic_group_id ? (
            <Actions
              plans={plans}
              plansGroup={plansGroup}
              reload={reload}
              setReload={setReload}
              plan={plan}
            />
          ) : (
            <div className="">
              <span style={{ fontWeight: 'bold' }}>Padrão</span>
            </div>
          ),
        };
      })
    );
  }, [plans, plansGroup, reload, setReload]);

  useEffect(() => {
    plans.length > 0 ? formatPlans() : setFormatedPlans([]);
  }, [formatPlans]);

  const submitCreatePlan = useCallback(async () => {
    if (!canCreateAccountPlans) {
      return createToast({ message: "Ação não permitida", status: "error" });
    }

    try {
      setLoading(true);
      await planService.createAccountPlan(data);

      setLoading(false);
      setReload(!reload);
      setCreateVisible(false);
      setData({ active: true });

      return createToast({
        message: "Plano de contas cadastrado com sucesso!",
        status: "success",
      });
    } catch (error) {
      return createToast({
        message: "Houve um erro ao cadastrar o plano...",
        status: "error",
      });
    }
  }, [data]);

  return !listAccountPlansPermission ||
    listAccountPlansPermission === "loading" ? (
    <AccessDenied loading={listAccountPlansPermission} />
  ) : (
    <PageWrapper title="Plano de contas">
      <Container>
        <section className="uk-flex uk-flex-middle uk-flex-between">
          <Filters
            filters={filters}
            setFilters={setFilters}
            plansGroup={plansGroup}
          />
          <div>
            <Button
              onClick={() => setCreateVisible(true)}
              disabled={!canCreateAccountPlans}
              text="Cadastrar"
            />
          </div>
        </section>
        <hr />
        <Table columns={plansColumns} dataSource={formatedPlans} />
        <Modal
          visible={createVisible}
          title="Criar plano de contas"
          onCancel={() => setCreateVisible(false)}
          footer={null}
        >
          <FormChild
            data={data}
            setData={setData}
            submit={submitCreatePlan}
            setVisible={setCreateVisible}
            plansGroup={plansGroup}
            setGroupFilters={setGroupFilters}
            groupFilters={groupFilters}
          />
        </Modal>
      </Container>
    </PageWrapper>
  );
});

export default Plans;
