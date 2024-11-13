import moment from "moment";
import { Icon } from "infinity-forge";

import { Product } from "@/domain";
import { Cart } from "../../add-product";

export function Aprroved(props: Product | Cart) {
  const approvalDate = moment(props?.courtesy_approved_at).format("DD/MM/YYYY");

  return (
    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: "15px" }}>
        <Icon name="CheckListIcon" color="green" />
      </div>
      Aprovado por {props?.courtesyApprovedUser?.name || "Usuário não mapeado"}{" "}
      em {approvalDate}
    </span>
  );
}
