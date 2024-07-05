import { useLoadOpenNegotiations } from "@/presentation";

import moment from "moment";

import * as S from "./styles";

export function Negotiations() {
  const negotiations = useLoadOpenNegotiations();

  return (
    <S.Negotiations>
      {negotiations.data &&
        negotiations.data.map((negotiation) => (
          <section className="negotiation-box" key={negotiation.id}>
            <header className="negotiation-header">
              <h2>
                Avaliação {moment(negotiation?.created_at).format("DD/MM/YYYY")}
              </h2>
              <h2>{negotiation.patient.name}</h2>
            </header>
            <section>
              <p>
                <strong>Cliente</strong> <span>{negotiation.patient.name}</span>
              </p>
              <p>
                <strong>Usuário abertura</strong>{" "}
                <span>{negotiation.openUser.name}</span>
              </p>
              <p className="user-notes">
                <strong>Relato do cliente</strong>
                <br />
                <span>
                  Adicionar aqui relato do cliente, desejos e expectativas
                </span>
              </p>
            </section>
            <hr />
            {negotiation.budgets.map((budget) => (
              <div key={budget?.id} className="budget-container">
                <h3>Orçamento {budget?.tag}</h3>
                <section className="items-section">
                  <table>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Desc.</th>
                        <th>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budget?.items?.map((item) => (
                        <tr key={item.id} className="products-container">
                          <td>
                            {item.quantity}x{" "}
                            {item.productVariation.product.description}
                          </td>
                          <td>{item.discount_value}</td>
                          <td>{item.total_value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              </div>
            ))}
          </section>
        ))}
    </S.Negotiations>
  );
}
