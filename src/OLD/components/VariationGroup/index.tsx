// @ts-nocheck
// Core
import { memo, useState } from "react";

// Services
import { variationGroupService } from "@/OLD/services/variation-group.service";

// Utils
import moment from "moment";
import "moment/locale/pt-br";

// Icons
import { EditTwoTone, ExpandOutlined } from "@ant-design/icons";

// Components
import { Table } from "antd";
import { Button, PageWrapper } from "infinity-forge";
import { useQuery } from "react-query";
import columns from "./Columns";
import CreateVariationGroup from "./Create";
import DeleteVariationGroup from "./Delete";
import EditVariationGroup from "./Edit";
import UpdateGroupVariations from "./Options";
import { Container } from "./styles";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import AccessDenied from "@/OLD/components/AccessDenied";

const VariationsGroups = memo(function Subgroups() {
  const [visible, setVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const listGroupVariationsPermission = useUserHasPermission("GVA01");
  const canCreateGroupVariations = useUserHasPermission("GVA01");
  const canEditGroupVariations = useUserHasPermission("GVA02");
  const canDeleteGroupVariations = useUserHasPermission("GVA03");

  const { data, refetch } = useQuery(
    ["variation-groups"],
    () => variationGroupService.listVariationGroups(),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: 1000 * 60,
    }
  );

  return !listGroupVariationsPermission ||
    listGroupVariationsPermission === "loading" ? (
    <AccessDenied loading={listGroupVariationsPermission} />
  ) : (
    <PageWrapper title="Controle de Variação">
      <Container>
        <div className="uk-margin-right uk-flex uk-flex-between uk-margin-top">
          <span />
          <div className="uk-margin-small-top">
            <Button
              onClick={() => setVisible(true)}
              disabled={!canCreateGroupVariations}
              text="Cadastro"
            />
          </div>
        </div>
        <hr />
        <Table
          className="uk-margin-top"
          dataSource={data?.map((item) => ({
            description: item?.description,
            nVariations: item?.variations.length,
            createdAt: moment(item?.created_at).format("DD/MM/YYYY - HH:mm"),
            status: item?.active ? "Ativo" : "Inativo",
            options: (
              <div className="uk-flex uk-flex-around">
                <ExpandOutlined
                  size={15}
                  onClick={() => {
                    setSelectedId(item.id);
                  }}
                />
              </div>
            ),
            actions: (
              <div className="uk-flex uk-flex-around">
                {canEditGroupVariations && (
                  <EditTwoTone
                    size={15}
                    onClick={() => {
                      setSelectedGroup(item);
                    }}
                  />
                )}
                {canDeleteGroupVariations && (
                  <DeleteVariationGroup
                    id={item?.id}
                    close={() => setSelectedGroup(null)}
                  />
                )}
              </div>
            ),
          }))}
          columns={columns}
        />
        <UpdateGroupVariations
          visible={!!selectedId}
          id={selectedId}
          hide={() => {
            refetch();
            setSelectedId(null);
          }}
        />
        <CreateVariationGroup
          visible={visible}
          hide={() => {
            setVisible(false);
          }}
        />
        <EditVariationGroup
          visible={!!selectedGroup}
          hide={() => setSelectedGroup(null)}
          groupInfo={selectedGroup}
        />
      </Container>
    </PageWrapper>
  );
});

export default VariationsGroups;
