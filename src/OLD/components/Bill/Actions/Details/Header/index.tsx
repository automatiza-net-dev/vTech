import React from "react";

import { FormHandler, Select } from "infinity-forge";

import { useTutor } from "@/OLD/hooks/useTutor";
import { useColaborators } from "@/OLD/hooks/useColaborators";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Input } from "antd";
import { Container } from "./styles";

import moment from "moment";

import { useConfigurationsSystem, useSystem } from "@/presentation";
import { statusBillText } from "../../../utils/status-formater";

export default function Header({
  bill,
  seller,
  setSeller,
  changeFields,
  setChangeFields,
  changeBillSeller,
  submitUpdateFinResponsible,
  finResponsible,
  setFinResponsible,
}: any) {
  const { colaborators } = useColaborators();
  const { tutors } = useTutor(false, false);

  const { unit } = useSystem();

  const hasInternalCode = unit?.configs?.businessUnits?.internal_code;
  const hasRelatedBills = unit?.configs?.bills?.related_bills;

  const changeSellerPermission = useUserHasPermission("VEN14");

  const { type } = useConfigurationsSystem();

  return (
    <Container className="uk-margin-top">
      <section className="uk-flex uk-flex-center">
        <div className="uk-margin-small-right">
          <label>Data de venda</label>
          <Input
            disabled
            value={moment(bill?.bill_date).format("DD/MM/YYYY")}
          />
        </div>
        <div className="uk-margin-small-right">
          <label>Código</label>
          <Input disabled value={bill?.tag} />
        </div>

        {hasInternalCode && (
          <div className="uk-margin-small-right">
            <label>Código Interno</label>
            <Input disabled value={bill?.internalCode} />
          </div>
        )}

        {hasRelatedBills && (
          <div className="uk-margin-small-right">
            <label>Tipo Venda Relacionada</label>
            <Input disabled value={bill?.billRelatedType?.description} />
          </div>
        )}

        <div className="uk-margin-small-right">
          <label>Total Venda</label>
          <Input disabled value={bill?.total_value} />
        </div>

        <div className="uk-margin-small-right">
          <label>Status Venda</label>
          <Input disabled value={bill?.status} />
        </div>
      </section>

      <section className="uk-flex uk-flex-center">
        <div className="uk-margin-small-right">
          <label>Nome Cliente</label>
          <Input disabled value={bill?.client?.name} />
        </div>
        {type === "Vet" && (
          <div className="uk-margin-small-right">
            <label>Nome paciente</label>
            <Input disabled value={bill?.patient?.name} />
          </div>
        )}

        <div className="uk-width-1-2">
          <label className="uk-margin-right">Resp. financeiro</label>
          {!changeFields?.finResponsible ? (
            <label
              className="uk-link"
              onClick={() =>
                setChangeFields((prv) => ({ ...prv, finResponsible: true }))
              }
            >
              Alterar
            </label>
          ) : (
            <>
              <span
                className="uk-link uk-margin-right"
                onClick={submitUpdateFinResponsible}
              >
                Salvar
              </span>
              <span
                className="uk-link"
                onClick={() => {
                  setChangeFields((prv) => ({ ...prv, finResponsible: false }));
                }}
              >
                Cancelar
              </span>
            </>
          )}

          {finResponsible?.name && (
            <FormHandler disableEnterKeySubmitForm>
              <Select
                disabled={!changeFields?.finResponsible}
                controlledInitialValue={{
                  value: tutors?.find((c) => c?.name === finResponsible?.name)
                    ?.id,
                }}
                onlyOneValue
                name="respfinanceiro"
                options={
                  tutors?.map((item) => ({
                    label: item.name,
                    value: item.id,
                  })) || []
                }
                onChangeInput={(value) => {
                  const tutor = tutors?.find((c) => c?.id === value);

                  if (tutor && tutor?.name !== finResponsible?.name) {
                    setFinResponsible({ name: tutor?.name, id: tutor?.id });
                  }
                }}
              />
            </FormHandler>
          )}
        </div>

        <div className="uk-margin-small-right uk-width-1-2">
          <label className="uk-margin-right">Vendedor</label>
          {bill?.status === "ABERTA" && changeSellerPermission && (
            <>
              {!changeFields?.seller ? (
                <label
                  className="uk-link"
                  onClick={() =>
                    setChangeFields((prv) => ({ ...prv, seller: true }))
                  }
                >
                  Alterar
                </label>
              ) : (
                <>
                  <span
                    className="uk-link uk-margin-right"
                    onClick={changeBillSeller}
                  >
                    Salvar
                  </span>
                  <span
                    className="uk-link"
                    onClick={() => {
                      setChangeFields((prv) => ({ ...prv, seller: false }));
                    }}
                  >
                    Cancelar
                  </span>
                </>
              )}
            </>
          )}
          {seller?.name && (
            <FormHandler disableEnterKeySubmitForm>
              <Select
                disabled={!changeFields?.seller}
                controlledInitialValue={{
                  value: colaborators?.find((c) => c?.name === seller?.name)
                    ?.id,
                }}
                onlyOneValue
                name="collaborator"
                options={
                  colaborators?.map((item) => ({
                    label: item.name,
                    value: item.id,
                  })) || []
                }
                onChangeInput={(value) => {
                  const collaborator = colaborators?.find(
                    (c) => c?.id === value
                  );

                  if (collaborator && collaborator?.name !== seller?.name) {
                    setSeller({
                      id: collaborator?.id,
                      name: collaborator?.name,
                    });
                  }
                }}
              />
            </FormHandler>
          )}
        </div>
      </section>

      {bill?.cancelled && (
        <>
          <h3 className="font-18-bold" style={{ marginTop: 20 }}>
            Dados de cancelamento
          </h3>

          <section className="uk-flex" style={{ marginBottom: 10 }}>
            <div className="uk-margin-small-right">
              <label>Data solicitação</label>
              <Input
                disabled
                value={moment(bill?.cancelDate).format("DD/MM/YYYY HH:mm")}
              />
            </div>

            <div className="uk-margin-small-right">
              <label>R$ Prod Cancelados</label>
              <Input
                disabled
                value={(bill?.cancelValueProducts || 0)?.toFixed(2)}
              />
            </div>

            <div className="uk-margin-small-right">
              <label>R$ Serv. Cancelados</label>
              <Input
                disabled
                value={(bill?.cancelValueServices || 0)?.toFixed(2)}
              />
            </div>

            <div className="uk-margin-small-right">
              <label>R$ Total. Cancelados</label>
              <Input
                disabled
                value={(bill?.cancelValueTotal || 0)?.toFixed(2)}
              />
            </div>

            <div className="uk-margin-small-right">
              <label>Usuário solicitação</label>
              <Input disabled value={bill?.cancelUser?.name} />
            </div>

            <div className="uk-margin-small-right">
              <label>Motivo cancelamento</label>
              <Input disabled value={bill?.cancelReason} />
            </div>
          </section>

          <section className="uk-flex">
            {bill?.cancelled_at && (
              <div className="uk-margin-small-right">
                <label>Data cancelamento</label>
                <Input
                  disabled
                  value={moment(bill?.cancelled_at).format("DD/MM/YYYY HH:mm")}
                />
              </div>
            )}

            <div className="uk-margin-small-right">
              <label>Usuário Cancelamento</label>
              <Input disabled value={bill?.finishCancelUser?.name} />
            </div>

            <div className="uk-margin-small-right">
              <label>Obs Cancelamento</label>
              <Input disabled value={bill?.cancelObservation} />
            </div>

            {bill?.cancelled && (
              <div className="uk-margin-small-right">
                <label>Status cancelamento</label>
                <Input disabled value={statusBillText(bill)} />
              </div>
            )}
          </section>
        </>
      )}
    </Container>
  );
}
