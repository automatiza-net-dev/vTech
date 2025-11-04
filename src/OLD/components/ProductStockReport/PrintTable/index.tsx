import { Empty } from "antd";
import { memo, useMemo, useRef } from "react";
import { PrintHeader } from "@/presentation";
import { Container, RowBox } from "./styles";

const PrintTable = memo(function PrintTable(props: {
  data: {
    productId: string;
    productDescription: string;
    subgroupDescription: string;
    deposits: {
      id: number;
      description: string;
      quantity: number;
    }[];
  }[];
  loading: boolean;
}) {
  const componentRef = useRef(null);

  // Extrai todos os depósitos únicos
  const allDeposits = useMemo(() => {
    const depositMap = new Map<number, string>();
    props.data?.forEach((item) => {
      item.deposits.forEach((dep) => {
        depositMap.set(dep.id, dep.description);
      });
    });
    return Array.from(depositMap.entries()).map(([id, description]) => ({
      id,
      description,
    }));
  }, [props.data]);

  return (
    <Container ref={componentRef}>
      <div className="clinic-header">
        <PrintHeader />
        <div className="uk-text-center">
          <h4>Estoque de Produtos</h4>
        </div>
      </div>

      <div className="table-section">
        {/* Cabeçalho da tabela */}
        <section className="header-table">
          <div>Produto</div>
          <div>Subgrupo</div>
          {allDeposits.map((dep) => (
            <div key={dep.id}>{dep.description}</div>
          ))}
          <div>Total</div>
        </section>

        {/* Corpo da tabela */}
        <section className="table-box">
          {props.loading ? (
            <div className="uk-text-center">Carregando...</div>
          ) : props.data?.length > 0 ? (
            props.data.map((item) => {
              const total = item.deposits.reduce(
                (acc, dep) => acc + dep.quantity,
                0,
              );
              return (
                <RowBox key={item.productId}>
                  <div>{item.productDescription}</div>
                  <div>{item.subgroupDescription}</div>
                  {allDeposits.map((dep) => {
                    const found = item.deposits.find((d) => d.id === dep.id);
                    return <div key={dep.id}>{found ? found.quantity : 0}</div>;
                  })}
                  <div>{total}</div>
                </RowBox>
              );
            })
          ) : (
            <Empty className="uk-margin-top" />
          )}
        </section>
      </div>
    </Container>
  );
});

export default PrintTable;
