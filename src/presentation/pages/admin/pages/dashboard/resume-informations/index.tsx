import * as S from "./styles";

export function ResumeInformations() {
  return (
    <S.ResumeInformations>
      <div className="informations">
        <div>
          <h4>Faturamento realizado:</h4>
          <p className="total-price border">R$ 0,00</p>
        </div>

        <div className="parcelas-box">
          <span>0% De vendas a vista</span>
          <span>0x Parcelamento médio</span>
          <span>R$ 0 (0) Tkt médio vendas</span>
          <span>R$ 0 (0) Tkt médio clientes</span>
        </div>
      </div>

      <div className="informations">
        <h4>Orçamentos não confirmados</h4>
        <span className="total-price">R$ 0,00 (0)</span>
      </div>
    </S.ResumeInformations>
  );
}
