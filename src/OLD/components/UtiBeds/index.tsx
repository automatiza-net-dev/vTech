// @ts-nocheck
// Core
import React, { memo, useEffect, useState, useCallback } from "react";

// Services
import { bedsService } from "@/OLD/services/beds.service";

// Utils
import moment from "moment";
import Columns from "./Columns";

// Icons
import { EditTwoTone } from "@ant-design/icons";

// Components
import { Input, Container } from "./styles";
import { Button, PageWrapper } from "infinity-forge";
import CreateBed from "./Create";
import RemoveBed from "./Delete";
import { Table, notification, Select } from "antd";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
const { Option } = Select;
import AccessDenied from "@/OLD/components/AccessDenied";

const labelFormat = (str) => {
  switch (str) {
    case "OBSERVATION":
      return "Observação / Triagem";
    case "ICU":
      return "Uti";
    case "HOSPITALIZATION":
      return "Internação";
  }
};

export function UtiBeds() {
  const [allBeds, setAllBeds] = useState([]);
  const [filters, setFilters] = useState({ active: "true" });
  const [createVisible, setCreateVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [updateData, setUpdateData] = useState(false);

  const listUtiBedsPermission = useUserHasPermission("LEI00");
  const canCreateUtiBeds = useUserHasPermission("LEI01");
  const canEditUtiBeds = useUserHasPermission("LEI02");
  const canDeleteUtiBeds = useUserHasPermission("LEI03");

  const getAllBeds = useCallback(() => {
    setLoading(true);
    bedsService
      .listBeds(filters)
      .then((res) => {
        res.data.sort((a, b) =>
          moment(b.created_at).diff(moment(a.created_at))
        );
        setAllBeds(
          res.data.map((item) => {
            return {
              name: item?.name,
              createdAt: moment(item?.created_at).format("DD/MM/YYYY - HH:mm"),
              tag: item?.tag,
              active: item?.active ? "Ativo" : "Inativo",
              type: labelFormat(item?.type),
              actions: (
                <div className="uk-flex uk-flex-around">
                  {canEditUtiBeds && (
                    <EditTwoTone
                      size={15}
                      onClick={() => {
                        setUpdateData(item);
                        setCreateVisible(true);
                      }}
                    />
                  )}
                  {canDeleteUtiBeds && (
                    <RemoveBed
                      id={item?.id}
                      reload={reload}
                      setReload={setReload}
                    />
                  )}
                </div>
              ),
            };
          })
        );
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao buscar os leitos cadastrados",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [reload, filters]);

  useEffect(() => {
    getAllBeds();
  }, [getAllBeds, canEditUtiBeds, canDeleteUtiBeds]);

  return !listUtiBedsPermission || listUtiBedsPermission === "loading" ? (
    <AccessDenied loading={listUtiBedsPermission} />
  ) : (
    <PageWrapper title="Gerenciamento de leitos">
      <Container>
        <div className="uk-margin-right uk-flex uk-flex-between uk-margin-top">
          <Input>
            <input
              type="search"
              placeholder="Sigla"
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
    
          </Input>
          <Input>
            <input
              type="search"
              placeholder="Tipo"
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            />
   
          </Input>
          <div className="uk-margin-small-top">
            <Button
              onClick={() => {
                setUpdateData(false);
                setCreateVisible(true);
              }}
              disabled={!canCreateUtiBeds}
              text="Cadastrar"
            />
          </div>
        </div>
        <hr />
        <div className="uk-margin-bottom">
          <label>Filtrar por:</label>
          <br />
          <Select
            className="uk-width-1-5"
            onChange={(e) => setFilters({ ...filters, active: e })}
            value={filters?.active}
          >
            <Option value="true">Ativo</Option>
            <Option value="false">Inativo</Option>
            <Option value="">Todos</Option>
          </Select>
        </div>
        <Table dataSource={allBeds} columns={Columns} />
        <CreateBed
          visible={createVisible}
          setVisible={setCreateVisible}
          reload={reload}
          setReload={setReload}
          updateData={updateData}
        />
      </Container>
    </PageWrapper>
  );
}
