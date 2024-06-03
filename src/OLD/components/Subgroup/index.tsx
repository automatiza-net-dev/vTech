// @ts-nocheck
// Core
import { memo, useState } from "react";

// Services
import { subgroupsService } from "@/OLD/services/subgroups.service";

// Utils
import moment from "moment";
import "moment/locale/pt-br";

// Icons
import { EditTwoTone } from "@ant-design/icons";
import { SearchIcon } from "@/OLD/common/icons";

// Components
import { Select, Table, notification } from "antd";
import { Button } from "@/OLD/components/mini-components";
import { useQuery } from "react-query";
import columns from "./Columns";
import CreateSubgroup from "./Create";
import DeleteSubgroup from "./Delete";
import EditSubgroup from "./Edit";
import { Container, Input } from "./styles";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import AccessDenied from "@/OLD/components/AccessDenied";
const { Option } = Select;

const Subgroups = memo(function Subgroups() {
  const [filters, setFilters] = useState({ active: "active" });
  const [visible, setVisible] = useState(false);
  const [selectedSubgroup, setSelectedSubgroup] = useState(null);

  const { data, isLoading } = useQuery(
    ["subgroups", filters],
    () => subgroupsService.listSubgroups(filters),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: 1000 * 60,
    },
    {
      enabled: true,
    }
  );

  const listSubgroupsPermission = useUserHasPermission("SBG00");
  const canCreateSubGroup = useUserHasPermission("SBG01");
  const canEditSubGroup = useUserHasPermission("SBG02");
  const canDeleteSubGroup = useUserHasPermission("SBG03");

  return !listSubgroupsPermission || listSubgroupsPermission === "loading" ? (
    <AccessDenied loading={listSubgroupsPermission} />
  ) : (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">Controle de subgrupos</h3>
      <div className="uk-margin-right uk-flex uk-flex-between uk-margin-top">
        <Input>
          <input
            type="search"
            placeholder="Descrição"
            onChange={(e) =>
              setFilters({ ...filters, description: e.target.value })
            }
          />
          <SearchIcon />
        </Input>
        <div className="uk-margin-small-top">
          <Button
            onClick={() => setVisible(true)}
            disabled={!canCreateSubGroup}
          >
            {" "}
            Cadastro{" "}
          </Button>
        </div>
      </div>
      <hr />
      <Table
        className="uk-margin-top"
        dataSource={data?.map((item) => ({
          description: item?.description,
          parent: item?.parent?.description,
          createdAt: moment(item?.created_at).format("DD/MM/YYYY - HH:mm"),
          status: item?.active ? "Ativo" : "Inativo",
          actions: (
            <div className="uk-flex uk-flex-around">
              {canEditSubGroup && (
                <EditTwoTone
                  size={15}
                  onClick={() => {
                    if (!permissions?.SBG2) {
                      return notification.error({
                        message: "Ação não permitida",
                      });
                    }

                    setSelectedSubgroup(item);
                  }}
                />
              )}
              {canDeleteSubGroup && (
                <DeleteSubgroup
                  id={item?.id}
                  close={() => setSelectedSubgroup(null)}
                />
              )}
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
  );
});

export default Subgroups;
