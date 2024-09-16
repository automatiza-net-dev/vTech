// @ts-nocheck
import { LoadingSkeleton } from "@/OLD/components/mini-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";
import { convertDate } from "@/OLD/utils/convertDate";
import { Button, PageWrapper } from "infinity-forge";
import { Edit } from "../Edit";

export const Single = () => {
  const router = useRouter();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [serviceType, setServiceType] = useState(null);
  const [reload, setReload] = useState(false);

  const id = router?.query?.innerpage;

  const handleGetScheduleType = useCallback(() => {
    setLoading(true);
    scheduleTypeServices
      .getSingleScheduleType(id)
      .then((res) => {
        setData(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, reload]);

  const handleGetServiceType = useCallback(() => {
    setLoading(true);
    scheduleTypeServices
      .getSingleScheduleServiceGroup(data?.schedule_service_group_id)
      .then((res) => {
        setServiceType(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [data, reload]);

  useEffect(() => {
    id && handleGetScheduleType();
  }, [handleGetScheduleType, router]);

  useEffect(() => {
    data?.schedule_service_group_id && handleGetServiceType();
  }, [data, reload, handleGetServiceType]);

  return loading ? (
    <LoadingSkeleton />
  ) : (
    <PageWrapper title="Categoria de agendamento">
      <div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link href="/dashboard/categorias-agendamento">
            <Button text="Voltar" />
          </Link>
        </div>
        <div
          className="uk-card uk-card-body uk-margin-bottom"
          style={{
            background: "#fff",
            borderRadius: "20px",
            marginTop: "50px",
            border: "0.5px solid #cacaca",
          }}
        >
          <>
            <div className="uk-flex uk-flex-between uk-margin-bottom">
              <h3 className="uk-heading-line uk-margin-remove">
                <span>Dados</span>
              </h3>
              <Edit reload={reload} setReload={setReload} />
            </div>

            <div className="uk-flex ">
              <div className="uk-flex uk-flex-column uk-margin-xlarge-right">
                <span>
                  Tipo de agendamento:
                  {` ${data?.description}`}
                </span>
                <span>
                  Criado em:
                  {` ${convertDate(data?.created_at)}`}
                </span>
                <span>
                  Status:
                  {data?.active ? " Ativo" : " Inativo"}
                </span>
              </div>
              <div className="uk-flex uk-flex-column uk-margin-xlarge-right">
                <span>
                  Tipo de serviço:
                  {` ${serviceType?.description}`}
                </span>
                <span>
                  Criado em:
                  {` ${convertDate(serviceType?.created_at)}`}
                </span>
                <span>
                  Status:
                  {serviceType?.active ? " Ativo" : " Inativo"}
                </span>
              </div>
            </div>
          </>
        </div>
      </div>
    </PageWrapper>
  );
};
