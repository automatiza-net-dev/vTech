// @ts-nocheck
// Core
import React, { memo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

// Components
import { notification } from "antd";
import { IconBox, CustomSection } from "./styles";
import Single from "./Single";
import LastUpdateCard from "./LastUpdateCard";

// Services
import { timelineService } from "@/OLD/services/timeline.service";

// Utils
import moment from "moment";
import "moment/locale/pt-br";
import { Print } from "@/OLD/utils/generalUtils";

// Icons
import { ArrowDownload } from "@styled-icons/fluentui-system-filled/ArrowDownload";
import { Cancel } from "@styled-icons/typicons/Cancel";
import { Printer } from "@styled-icons/bootstrap/Printer";

export default  function LastUpdates({
  reload,
  patient,
  setReload,
  setActiveTab,
  filter,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(false);
  const [arquives, setArquives] = useState(false);

  const router = useRouter();
  const patientId = router.query.subpage;

  const detectDownload = (item) => {
    switch (item?.timeline_type?.description) {
      case "Documento":
        return (
          <Printer
            size={20}
            className="down-icon"
            onClick={() => Print(item?.timeline_info?.value)}
          />
        );
      case "Formato Receita Médica":
        return (
          <Printer
            size={20}
            className="down-icon"
            onClick={() => Print(item?.timeline_info?.recipe)}
          />
        );
      case "Fotos":
        return (
          <a
            href={`${process.env.NEXT_PUBLIC_API}${item?.timeline_info?.photo}`}
            download
            target="_blank"
          >
            <ArrowDownload size={20} className="down-icon" />
          </a>
        );
      case "Observação":
        return (
          <IconBox>
            <a
              href={`${process.env.NEXT_PUBLIC_API}${item?.timeline_info?.photo}`}
              download
              target="_blank"
            >
              <ArrowDownload size={20} className="down-icon" />
            </a>
          </IconBox>
        );
      default:
        return <Cancel size={20} />;
    }
  };

  const getAppointmentsByTag = useCallback(() => {
    setLoading(true);
    timelineService
      .listLastUpdates(patientId)
      .then((res) => {
        res.data.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
        setData(
          res.data.filter((item) => {
            if (filter.includes("all")) {
              return item;
            }
            return filter.includes(item?.timeline_type?.description);
          })
        );
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message:
            "Houve um erro ao buscar as últimas atualizações lançadas...",
        });
      })
      .finally(() => setLoading(false));
  }, [router.query.subpage, reload, filter]);

  useEffect(() => {
    getAppointmentsByTag();
  }, [getAppointmentsByTag]);

  return (
    <div className="uk-flex uk-flex-between">
      <section className="uk-width-1-5">
        <LastUpdateCard
          updateList={data}
          patient={patient}
          setSelectedUpdate={setSelectedUpdate}
          reload={reload}
        />
      </section>
      <CustomSection>
        {selectedUpdate && (
          <Single
            setActiveTab={setActiveTab}
            selectedUpdate={selectedUpdate}
            reload={reload}
            setReload={setReload}
            patient={patient}
            setSelectedUpdate={setSelectedUpdate}
          />
        )}
      </CustomSection>
    </div>
  );
}
