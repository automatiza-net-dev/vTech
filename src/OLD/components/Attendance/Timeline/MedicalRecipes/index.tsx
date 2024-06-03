// @ts-nocheck
// Core
import React, { memo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

// Services
import { timelineService } from "@/OLD/services/timeline.service";

// Components
import { Table } from "antd";
import { IconBox } from "./styles";

// Utils
import Columns from "./Columns";
import moment from "moment";
import "moment/locale/pt-br";
import { Print } from "@/OLD/utils/generalUtils";

// Icons
import { Printer } from "@styled-icons/bootstrap/Printer";

const MedicalRecipesList = memo(function MedicalRecipesList({ reload }) {
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const patientId = router.query.subpage;

  const getAllMedicalRecipes = useCallback(() => {
    setLoading(true);
    timelineService
      .listMedicalRecipes(patientId)
      .then((res) => {
        res.data.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
        setAllRecipes(
          res.data.map((item) => {
            return {
              user: item?.timeline_info?.technician?.name,
              title: item?.timeline_info?.name,
              arquives: (
                <IconBox>
                  <Printer
                    className="down-icon"
                    size={20}
                    onClick={() => Print(item?.timeline_info?.recipe)}
                  />
                </IconBox>
              ),
              realizedAt: moment(item?.createdAt).format("DD/MM/YYYY - HH:mm"),
            };
          })
        );
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao buscar as receitas medicas registradas...",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [patientId, reload]);

  useEffect(() => {
    getAllMedicalRecipes();
  }, [getAllMedicalRecipes]);

  return <Table dataSource={allRecipes} columns={Columns} />;
});

export default MedicalRecipesList;
