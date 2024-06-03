import { useRouter } from "next/router";

import { Collapse } from "antd";
import styled from "styled-components";

import { sortItems } from "@/OLD/utils/sortItems";
import { useUnits } from "@/OLD/hooks/useProducts";
import { useSubgroups } from "@/OLD/hooks/useSubgroup";
import AccessDenied from "@/OLD/components/AccessDenied";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useReceiptsWithProducts } from "@/OLD/hooks/useReceipts";
import { useTaxationGroups } from "@/OLD/hooks/useTaxationGroups";
import { SinglePendingProducts } from "@/OLD/components/PendingProducts/Single";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";

import { LayoutDashboard } from "@/presentation";

const { Panel } = Collapse;

export default function PendingProductsPage() {

  const { receipts } = useReceiptsWithProducts(false);
  const { taxationGroups } = useTaxationGroups();
  const { subgroups } = useSubgroups();
  const { units } = useUnits("PRODUCT");

  const router = useRouter();

  sortItems(taxationGroups, "name");
  sortItems(subgroups, "description");

  const pendingProductsPermission = useUserHasPermission("ENT11");

  return (
    <LayoutDashboard>
      {!pendingProductsPermission || pendingProductsPermission === "loading" ? (
        <AccessDenied loading={false} />
      ) : (
        <Container className="uk-padding-small">
          <h3 className="uk-margin-remove">Produtos pendentes</h3>
          <section className="custom-container uk-shadow-small">
            <h5>Notas com produtos pendentes</h5>
            <hr />
            <div>
              {receipts?.length > 0 &&
                receipts?.map((receipt: any) => (
                  <Collapse>
                    <Panel
                      key="note"
                      header={`Nota ${receipt?.tag} - ${receipt?.supplier?.name}`}
                    >
                      <SinglePendingProducts
                        receipt={receipt}
                        taxationGroups={taxationGroups}
                        units={units}
                        subgroups={subgroups}
                      />
                    </Panel>
                  </Collapse>
                ))}
            </div>
          </section>
          {receipts?.length === 0 && (
            <div className="uk-flex uk-flex-right uk-margin-small-top">
              <CustomButton size={"small"} onClick={() => router.back()}>
                Voltar
              </CustomButton>
            </div>
          )}
        </Container>
      )}
    </LayoutDashboard>
  );
}

 const Container = styled("div")`
  .custom-container {
    background-color: #ffffff;
    border-radius: 5px;
    margin-top: 2%;
    padding: 20px;
  }

  .custom-button {
    padding: 10px;

    :hover {
      border: solid 0.5px var(--blue);
      border-radius: 5px;
      cursor: pointer;
    }
  }
`;
