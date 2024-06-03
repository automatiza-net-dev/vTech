// @ts-nocheck
// Core
import React, { memo, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

// Components
import { notification, Table } from "antd";
import { IconBox } from "./styles";

// Services
import { timelineService } from "@/OLD/services/timeline.service";

// Utils
import Columns from "./columns";
import moment from "moment";
import "moment/locale/pt-br";

// Icons
import { ArrowDownload } from "@styled-icons/fluentui-system-filled/ArrowDownload";

const ListPhotosVideo = memo(function ListPhotosVideo({ reload }) {
  const [allArquives, setAllArquives] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const patientId = router.query.subpage;

  const getAllArquives = useCallback(() => {
    setLoading(false);
    timelineService
      .listPhotosVideos(patientId)
      .then((res) => {
        res.data.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
        setAllArquives(
          res.data.map((item) => {
            return {
              realizedAt: moment(item?.createdAt).format("DD/MM/YYYY - HH:mm"),
              user: item?.timeline_info?.technician?.name,
              arquives: (
                <IconBox>
                  <a
                    href={`${process.env.NEXT_PUBLIC_API}${item?.timeline_info?.photo}`}
                    download
                    target="_blank"
                  >
                    <ArrowDownload size={20} className="down-icon" />
                  </a>
                </IconBox>
              ),
            };
          })
        );
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao buscar os arquivos registrados...",
        });
      });
  }, [patientId]);

  useEffect(() => {
    getAllArquives();
  }, [getAllArquives, reload]);

  return <Table dataSource={allArquives} columns={Columns} />;
});

export default ListPhotosVideo;
