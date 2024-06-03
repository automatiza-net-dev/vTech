// @ts-nocheck
// Core
import { memo, useState } from "react";

// Services
import { variationService } from "@/OLD/services/variation.service";

// Utils
import moment from "moment";
import "moment/locale/pt-br";

// Icons
import { EditTwoTone, ExpandOutlined } from "@ant-design/icons";
import { SearchIcon } from "@/OLD/common/icons";

// Components
import { Table } from "antd";
import { Button } from "@/OLD/components/mini-components";
import { useQuery } from "react-query";
import columns from "./Columns";
import CreateVariation from "./Create";
import DeleteVariation from "./Delete";
import EditVariation from "./Edit";
import UpdateVariationOptions from "./Options";
import { Container, Input } from "./styles";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import AccessDenied from "@/OLD/components/AccessDenied";

const Variations = memo(function Variations() {
  const [filters, setFilters] = useState({ description: "" });
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const listVariationsPermission = useUserHasPermission("VAR00");
  const canCreateVariations = useUserHasPermission("VAR01");
  const canEditVariations = useUserHasPermission("VAR02");
  const canDeleteVariations = useUserHasPermission("VAR03");

  const { data, refetch } = useQuery(
    ["variations", filters],
    () => variationService.listVariations(filters),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: 1000 * 60,
    }
  );

  return !listVariationsPermission || listVariationsPermission === "loading" ? (
    <AccessDenied loading={listVariationsPermission} />
  ) : (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">Controle de variações</h3>
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
            disabled={!canCreateVariations}
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
          createdAt: moment(item?.created_at).format("DD/MM/YYYY - HH:mm"),
          nOptions: item?.options.length,
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
              {canEditVariations && (
                <EditTwoTone
                  size={15}
                  onClick={() => {
                    setSelected(item);
                  }}
                />
              )}
              {canDeleteVariations && (
                <DeleteVariation
                  id={item?.id}
                  close={() => setSelected(null)}
                />
              )}
            </div>
          ),
        }))}
        columns={columns}
      />
      <UpdateVariationOptions
        visible={!!selectedId}
        id={selectedId}
        hide={() => {
          refetch();
          setSelectedId(null);
        }}
      />
      <CreateVariation
        visible={visible}
        hide={() => {
          setVisible(false);
        }}
      />
      <EditVariation
        visible={!!selected}
        hide={() => setSelected(null)}
        variationInfo={selected}
      />
    </Container>
  );
});

export default Variations;
