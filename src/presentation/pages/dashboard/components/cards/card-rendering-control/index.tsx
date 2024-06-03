import { DashboardCard, DashboardCardBoundBilling } from "@/domain";

export function CardRenderingControl(props: DashboardCard) {
  switch (props.name) {
    case "FaturamentoAgrupado": {
      return (
        <div className="card-box">
          {props?.faturamento_realizado && (
            <>
              <h3>{props.faturamento_realizado.description}</h3>
              <h4>{props.faturamento_realizado.value}</h4>
              <hr />
              {props.items.map((item) => (
                <h6 className="item-description">{item?.value}</h6>
              ))}
            </>
          )}
        </div>
      );
    }
    case "OrigemClientesporCategoria": {
      return (
        <div className="card-box">
          <div className="card-header">
            <span>Descrição</span>
            <span>Fatur.</span>
            <span>Porcent.</span>
          </div>
          {(props.items as any).categories.map((item) => (
            <>
              <section className="first-section">
                <span>{item?.categoria}</span>
                <span>R$: {item?.faturamento}</span>
                <span>{item?.porcentagem.toFixed(2)}%</span>
              </section>
              {item?.grupos.map((group) => (
                <>
                  <section className="second-section">
                    <span>{group?.grupo}</span>
                    <span>R$: {group?.total}</span>
                    <span>{group?.porcentagem.toFixed(2)}%</span>
                  </section>
                  {group?.origem_clientes.map((origin) => (
                    <section className="third-section">
                      <span>{origin?.origem}</span>
                      <span>R$: {origin?.total}</span>
                      <span>{origin?.porcentagem.toFixed(2)}%</span>
                    </section>
                  ))}
                </>
              ))}
            </>
          ))}
        </div>
      );
    }
    case "SubgruposDetalhado": {
      return (
        <div className="card-box">
          <div className="card-header-sugroup">
            <span>Descrição</span>
            <span className="text-right">Total</span>
            <span className="text-right">%</span>
            <span className="text-right">Qtd.</span>
          </div>
          {(props.items as any).map((item) => (
            <>
              <section className="first-section-subgroup">
                <span>{item?.description}</span>
                <span className="text-right">R$: {item?.total}</span>
                <span className="text-right">
                  {item?.percentage.toFixed(2)}%
                </span>
                <span className="text-right">{item?.quantity}</span>
              </section>
              {item?.children.map((child) => (
                <section className="second-section-sugroup">
                  <span>{child?.description}</span>
                  <span className="text-right">R$: {child?.total}</span>
                  <span className="text-right">
                    {child?.percentage.toFixed(2)}%
                  </span>
                  <span className="text-right">{child?.quantity}</span>
                </section>
              ))}
            </>
          ))}
        </div>
      );
    }
    default:
      return (
        <div className="card-box" key={props.name}>
          {props?.items?.length > 0 &&
            props?.items?.map((subItem) => (
              <div key={subItem?.description} className="subitem-box">
                <h3>
                  <strong>
                    {subItem?.description === "Tendencia"
                      ? `${subItem?.percentage} - ${subItem?.value}`
                      : subItem?.value}
                  </strong>
                </h3>
                <h4>{subItem.description}</h4>
              </div>
            ))}
        </div>
      );
  }
}
