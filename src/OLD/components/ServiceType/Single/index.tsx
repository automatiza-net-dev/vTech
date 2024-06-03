// @ts-nocheck
import { Button, LoadingSkeleton } from "@/OLD/components/mini-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";
import { convertDate } from "@/OLD/utils/convertDate";
import { Edit } from "../Edit";

export const Single = memo(() => {
  const router = useRouter();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const id = router?.query?.innerpage;

  const handleGet = useCallback(() => {
    setLoading(true);
    scheduleTypeServices
      .getSingleScheduleServiceGroup(id)
      .then((res) => {
        setData(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, reload]);

  useEffect(() => {
    handleGet();
  }, [handleGet]);

  return loading ? (
    <LoadingSkeleton />
  ) : (
    <div>
      <div className="uk-flex uk-flex-between uk-margin-bottom">
        <h3 className="uk-margin-remove">Tipo de agendamento</h3>
        <Link href="/dashboard/tipos-servico">
          <Button>Voltar</Button>
        </Link>
      </div>
      <div
        className="uk-card uk-card-body uk-margin-bottom"
        style={{ background: "#fff", borderRadius: "20px", marginTop: "50px" }}
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
                Descrição:
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
          </div>
        </>
      </div>
    </div>
  );
});
