// @ts-nocheck
import { memo } from "react";

import { useProfile } from "@/OLD/hooks/useProfile";

import { Container } from "./styles";
import PrintHeader from "@/OLD/components/mini-components/Print/PrintHeader";

import { currencyFormatter } from "@/OLD/components/Budget";
import moment from "moment";

const PrintScreen = memo(function PrintScreen({ data }) {
  const { clinic } = useProfile();

  return (
    <Container>
      <div className="clinic-header">
        <PrintHeader unit={clinic} />
        <div className="uk-text-center">
          <h4 className="">Relatório de vendas analítico</h4>
        </div>
      </div>
      {data?.map((bill) => (
        <div className="uk-margin-top">
          <div className="uk-flex content-box uk-flex-around">
            <div>Data Venda</div>
            <div>C. Venda</div>
            <div>Status</div>
            <div>V. Produtos</div>
            <div>V. Serviços</div>
            <div>V. Desconto</div>
            <div>Vendas total</div>
            <div>Vendedor</div>
            <div>Cliente</div>
            <div>Paciente</div>
          </div>
          <div className="uk-flex content-box uk-flex-around">
            <div>{moment(bill?.billDate).format("DD/MM/YYYY")}</div>
            <div>{bill?.tag}</div>
            <div>{bill?.status}</div>
            <div>{currencyFormatter(bill?.productValue)}</div>
            <div>{currencyFormatter(bill?.serviceValue)}</div>
            <div>{currencyFormatter(bill?.discountValue)}</div>
            <div>{currencyFormatter(bill?.totalValue)}</div>
            <div>{bill?.seller?.name}</div>
            <div>{bill?.client?.name}</div>
            <div>{bill?.patient?.name}</div>
          </div>
          <div className="uk-margin-left uk-margin-top">
            <div className="uk-flex content-box uk-flex-around">
              <div>Item</div>
              <div>Qtd</div>
              <div>R$ Custo</div>
              <div>R$ Unitário</div>
              <div>R$ Desconto</div>
              <div>R$ Total</div>
            </div>
            {bill?.items?.map((item) => (
              <div className="uk-flex content-box uk-flex-around">
                <div>{item?.product?.description}</div>
                <div>{item?.quantity}</div>
                <div>{currencyFormatter(item?.costValue)}</div>
                <div>
                  {currencyFormatter(item?.totalValue / item?.quantity)}
                </div>
                <div>{currencyFormatter(item?.discountValue)}</div>
                <div>{currencyFormatter(item?.totalValue)}</div>
              </div>
            ))}
          </div>
          <div className="uk-margin-left uk-margin-top">
            <div className="uk-flex content-box uk-flex-around">
              <div>Forma de pagamento</div>
              <div>Bloco</div>
              <div>Parcela</div>
              <div>Valor</div>
              <div>NSU</div>
              <div>Vencimento</div>
            </div>
            {bill?.payments?.map((payment) => (
              <div className="uk-flex content-box uk-flex-around">
                <div>
                  {payment?.paymentMethod?.description}
                  {payment?.flag && `- ${payment?.flag?.description}`}
                </div>
                <div>{payment?.block}</div>
                <div>{payment?.installments}</div>
                <div>{currencyFormatter(payment?.totalValue)}</div>
                <div>[Verificar]</div>
                <div>[Verificar]</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Container>
  );
});

export default PrintScreen;
