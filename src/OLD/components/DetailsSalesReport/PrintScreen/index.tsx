// @ts-nocheck
import { memo } from "react";

import { useProfile } from "@/OLD/hooks/useProfile";

import { Container } from "./styles";
import { PrintHeader } from "@/presentation";

import { currencyFormatter } from "@/OLD/components/Budget";
import moment from "moment";

function PrintScreen({ reports }) {
  const { clinic } = useProfile();

  return (
    <Container>
      <div className="clinic-header">
        <PrintHeader />
        <div className="uk-text-center">
          <h4 className="">Relatório de vendas analítico</h4>
        </div>
      </div>
      {reports?.map((item) => (
        <div className="uk-margin-top">
          <div className="uk-text-center">
            <h4 className="uk-margin-remove">Venda: {item?.codigo_venda}</h4>
          </div>
          <section className="uk-margin-top">
            <h6>Unidade</h6>
            <div className="uk-flex uk-flex-around content-box">
              <div>
                Sistema:
                <br />
                {item?.sistema}{" "}
              </div>
              <div>
                Grupo:
                <br />
                {item?.grupo}
              </div>
              <div>
                Cidade:
                <br />
                {item?.cidade}
              </div>
              <div>
                Uf:
                <br />
                {item?.uf}
              </div>
            </div>
          </section>
          <section className="uk-margin-top">
            <h6 className="uk-margin-remove">Dados venda</h6>
            <div className="uk-flex uk-flex-around content-box">
              <div>
                Data Venda:
                <br />
                {item?.data_venda
                  ? moment(item?.data_venda)?.format("DD/MM/YYYY")
                  : "-"}
              </div>
              <div>
                Hora Venda:
                <br />
                {item?.data_venda
                  ? moment(item?.data_venda)?.format("HH:mm")
                  : "-"}
              </div>
              <div>
                Código venda:
                <br />
                {item?.codigo_venda}
              </div>
              <div>
                Vendedor:
                <br />
                {item?.vendedor}
              </div>
            </div>
            <div className="uk-flex uk-flex-around content-box">
              <div>
                Tipo:
                <br />
                {item?.tipo_item || "-"}
              </div>
              <div>
                Subgrupo:
                <br />
                {item?.subgrupo_item || "-"}
              </div>
              <div>
                Descrição:
                <br />
                {item?.descricao_item || "-"}
              </div>
              <div>
                Quantidade:
                <br />
                {item?.qtd_item || "-"}
              </div>
            </div>
            <div className="uk-flex uk-flex-around content-box">
              <div>
                Valor unitário:
                <br />
                {currencyFormatter(item?.valor_unitario_item)}
              </div>
              <div>
                Valor bruto:
                <br />
                {currencyFormatter(item?.valor_bruto_item)}
              </div>
              <div>
                Desconto:
                <br />
                {currencyFormatter(item?.valor_desconto_item)}
              </div>
              <div>
                Valor Líquido:
                <br />
                {currencyFormatter(item?.valor_liquido_item)}
              </div>
            </div>
          </section>
          <section className="uk-margin-top">
            <h6 className="uk-margin-remove">Cliente</h6>
            <div className="uk-flex uk-flex-around content-box">
              <div>
                Data cadastro:
                <br />
                {item?.data_cadastro_cliente
                  ? moment(item?.data_cadastro_cliente).format("DD/MM/YYYY")
                  : "-"}
              </div>
              <div>
                Nome Cliente:
                <br />
                {item?.nomecliente}
              </div>
              <div>
                {" "}
                CPF/CNPJ:
                <br />
                {item?.cpfcnpj || "-"}{" "}
              </div>
              <div>
                Celular:
                <br />
                {item?.cellphone}
              </div>
            </div>
            <div className="uk-flex uk-flex-around content-box">
              <div>
                Origem:
                <br />
                {item?.origem_cliente}
              </div>
              <div>
                Profissao:
                <br />
                {item?.profissao_cliente || "-"}
              </div>
              <div>
                Cep:
                <br />
                {item?.cep_cliente || "-"}
              </div>
              <div>
                Endereco cliente:
                <br />
                {item?.endereço_cliente || "-"}
              </div>
            </div>
            <div className="uk-flex uk-flex-around content-box">
              <div>
                Numero endereço:
                <br />
                {item?.numero_endereco_cliente || "-"}
              </div>
              <div>
                Complemento:
                <br />
                {item?.complemento_endereco_cliente || "-"}
              </div>
              <div>
                Bairro:
                <br />
                {item?.bairro_cliente || "-"}
              </div>
              <div>
                Cidade:
                <br />
                {item?.cidade_cliente || "-"}
              </div>
              <div>
                Uf:
                <br />
                {item?.cidade_cliente || "-"}
              </div>
            </div>
          </section>
          <section className="uk-margin-top">
            <h6 className="uk-margin-remove">Dependente</h6>
            <div className="uk-flex uk-flex-around content-box">
              <div>
                Nome:
                <br />
                {item?.dependente || "-"}
              </div>
              <div>
                RG:
                <br />
                {item?.dependente_rg || "-"}
              </div>
              <div>
                Data nascimento:
                <br />
                {item?.data_nasc_dep
                  ? moment(item?.data_nasc_dep).format("DD/MM/YYYY")
                  : "-"}
              </div>
              <div>
                Genero:
                <br />
                {item?.genero_dep}
              </div>
            </div>
            <div className="uk-flex uk-flex-around content-box">
              <div>
                Espécie:
                <br />
                {item?.especie_dep || "-"}
              </div>
              <div>
                Raça:
                <br />
                {item?.raca_dep || "-"}
              </div>
              <div>
                Castrado:
                <br />
                {item?.castrado_dep || "-"}
              </div>
              <div>
                Vacinado:
                <br />
                {item?.vacinado_dep || "-"}
              </div>
            </div>
            <div className="uk-flex uk-flex-around content-box">
              <div>
                Ultimo peso:
                <br />
                {item?.weight || "-"}
              </div>
              <div>
                Obito:
                <br />
                {item?.obito_dep || "-"}
              </div>
              <div>
                Data Obito:
                <br />
                {item?.data_obito_dep
                  ? moment(item?.data_obito_dep).format("DD/MM/YYYY")
                  : "-"}
              </div>
            </div>
          </section>
          <hr />
        </div>
      ))}
    </Container>
  );
};

export default PrintScreen;
