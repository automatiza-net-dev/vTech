import { PrecoCard } from "../preco";
import { SubgruposDetalhado } from "../subgrupos-detalhado";
import { FaturamentoAgrupado } from "../faturamento-agrupado";
import { OrigemClientesCategoria } from "../origem-clientes-categoria";

import { DashboardCard } from "@/domain";

export function CardRenderingControl(props: DashboardCard) {
  switch (props.name) {
    case "FaturamentoAgrupado": {
      return <FaturamentoAgrupado {...props} />;
    }
    case "OrigemClientesporCategoria": {
      return <OrigemClientesCategoria {...props} />;
    }
    case "SubgruposDetalhado": {
      return <SubgruposDetalhado {...props} />;
    }
    default:
      return <PrecoCard {...props} />;
  }
}
