// @ts-nocheck
// Core
import { memo, useState } from "react";

// Services
import { subgroupsService } from "@/OLD/services/subgroups.service";

// Utils
import moment from "moment";
import "moment/locale/pt-br";

// Icons
import { FiEdit2, FiTrash2 } from "react-icons/fi";

// Components
import { Select, Table } from "antd";
import { Button, PageWrapper, useToast } from "infinity-forge";
import { useQuery } from "infinity-forge";
import columns from "./Columns";
import CreateSubgroup from "./Create";
import DeleteSubgroup from "./Delete";
import EditSubgroup from "./Edit";
import { Container, Input } from "./styles";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import AccessDenied from "@/OLD/components/AccessDenied";
import { Popconfirm } from "antd";
const { Option } = Select;

const Subgroups = memo(function Subgroups() {
  const [filters, setFilters] = useState({ active: "active" });
  const [visible, setVisible] = useState(false);
  const [selectedSubgroup, setSelectedSubgroup] = useState(null);
  const { createToast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["subgroups", filters],
    queryFn: () => subgroupsService.listSubgroups(filters),
  });

  const listSubgroupsPermission = useUserHasPermission("SBG00");
  const canCreateSubGroup = useUserHasPermission("SBG01");
  const canEditSubGroup = useUserHasPermission("SBG02");
  const canDeleteSubGroup = useUserHasPermission("SBG03");

  return !listSubgroupsPermission || listSubgroupsPermission === "loading" ? (
    <AccessDenied loading={listSubgroupsPermission} />
  ) : (
    <PageWrapper title="Controle de subgrupos">
      <Container>
        <div className="uk-margin-right uk-flex uk-flex-between uk-margin-top">
          <Input>
            <input
              type="search"
              placeholder="Descrição"
              onChange={(e) =>
                setFilters({ ...filters, description: e.target.value })
              }
            />
          </Input>
          {canCreateSubGroup && (
            <div className="uk-margin-small-top">
              <Button
                onClick={() => setVisible(true)}
                text="Cadastro"
                type="button"
              />
            </div>
          )}
        </div>
        <hr />
        <Table
          className="uk-margin-top"
          dataSource={data?.map((item) => ({
            description: item?.description,
            parent: item?.parent?.description,
            createdAt: moment(item?.created_at).format("DD/MM/YYYY - HH:mm"),
            status: item?.active ? "Ativo" : "Inativo",
            actions: item.economic_group_id ? (
              <div className="uk-flex uk-flex-around">
                {canEditSubGroup && (
                  <FiEdit2
                    onClick={() => {
                      if (!permissions?.SBG2) {
                        return createToast({
                          message: "Ação não permitida",
                          status: "error",
                        });
                      }

                      setSelectedSubgroup(item);
                    }}
                    style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                  />
                )}
                {canDeleteSubGroup && (
                  <Popconfirm
                    title="Deseja remover este subgrupo?"
                    onConfirm={() =>
                      !canDeleteSubGroup
                        ? createToast({ message: "Ação não permitida", status: "error" })
                        : setSelectedSubgroup(null)
                    }
                  >
                    {canDeleteSubGroup && <FiTrash2
                      className="uk-margin-small-left"
                      style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                    />}
                  </Popconfirm>
                )}
              </div>
            ) : (
              <div className="">
                <span style={{ fontWeight: 'bold' }}>Padrão</span>
              </div>
            ),
          }))}
          columns={columns}
        />
        <CreateSubgroup
          visible={visible}
          subgroups={data ?? []}
          hide={() => {
            setVisible(false);
          }}
        />
        <EditSubgroup
          visible={!!selectedSubgroup}
          hide={() => setSelectedSubgroup(null)}
          subgroupInfo={selectedSubgroup}
          subgroups={data ?? []}
        />
      </Container>
    </PageWrapper>
  );
});

export default Subgroups;
