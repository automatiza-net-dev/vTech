// @ts-nocheck
import { useEffect, useState, useCallback } from "react";

import { receiptService } from "@/OLD/services/receipt.service";

import { useReceipts } from "@/OLD/hooks/useReceipts";
import { useRouter } from "next/router";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Container } from "./styles";
import { Button, PageWrapper } from "infinity-forge";
import Create from "./Actions/Create";
import Filters from "./Filters";
import AddOrRemoveItem from "./Actions/AddOrRemoveItem";
import { Modal, Table, Upload, notification, Popconfirm } from "antd";
import AccessDenied from "@/OLD/components/AccessDenied";
import Details from "./Single";

import moment from "moment";
import { receiptsColumns } from "./columns";
import { currencyFormatter } from "@/OLD/components/Budget";

import { DeleteTwoTone } from "@ant-design/icons";
import { CgDetailsMore } from "react-icons/cg";
import { MdOutlineChecklist } from "react-icons/md";
import { FiLock, FiUnlock } from "react-icons/fi";
import { MdMonetizationOn } from "react-icons/md";
import AddPaymentsScreen from "./AddPayments/AddPaymentsScreen";

export function Notes() {
  const [createVisible, setCreateVisible] = useState(false);
  const [reload, setReload] = useState(false);
  const [filters, setFilters] = useState({
    noSearch: true,
    from: moment(),
    to: moment(),
  });
  const [formattedReceipts, setFormattedReceipts] = useState([]);
  const [xmlModalVisible, setXmlModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [xml, setXml] = useState(false);
  const [selectedId, setSelectedId] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [addPaymentsScreenVisible, setAddPaymentsScreenVisible] =
    useState(false);

  const { receipts } = useReceipts(filters, reload);

  const router = useRouter();
  const listReceiptsPermission = useUserHasPermission("ENT00");
  const createReceiptPermission = useUserHasPermission("ENT01");
  const addPaymentsPermission = useUserHasPermission("ENT04");
  const reopenReceiptPermission = useUserHasPermission("ENT08");
  const removeReceiptPermission = useUserHasPermission("ENT09");
  const importXmlPermission = useUserHasPermission("ENT10");
  const pendingProductsPermission = useUserHasPermission("ENT11");

  const formatReceipts = () => {
    receipts?.length > 0
      ? setFormattedReceipts(
          receipts?.map((receipt) => ({
            date: moment(receipt?.receiptDate).format("DD/MM/YYYY"),
            tag: receipt?.tag,
            user: receipt?.seller?.name,
            supplier: receipt?.supplier?.name,
            value: currencyFormatter(receipt?.totalValue),
            status: receipt?.status,
            origin: receipt?.origin || "-",
            actions: (
              <div className="uk-flex uk-flex-around">
                {receipt?.origin !== "Xml" && receipt?.status !== "Baixada" && (
                  <AddOrRemoveItem
                    id={receipt?.id}
                    setReload={setReload}
                    reload={reload}
                  />
                )}
                {/* TODO CHAMAR MODAL EM TESE PARA ELIMINAR PAGINA... */}
                {receipt?.status === "PendenteXml" && (
                    <MdOutlineChecklist
                      size={20}
                      className="custom-icon"
                      onClick={() =>
                        router.push(
                          `/dashboard/notas-entrada/xml/${receipt?.id}`
                        )
                      }
                    />
                )}
                {receipt?.status !== "Baixada" && addPaymentsPermission && (
                    <MdMonetizationOn
                      className="custom-icon"
                      onClick={() => {
                        setSelectedId(receipt?.id);
                        setAddPaymentsScreenVisible(true);
                      }}
                    />
                )}
                {receipt?.status !== "Baixada" && (
                    <FiLock onClick={() => finishReceipt(receipt?.id)} />
                )}
                  <CgDetailsMore
                    className="custom-icon"
                    onClick={() => {
                      setDetailsVisible(true);
                      setSelectedId(receipt?.id);
                      {
                        /*
                      router.push(
                        `/dashboard/notas-entrada/detalhes/${receipt?.id}`
                        );
                      */
                      }
                    }}
                  />
                {receipt?.status === "Baixada" && (
                  <>
                    {reopenReceiptPermission && (
                        <FiUnlock onClick={() => reopenReceipt(receipt?.id)} />
                    )}
                  </>
                )}
                {removeReceiptPermission && (
                    <Popconfirm
                      title="Deseja remover esta nota de entrada?"
                      onConfirm={() =>
                        notification.warning({ message: "Verificar método" })
                      }
                    >
                      <DeleteTwoTone twoToneColor={"red"} />
                    </Popconfirm>
                )}
              </div>
            ),
          }))
        )
      : setFormattedReceipts([]);
  };

  useEffect(() => {
    formatReceipts();
  }, [receipts]);

  const verifyFile = (info) => {
    if (info?.file?.type !== "text/xml") {
      return notification.warning({
        message: "Apenas arquivos Xml são permitidos",
      });
    }
    setXml(info?.file?.originFileObj);
  };

  const submitXml = useCallback(() => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", xml);
    receiptService
      .importXml(formData)
      .then((res) => {
        router.push(`/dashboard/notas-entrada/xml/${res.data?.id}`);
      })
      .catch((err) => {
        setLoading(false);
        return verifyErrors(err?.response?.data?.code);
      });
  }, [xml]);

  const verifyErrors = (str) => {
    if (str === "E_NO_IDS") {
      return notification.error({ message: "Nenhum id informado" });
    }

    if (str === "E_INVALID_FILE") {
      return notification.error({ message: "Arquivo inválido" });
    }

    if (str === "E_IMPORTED") {
      return notification.error({ message: "Arquivo já importado" });
    }

    if (str === "E_INVALID_DOC") {
      return notification.error({
        message: "CNPJ não pertence a nenhuma unidade",
      });
    }

    if (str === "E_NO_DL") {
      return notification.error({
        message: "É necessário um movimento diário para importação",
      });
    }

    if (str === "E_NO_VARIATION") {
      return notification.error({
        message: "Não foi possível encontrar um preço para o produto",
      });
    }

    if (str === "E_INTERNAL") {
      return notification.error({
        message: "Não foi possível ler o arquivo",
      });
    }

    if (str === "E_NOT_FOUND") {
      return notification.error({
        message: "Não foi possível encontrar um preço para o produto",
      });
    }
  };

  const finishReceipt = (id) => {
    receiptService
      .finishReceipt({ receiptId: id })
      .then((res) => {
        setReload((prv) => !prv);
        return notification.success({
          message: "Nota de entrada finalizada com sucesso",
        });
      })
      .catch((err) => {
        if (err?.response?.data?.code === "E_NO_VARIATION") {
          return notification.error({
            message:
              "Existem produtos da nota que ainda não foram relacionados",
          });
        } else {
          return notification.error({
            message: err?.response?.data?.message?.split(":")[1],
          });
        }
      });
  };

  const reopenReceipt = (id) => {
    receiptService
      .reopenReceipt({ receiptId: id })
      .then((_res) => {
        setReload((prv) => !prv);
        return notification.success({
          message: "Nota de entrada reaberta com sucesso!",
        });
      })
      .catch((err) => {
        return notification.error({
          message: "Houve um erro ao reabrir a nota",
        });
      });
  };

  const listCreated = (id) => {
    setFilters((prv) => ({ ...prv, receipt_id: id, noSearch: false }));
    setReload((prv) => !prv);
  };

  return !listReceiptsPermission || listReceiptsPermission === "loading" ? (
    <AccessDenied loading={listReceiptsPermission} />
  ) : (
    <PageWrapper title="Notas de Entrada">
      <Container>
        <section
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          {pendingProductsPermission && (
            <Button
              onClick={() => router.push("/dashboard/produtos-pendentes")}
              text="Produtos pendentes"
            />
          )}
          {importXmlPermission && (
            <Button
              text="Importar XML"
              onClick={() => setXmlModalVisible(true)}
            />
          )}
          {createReceiptPermission && (
            <Button
              onClick={() => setCreateVisible(true)}
              text="Nova nota de entrada"
            />
          )}
        </section>
        <Filters
          filters={filters}
          setFilters={setFilters}
          setReload={setReload}
        />
        <hr />
        <Table columns={receiptsColumns} dataSource={formattedReceipts} />
        <Modal
          onCancel={() => setCreateVisible(false)}
          width={1000}
          footer={null}
          title="Nova nota de entrada"
          visible={createVisible}
        >
          <Create
            setReload={setReload}
            setVisible={setCreateVisible}
            listCreated={listCreated}
          />
        </Modal>
        <Modal
          title="Importar XML"
          visible={xmlModalVisible}
          onCancel={() => setXmlModalVisible(false)}
          footer={null}
        >
          <div className="uk-flex uk-flex-column uk-flex-middle">
            <label>Selecione o arquivo XML a ser importado</label>
            <br />
            <Upload
              multiple={false}
              value={xml}
              name="xml-file"
              onChange={verifyFile}
              showUploadList={false}
            >
              <Button text="Selecionar" />
            </Upload>
            {xml && (
              <div className="uk-margin-small-top">
                <span className="uk-link">{xml?.name}</span>

                <DeleteTwoTone
                  twoToneColor={"red"}
                  onClick={() => setXml(false)}
                />
              </div>
            )}
          </div>
          <hr />
          <footer
            style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <Button
              text="Cancelar"
              onClick={() => {
                setXmlModalVisible(false);
                setXml(false);
              }}
            />

            <Button onClick={submitXml} loading={loading} text="Continuar" />
          </footer>
        </Modal>
        <Modal
          title="Detalhes da nota"
          width={1200}
          footer={null}
          visible={detailsVisible}
          onCancel={() => setDetailsVisible(false)}
        >
          <Details receiptId={selectedId} setVisible={setDetailsVisible} />
        </Modal>
        {addPaymentsScreenVisible && (
          <Modal
            footer={null}
            title="Adicionar pagamento"
            width={1200}
            onCancel={() => setAddPaymentsScreenVisible(false)}
            visible={addPaymentsScreenVisible}
          >
            <AddPaymentsScreen
              id={selectedId}
              setVisible={setAddPaymentsScreenVisible}
            />
          </Modal>
        )}
      </Container>
    </PageWrapper>
  );
}
