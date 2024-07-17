// @ts-nocheck
import { memo, useEffect, useState } from "react";

import { usePlans } from "@/OLD/hooks/usePlans";
import { useReceipt } from "@/OLD/hooks/useReceipts";
import { useFiscalData } from "@/OLD/hooks/useBills";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Input } from "antd";
import { Container } from "./styles";
import { DatePicker } from "@mui/x-date-pickers";
import { Select, FormHandler } from "infinity-forge";
import AccessDenied from "@/OLD/components/AccessDenied";
import PaymentsPanel from "@/OLD/components/Notes/PaymentsPanel";

import moment from "moment";

const AddPaymentsScreen = memo(function AddPaymentsScreen({ id, setVisible }) {
  const [reload, setReload] = useState(false);
  const [ids, setIds] = useState({});
  const [fiscalDataFilters, setFiscalDataFilters] = useState({});
  const [data, setData] = useState({});
  const [plansFilters, setPlansFilter] = useState({ type: "DEBITO" });
  const [accountPlanId, setAccountPlanId] = useState("");

  const { receipt } = useReceipt(ids, reload);
  const { fiscalData } = useFiscalData(fiscalDataFilters);
  const { plans } = usePlans(plansFilters);

  const addPaymentsPermission = useUserHasPermission("ENT04");

  useEffect(() => {
    setIds({ ids: [id] });
  }, [id]);

  useEffect(() => {
    receipt?.length > 0 &&
      setFiscalDataFilters({ bill: receipt[0]?.id, type: "ENTRADA" });
  }, [receipt]);

  useEffect(() => {
    receipt?.length > 0 &&
      setData({ ...receipt[0], createdAt: moment(receipt[0]?.created_at) });
    setAccountPlanId(receipt[0]?.supplier.tutor?.account_plan_id);
  }, [receipt]);

  return !addPaymentsPermission || addPaymentsPermission === "loading" ? (
    <AccessDenied loading={addPaymentsPermission} />
  ) : (
    <Container className="uk-padding-small">
      <h3 className="uk-margin-remove">
        Adicionar pagamento - nota de entrada: {receipt[0]?.tag}{" "}
      </h3>
      <section className="custom-header uk-margin-small-top">
        <div className="uk-flex" style={{ gap: "10px" }}>
          <div className="uk-width-1-2">
            <label>Chave Acesso Nfe</label>
            <Input value={fiscalData[0]?.access_key} disabled />
          </div>
          <div className="uk-width-1-5">
            <label>Nota fiscal</label>
            <Input value={fiscalData[0]?.sequence} disabled />
          </div>
          <div className="uk-width-1-5">
            <label>Modelo</label>
            <Input disabled value={fiscalData[0]?.model} />
          </div>
          <div className="uk-width-1-5">
            <label>Serie</label>
            <Input disabled value={fiscalData[0]?.series} />
          </div>
          <div>
            <label>Data Emissão</label>
            <br />
            <DatePicker
              slotProps={{ textField: { variant: "standard" } }}
              value={data?.createdAt}
              disabled
            />
          </div>
        </div>
      </section>
      <div className="uk-flex uk-margin-small-top" style={{ gap: "10px" }}>
        <div className="uk-width-1-5">
          <label>Código da entrada</label>
          <Input value={receipt[0]?.tag} disabled />
        </div>
        <div className="uk-width-1-4">
          <label>Funcionário</label>
          <Input disabled value={receipt[0]?.seller?.name} />
        </div>
        <div>
          <label>Fornecedor</label>
          <Input disabled value={receipt[0]?.supplier?.name} />
        </div>
        {plans.length > 0}
        <FormHandler>
          <label>Plano de contas para geração dos tributos</label>
          <Select
            onChangeSelect={(val) => setAccountPlanId(val)}
            onlyOneValue
            isMultiple={false}
            menuPlacement="bottom"
            name="accountPlanId"
            value={accountPlanId}
            options={plans.map((plan) => ({
              value: plan.id,
              label: plan.description,
            }))}
          />
        </FormHandler>
      </div>
      <div className="uk-margin-top payment-container uk-padding-small">
        <PaymentsPanel
          payments={receipt[0]?.payments}
          reload={reload}
          setReload={setReload}
          receipt={receipt[0]}
          setVisible={setVisible}
          accountPlanId={accountPlanId}
        />
      </div>
    </Container>
  );
});

export default AddPaymentsScreen;
