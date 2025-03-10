import React from "react";

import { useTutor } from "@/OLD/hooks/useTutor";
import { useColaborators } from "@/OLD/hooks/useColaborators";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Input, AutoComplete } from "antd";
import { Container } from "./styles";

import moment from "moment";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { useAuthAdmin } from "infinity-forge";
import {
  billStatusFormatter,
  cancelledStatus,
  statusBillText,
} from "../../../utils/status-formater";

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
  const { user } = useAuthAdmin();
  const hasInternalCode = user?.unit?.unitConfig?.internalCode;

  const changeSellerPermission = useUserHasPermission("VEN14");

  return (
    <Container className="uk-margin-top">
      <div style={{ marginTop: -40, textAlign: "right" }}>
        <p className="font-16-regular">Status Venda: {bill?.status}</p>
      </div>
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
          <AutoComplete
            disabled={!changeFields?.seller}
            value={seller?.name}
            className="uk-width-1-1"
            options={colaborators?.map((colab: any) => ({
              ...colab,
              value: colab?.name,
              key: colab?.id,
            }))}
            onChange={(val) => setSeller({ ...seller, name: val })}
            onSelect={(_, opt) => {
              setSeller({ id: opt?.id, name: opt?.name });
            }}
            filterOption={(val, opt) =>
              normalizeStr(opt?.value.toUpperCase()).includes(
                normalizeStr(val.toUpperCase())
              )
            }
          />
        </div>
        <div className="uk-margin-small-right">
          <label>Nome Cliente</label>
          <Input disabled value={bill?.client?.name} />
        </div>
        {process.env.client !== "liftone" && (
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
          <AutoComplete
            disabled={!changeFields?.finResponsible}
            className="uk-width-1-1"
            options={tutors?.map((tutor: any) => ({
              ...tutor,
              key: tutor?.id,
              value: tutor?.name,
            }))}
            value={finResponsible?.name}
            onChange={(val) =>
              setFinResponsible((prv) => ({ ...prv, name: val }))
            }
            onSelect={(val, opt) =>
              setFinResponsible({ name: opt?.value, id: opt?.id })
            }
            filterOption={(val, opt) =>
              normalizeStr(opt?.value.toUpperCase()).includes(
                normalizeStr(val.toUpperCase())
              )
            }
          />
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
