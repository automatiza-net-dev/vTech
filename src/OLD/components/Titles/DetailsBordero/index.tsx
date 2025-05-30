// @ts-nocheck
import { memo, useState, useEffect, useCallback } from "react";

import { financesService } from "@/OLD/services/finances.service";

import { useRouter } from "next/router";
import { useShowBordero } from "@/OLD/hooks/useFinances";

import { Container } from "./styles";
import { Button, useToast } from "infinity-forge";
import { Input, Table, Modal } from "antd";
import FormChild from "@/OLD/components/Titles/Actions/BorderoActions/FormChild";
import Actions from "./Actions";

import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { columns } from "./Columns";
import moment from "moment";

const BorderoDetails = memo(function BorderoDetails({ borderoId, setVisible }) {
  const [filters, setFilters] = useState({ type: "completo" });
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formattedTitles, setFormattedTitles] = useState([]);
  const [downModalVisible, setDownModalVisible] = useState(false);
  const [revertModalVisible, setRevertModalVisible] = useState(false);
  const [revertData, setRevertData] = useState({});
  const [downData, setDownData] = useState({
    interestValue: currencyFormatter(0),
    discountValue: currencyFormatter(0),
    interestPercentage: 0,
    discountPercentage: 0,
    paymentDate: moment(),
  });

  const router = useRouter();

  const { createToast } = useToast();

  const { bordero } = useShowBordero(borderoId, filters, reload);

  const formatTitles = () => {
    setFormattedTitles(
      bordero?.finances?.map((finance) => ({
        doc: finance?.document,
        installments: `${finance?.installment} / ${finance?.qty_installments}`,
        flag: finance?.flag?.description || "-",
        originalValue: currencyFormatter(finance?.original_value),
        paymentMethod: finance?.paymentMethod?.description,
        feePercentage: finance?.fee_percentage || "-",
        feeValue: currencyFormatter(finance?.fee_discount_value),
        value: currencyFormatter(finance?.value),
        nsu: finance?.nsu_document || "-",
        actions: (
          <Actions
            finance={finance}
            reload={reload}
            setReload={setReload}
            borderoId={bordero?.id}
            borderoStatus={bordero?.status}
          />
        ),
      }))
    );
  };

  useEffect(() => {
    bordero?.finances?.length > 0 ? formatTitles() : setFormattedTitles([]);
  }, [bordero]);

  const closeBordero = useCallback(() => {
    setLoading(true);
    -financesService
      .closeBordero({ id: bordero?.id })
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);

        return createToast({
          status: "success",
          message: "Borderô fechado com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);

        return createToast({
          status: "error",
          message: "houve um erro ao fechar o borderô",
        });
      });
  }, [bordero?.id]);

  const reopenBordero = useCallback(() => {
    setLoading(true);

    financesService
      .reopenBordero({ id: bordero?.id })
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
      
        return createToast({
          status: "success",
          message: "Borderô reaberto com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);
     
        return createToast({
          status: "error",
          message: "houve um erro ao reabrir o borderô",
        });
      });
  }, [bordero?.id]);

  const submitDownBordero = useCallback(() => {
    setLoading(true);

    console.log("@@@", downData)

    financesService
      .downBordero({
        id: bordero?.id,
        paymentMethodId: downData?.paymentMethodId,
        checkingAccountId: downData?.checkingAccountId,
        paymentDate: moment(downData?.paymentdate).format("YYYY-MM-DD"),
        interestValue: convertIntlCurrency(downData?.interestValue),
        interestPercentage: downData?.interestPercentage,
        discountValue: convertIntlCurrency(downData?.discountValue),
        discountPercentage: downData?.discountPercentage,
      })
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        setDownModalVisible(false);
        setDownData({
          interestValue: currencyFormatter(0),
          discountValue: currencyFormatter(0),
        });
      
        return createToast({
          status: "success",
          message: "Bordero baixado com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);

        return createToast({
          status: "error",
          message: "Houve um erro interno ao baixar o bordero selecionado #err",
        });
      });
  }, [downData, bordero]);

  const submitRevertBordero = useCallback(() => {
    setLoading(true);

    financesService
      ?.revertDownBordero({
        id: bordero?.id,
        paymentMethodId: revertData?.paymentMethodId,
        reason: revertData?.reason,
      })
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        setRevertModalVisible(false);
        setDownData({
          interestValue: currencyFormatter(0),
          discountValue: currencyFormatter(0),
        });

        return createToast({
          status: "success",
          message: "Bordero extornado com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);

        return createToast({
          status: "error",
          message: "Houve um erro interno ao estornar o bordero selecionado #err",
        });
      });
  }, [revertData, bordero]);

  return (
    <Container className="uk-padding-small">
      <h3 className="uk-margin-remove">Detalhes bordero</h3>
      <header className="uk-flex uk-margin-small-top" style={{ gap: "5px" }}>
        <div>
          <label>Data Borderô</label>
          <Input
            disabled
            value={moment(bordero?.bordero_date).format("DD/MM/YYYY")}
          />
        </div>
        <div>
          <label>Data competência</label>
          <Input
            disabled
            value={
              bordero?.competence_date
                ? moment(bordero?.competence_date).format("DD/MM/YYYY")
                : "-"
            }
          />
        </div>
        <div>
          <label>Documento</label>
          <Input disabled value={bordero?.document} />
        </div>
        <div>
          <label>Valor Borderô</label>
          <Input disabled value={currencyFormatter(bordero?.bordero_value)} />
        </div>
        <div>
          <label>Valor juros</label>
          <Input disabled value={currencyFormatter(bordero?.interest_value)} />
        </div>
        <div>
          <label>Valor desconto</label>
          <Input disabled value={currencyFormatter(bordero?.discount_value)} />
        </div>
        <div>
          <label>Valor Total bordero</label>
          <Input disabled value={currencyFormatter(bordero?.total_value)} />
        </div>
        <div>
          <label>Status</label>
          <Input disabled value={bordero?.status} />
        </div>
        <div>
          <label>Tipo</label>
          <Input disabled value={bordero?.type} />
        </div>
      </header>
      <hr />
      <Table columns={columns} dataSource={formattedTitles} />
      <footer className="uk-flex uk-flex-right" style={{ gap: "10px" }}>
        {bordero?.status === "Aberto" && (
          <Button onClick={closeBordero} text="Fechar borderô" />
        )}
        {bordero?.status === "Fechado" && (
          <Button onClick={reopenBordero} text="Reabrir borderô" />
        )}
        {bordero?.status === "Fechado" && (
          <Button
            onClick={() => setDownModalVisible(true)}
            text="Baixar borderô"
          />
        )}
        {bordero?.status === "Baixado" && (
          <Button
            onClick={() => setRevertModalVisible(true)}
            text="Extornar borderô"
          />
        )}
      </footer>
      <hr />
      <footer className="uk-flex uk-flex-right">
        <Button onClick={() => setVisible(false)} text="Fechar" />
      </footer>
      <Modal
        title={`Baixar Borderô - ${bordero?.document}`}
        visible={downModalVisible}
        footer={null}
        onCancel={() => setDownModalVisible(false)}
      >
        <FormChild
          data={downData}
          setData={setDownData}
          submit={submitDownBordero}
          setVisible={setDownModalVisible}
          type="down"
          paymentType={
            router.query.page === "titulos-pagar" ? "DEBITO" : "CREDITO"
          }
        />
      </Modal>
      <Modal
        title="Estornar Borderô"
        visible={revertModalVisible}
        footer={null}
        onCancel={() => setRevertModalVisible(false)}
      >
        <FormChild
          data={revertData}
          setData={setRevertData}
          submit={submitRevertBordero}
          setVisible={setRevertModalVisible}
          type="revert"
        />
      </Modal>
    </Container>
  );
});

export default BorderoDetails;
