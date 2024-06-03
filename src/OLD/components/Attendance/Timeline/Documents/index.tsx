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

// Icons
import { Printer } from "@styled-icons/bootstrap/Printer";

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
                  <Printer
                    className="down-icon"
                    size={20}
                    onClick={() => Print(item?.timeline_info?.value)}
                  />
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
