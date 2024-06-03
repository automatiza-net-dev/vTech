// @ts-nocheck
// Core
import React, { useState, memo, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

// Services
import { timelineService } from "@/OLD/services/timeline.service";

// Utils
import moment from "moment";
import "moment/locale/pt-br";
import Columns from "./columns";
import { Print } from "@/OLD/utils/generalUtils";

// Components
import { Table, notification } from "antd";
import { IconBox } from "./styles";

const DocumentsList = memo(function DocumentsList({ reload }) {
  const [allDocuments, setAllDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const patientId = router.query.subpage;

  const getAllDocuments = useCallback(() => {
    setLoading(true);
    timelineService
      .listDocuments(patientId)
      .then((res) => {
        res.data.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
        setAllDocuments(
          res.data.map((item) => {
            return {
              realizedAt: moment(item?.createdAt).format("DD/MM/YYYY - HH:mm"),
              user: item?.timeline_info?.technician?.name,
              type: item?.timeline_info?.type,
              arquives: (
                <IconBox>
                  <svg
                    className="down-icon"
                    onClick={() => Print(item?.timeline_info?.value)}
                    viewBox="0 0 16 16"
                    height="20"
                    width="20"
                    focusable="false"
                    role="img"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    class="StyledIconBase-sc-ea9ulj-0 hRnJPC"
                  >
                    <title>Printer icon</title>
                    <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"></path>
                    <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"></path>
                  </svg>
                </IconBox>
              ),
            };
          })
        );
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Não foi possível recuperar os documentos registrados...",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [patientId, reload]);

  useEffect(() => {
    getAllDocuments();
  }, [getAllDocuments]);

  return <Table dataSource={allDocuments} columns={Columns} />;
});

export default DocumentsList;
