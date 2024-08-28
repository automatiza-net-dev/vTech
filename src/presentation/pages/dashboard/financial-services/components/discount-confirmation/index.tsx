import { Button } from "infinity-forge";

import * as S from "./styles";

export function DiscountConfirmation({ onConfirm, onCancel, origin }) {
  return (
    <S.DiscountConfirmation>
      <h2>Confirmar desconto</h2>
      <hr />
      <section>
        {origin === "Orçamento" ? "O orçamento" : "A venda"} possui itens com
        desconto acima do permitido, deseja gravar e enviar{" "}
        {origin === "Orçamento" ? "o orçamento" : "a venda"} para aprovação ?
      </section>
      <hr />
      <footer>
        <Button onClick={onConfirm} text="Confirmar" />
        <Button
          onClick={onCancel}
          text="Cancelar"
          style={{ backgroundColor: "#ff7b5a" }}
        />
      </footer>
    </S.DiscountConfirmation>
  );
}
