import { Icon } from "infinity-forge";

import { Product } from "@/domain";
import { Cart } from "../../add-product";

import moment from "moment";

export function Reproved(props: Product | Cart) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: "15px" }}>
        <Icon name="IconClose" color="#ff7b5a" />
      </div>
      Não Aprovado por{" "}
      {props?.courtesyApprovedUser?.name || "Usuário não mapeado"} em{" "}
      {moment(props?.courtesy_approved_at).format("DD/MM/YYYY")}
    </span>
  );
}
