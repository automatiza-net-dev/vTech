// @ts-nocheck
// Core
import { memo, useState } from "react";

// Services
import { taxOperationService } from "@/OLD/services/tax-operation.service";

// Utils
import moment from "moment";
import "moment/locale/pt-br";

// Icons
import { EditTwoTone } from "@ant-design/icons";
import { SearchIcon } from "@/OLD/common/icons";

// Components
import { Table, notification } from "antd";
import { Button } from "@/OLD/components/mini-components";
import { useQuery } from "react-query";
import AccessDenied from "@/OLD/components/AccessDenied";

import columns from "./Columns";
import CreateTaxOperation from "./Create";
import DeleteTaxOperation from "./Delete";
import UpdateTaxOperation from "./Edit";
import { Container, Input } from "./styles";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

const TaxOperations = memo(function TaxOperations() {
  const [filters, setFilters] = useState({ active: "active" });
  const [visible, setVisible] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);

  const listTaxOperationsPermission = useUserHasPermission("OPF00");
  const canCreateTaxOperationService = useUserHasPermission("OPF01");
  const canEditTaxOperationService = useUserHasPermission("OPF02");
  const canDeleteTaxOperationService = useUserHasPermission("OPF03");

  const { data } = useQuery(
    ["tax-operations"],
    () => taxOperationService.listTaxOperations({}),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: 1000 * 60,
    }
  );

  return !listTaxOperationsPermission ||
    listTaxOperationsPermission === "loading" ? (
    <AccessDenied loading={listTaxOperationsPermission} />
  ) : (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">Controle de Operações Fiscais</h3>
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
            disabled={!canCreateTaxOperationService}
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
          code: item?.code,
          movement_type: item?.movement_type,
          movement_category: taxOperationService.mapLabel(
            item?.movement_category
          ),
          generates_financial: item?.generates_financial ? "Sim" : "Não",
          accounting_result: item?.accounting_result ? "Sim" : "Não",
          active: item?.active ? "Ativo" : "Inativo",
          createdAt: moment(item?.created_at).format("DD/MM/YYYY - HH:mm"),
          actions: (
            <div className="uk-flex uk-flex-around">
              {canEditTaxOperationService && (
                <EditTwoTone
                  size={15}
                  onClick={() => {
                    !permissions?.OPF2
                      ? notification.error({ message: "Ação não permitida" })
                      : setSelectedTax(item);
                  }}
                />
              )}
              {canDeleteTaxOperationService && (
                <DeleteTaxOperation
                  id={item?.id}
                  close={() => setSelectedTax(null)}
                />
              )}
            </div>
          ),
        }))}
        columns={columns}
      />
      <CreateTaxOperation
        visible={visible}
        hide={() => {
          setVisible(false);
        }}
      />
      <UpdateTaxOperation
        visible={!!selectedTax}
        hide={() => setSelectedTax(null)}
        initialData={selectedTax}
      />
    </Container>
  );
});

export default TaxOperations;
