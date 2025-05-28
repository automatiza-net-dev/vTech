// @ts-nocheck
// Core
import { memo, useState } from "react";

// Services
import { taxOperationService } from "@/OLD/services/tax-operation.service";

// Utils
import moment from "moment";
import "moment/locale/pt-br";

// Icons
import { FiEdit2 } from "react-icons/fi";

// Components
import { Table } from "antd";
import { Button, PageWrapper, useToast } from "infinity-forge";
import { useQuery } from "@/presentation/use-query";
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
  const { createToast } = useToast();

  const listTaxOperationsPermission = useUserHasPermission("OPF00");
  const canCreateTaxOperationService = useUserHasPermission("OPF01");
  const canEditTaxOperationService = useUserHasPermission("OPF02");
  const canDeleteTaxOperationService = useUserHasPermission("OPF03");

  const { data } = useQuery({
    queryKey: ["tax-operations"],
    queryFn: async () => taxOperationService.listTaxOperations({}),
  });

  const editPermission = useUserHasPermission("OPF2");

  return !listTaxOperationsPermission ||
    listTaxOperationsPermission === "loading" ? (
    <AccessDenied loading={listTaxOperationsPermission} />
  ) : (
    <PageWrapper title="Controle de operações fiscais">
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
          <div className="uk-margin-small-top">
            <Button
              onClick={() => setVisible(true)}
              disabled={!canCreateTaxOperationService}
              text="Cadastro"
            />
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
                  <FiEdit2
                    onClick={() => {
                      !editPermission
                        ? createToast({
                            message: "Ação não permitida",
                            status: "error",
                          })
                        : setSelectedTax(item);
                    }}
                    style={{ cursor: 'pointer', fontSize: '1.2rem' }}
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
    </PageWrapper>
  );
});

export default TaxOperations;
