import { Bill } from "@/domain";

import moment from "moment";

export function AuthorizationInformations(props: Bill) {
  return (
    <div className="inputs">
      <div>
        <label>Data de venda</label>
        <input
          disabled
          value={moment(props?.bill_date).format("HH:mm DD/MM/YYYY")}
        />
      </div>

      <div>
        <label>Código</label>
        <input disabled value={props?.tag} />
      </div>

      <div>
        <label>Vendedor</label>
        <input disabled value={props?.seller?.name} />
      </div>

      <div>
        <label>Nome Cliente</label>
        <input disabled value={props?.client?.name} />
      </div>
    </div>
  );
}
