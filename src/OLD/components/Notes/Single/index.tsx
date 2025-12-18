// @ts-nocheck
import { useState, useEffect } from "react";

import { receiptService } from "@/OLD/services/receipt.service.ts";

import { fiscalDocumentService } from "@/OLD/services/fiscal-document.service.ts";

import { useMutation, useQuery } from "infinity-forge";
import { useQueryClient } from "infinity-forge";
import {
  useReceipt,
  useReceiptsFiscalDocuments,
} from "@/OLD/hooks/useReceipts.ts";
import { useProfile } from "@/OLD/hooks/useProfile.ts";
import { useUserHasPermission } from "@/OLD/hooks/useProfile.ts";

import { Button, Tooltip, useToast } from "infinity-forge";
import PaymentsPanel from "@/OLD/components/Notes/PaymentsPanel";
import { Input, Table, Popconfirm, Modal, Typography } from "antd";
const { TextArea } = Input;

import { FiTrash2, FiRefreshCw } from "react-icons/fi";
import { MdOutlineCancel, MdOutlineSyncDisabled } from "react-icons/md";
import { TbAlertTriangle } from "react-icons/tb";
import { RiPrinterCloudLine } from "react-icons/ri";

import moment from "moment";
import {
  detailsProductColumns,
  productFiscalDocumentsColumns,
} from "../columns";
import { currencyFormatter } from "@/OLD/components/Budget";

export function Details({ receiptId, setVisible }: any) {
  const [ids, setIds] = useState({});
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reload, setReload] = useState(false);
  const [fiscalDocumentsFilters, setFiscalDocumentsFilters] = useState({});
  const [formattedFiscalDocuments, setFormattedFiscalDocuments] = useState([]);
  const [openCancelNfe, setOpenCancelNfe] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [documentsToIssue, setDocumentsToIssue] = useState([]);
  const [cancelNfeData, setCancelNfeData] = useState({});
  const [openDisableNfe, setOpenDisableNfe] = useState(false);
  const [disableNfeData, setDisableNfeData] = useState({});
  const [nfeErrorsVisible, setNfeErrorsVisible] = useState(false);
  const [nfeErrors, setNfeErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const { receipt } = useReceipt(ids, reload);
  const { clinic } = useProfile();
  const { fiscalDocuments, loadingFiscalDocuments } =
    useReceiptsFiscalDocuments(fiscalDocumentsFilters);

  const emitFiscalNotePermission = useUserHasPermission("VEN08");
  const cancelFNPermission = useUserHasPermission("VEN09");
  const disableFNPermission = useUserHasPermission("VEN10");

  const { createToast } = useToast();

  const queryClient = useQueryClient();

  const removeReceiptItemSubmit = (id) => {
    receiptService
      .removeReceiptItem({ itemId: id })
      .then((_res) => {
        setReload((prv) => !prv);

        return createToast({
          status: "success",
          message: "Item removido com sucesso",
        });
      })
      .catch((err) => {
        return createToast({
          status: "error",
          message: "Houve um erro ao remover o item",
        });
      });
  };

  const formatFiscalDocuments = () => {
    setFormattedFiscalDocuments(
      fiscalDocuments?.map((doc) => {
        const validToUpdate =
          Boolean(doc.authorization_date) &&
          !doc.authorization_receipt_date &&
          !doc.cancellation_receipt_date &&
          !doc.disabling_receipt_date;

        const validToCancel =
          Boolean(doc.authorization_receipt) && !doc.cancellation_date;

        const validToDisable =
          Boolean(doc.authorization_date) &&
          !doc.authorization_receipt &&
          !doc.cancellation_receipt;

        const validToPrint = Boolean(doc.authorization_pdf_path);
        return {
          model: doc?.model,
          serie: doc?.series,
          numberNfe: doc?.sequence,
          accessKey: doc?.access_key,
          recibo: doc?.authorization_receipt,
          status: doc?.active ? "Ativa" : "Inativa",
          reciboCancelamento: doc?.cancellation_receipt,
          cancellationDate: doc?.cancellationDate
            ? moment(doc?.cancellationDate)
            : "-",
          actions: (
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {cancelFNPermission && (
                <Tooltip
                  idTooltip="cancelar"
                  enableHover
                  content={"Cancelar nota fiscal"}
                  trigger={
                    <MdOutlineCancel
                      opacity={validToCancel ? 1 : 0.5}
                      onClick={() => {
                        if (!validToCancel) return;

                        setOpenCancelNfe(true);
                        setCancelNfeData({
                          issuedDocumentId: doc.id,
                          reason: "",
                        });
                      }}
                      size={25}
                      className="icon"
                      cursor={"pointer"}
                    />
                  }
                />
              )}

              {disableFNPermission && (
                <Tooltip
                  idTooltip="Inutilizar"
                  enableHover
                  content={"Inutilizar nota fiscal"}
                  trigger={
                    <MdOutlineSyncDisabled
                      opacity={validToDisable ? 1 : 0.5}
                      onClick={() => {
                        if (!validToDisable) return;

                        setOpenDisableNfe(true);
                        setDisableNfeData({
                          issuedDocumentId: doc.id,
                          reason: "",
                        });
                      }}
                      size={25}
                      className="icon"
                      cursor={"pointer"}
                    />
                  }
                />
              )}
              <Tooltip
                idTooltip="Atualizar"
                enableHover
                content={"Atualizar dados da nota fiscal"}
                trigger={
                  <FiRefreshCw
                    opacity={validToUpdate ? 1 : 0.5}
                    onClick={() => {
                      if (!validToUpdate) return;

                      updateNfeMutation.mutate(doc.id);
                    }}
                    size={25}
                    className="icon"
                    cursor={"pointer"}
                  />
                }
              />

              {doc?.corrections.length > 0 ? (
                <Tooltip
                  idTooltip="Visualizar"
                  enableHover
                  content={"Visualizar mensagem de erro"}
                  trigger={
                    <TbAlertTriangle
                      size={20}
                      color="var(--red)"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setNfeErrorsVisible(true);
                        return setNfeErrors(doc?.corrections);
                      }}
                    />
                  }
                />
              ) : (
                <Tooltip
                  idTooltip="Imprimir"
                  enableHover
                  content={"Imprimir DANFE"}
                  trigger={
                    <RiPrinterCloudLine
                      opacity={validToPrint ? 1 : 0.5}
                      onClick={() => {
                        if (!validToPrint) {
                          return;
                        }

                        window.open(doc.authorization_pdf_path, "_blank");
                      }}
                      size={25}
                      className="icon"
                      cursor={"pointer"}
                    />
                  }
                />
              )}
            </div>
          ),
        };
      })
    );
  };

  const formatProducts = () => {
    setProducts(
      receipt[0]?.items?.map((product) => ({
        quantity: product?.quantity,
        fractionValue: product.fraction_value ? product.fraction_value : product.status === 'PendenteXml' ? '-' : product.fraction_value,
        productCode: product?.productVariation?.product?.reference_code,
        description: !product.productVariation ? `[NÃO RELACIONADO] ${product?.description_xml ?? '-'}` : product?.productVariation?.product?.description,
        unitPrice: currencyFormatter(product?.unitary_value),
        discount: currencyFormatter(product?.discount_value),
        total: currencyFormatter(product?.total_value),
        delete: receipt[0]?.status !== 'Baixada' && (
          <Popconfirm
            title={`Deseja remover este item?`}
            onConfirm={() => removeReceiptItemSubmit(product?.id)}
          >
            <FiTrash2
              style={{ cursor: "pointer", fontSize: "1.2rem", color: "red" }}
            />
          </Popconfirm>
        ),
      }))
    );
  };

  const updateNfeMutation = useMutation({
    queryKey: ["updateNfeMutation"],
    queryFn: async (_id) => {
      await fiscalDocumentService.updateIssuedNfe({
        id: _id,
      });
    },
    onSuccess: () => {
      getIssuedNfeQuery.refetch();
    },
  });

  const cancelNfseMutation = useMutation({
    queryKey: ["cancelNfseMutation"],
    queryFn: async (data) => {
      await fiscalDocumentService.cancelIssuedNfse({
        data,
      });
    },
    onSuccess: () => {
      getIssuedNfseQuery.refetch();
      setOpenCancelNfse(false);
      setCancelNfseData({});
    },
  });

  const cancelNfeMutation = useMutation({
    queryKey: ["cancelNfeMutation"],
    queryFn: async (data) => {
      await fiscalDocumentService.cancelIssuedNfe({
        data,
      });
    },
    onSuccess: () => {
      getIssuedNfeQuery.refetch();
      setOpenCancelNfe(false);
      setCancelNfeData({});
    },
  });

  const authorizeNfse = useMutation({
    queryKey: ["authorizeNfse"],
    queryFn: () => {
      const findServiceDocument = getFiscalDocumentsQuery?.data?.find(
        (item) => item?.document_type === "SERVICOS"
      );
      if (!findServiceDocument) {
        throw new Error(
          "Não foi possível encontrar o documento fiscal de serviços"
        );
      }

      const selected = documentsToIssue?.find(
        (item) => item === findServiceDocument?.id
      );
      if (!selected) {
        throw new Error(
          "Não foi possível encontrar o documento fiscal de serviços"
        );
      }
      setLoading(true);
      return fiscalDocumentService.authorizeNfse({
        billId: data?.id,
        unitFiscalDocumentId: selected,
      });
    },
    onSuccess: () => {
      setLoading(false);

      createToast({ status: "success", message: "Nota emitida com sucesso" });
      setOpenModal(false);
      queryClient.invalidateQueries(["bills"]);
    },
    onError: (err) => {
      setLoading(false);

      createToast({
        status: "error",
        message: err.message ?? "Erro na emissão",
      });
    },
  });

  const disableNfeMutation = useMutation({
    queryKey: ["disableNfeMutation"],
    queryFn: async (data) => {
      await fiscalDocumentService.disableIssuedNfe({
        data,
      });
    },
    onSuccess: () => {
      getIssuedNfeQuery.refetch();
      setOpenDisableNfe(false);
      setDisableNfeData({});
    },
  });

  useEffect(() => {
    setIds({ ids: [receiptId] });
  }, [receiptId]);

  useEffect(() => {
    receipt?.length > 0 && formatProducts();
  }, [receipt]);

  useEffect(() => {
    fiscalDocuments?.length > 0
      ? formatFiscalDocuments()
      : setFormattedFiscalDocuments([]);
  }, [fiscalDocuments]);

  useEffect(() => {
    setFiscalDocumentsFilters({
      type: "ENTRADA",
      unit: clinic?.id,
      bill: receiptId,
    });
  }, [clinic, receiptId]);

  return (
    <div>
      {/*
      <h3 className="uk-margin-remove">Nota de entrada - detalhes</h3>
      */}
      <section className="uk-flex uk-margin-small-top" style={{ gap: "10px" }}>
        <div>
          <label>Data de lançamento</label>
          <Input
            disabled
            value={moment(receipt[0]?.created_at)?.format("DD/MM/YYYY - HH:mm")}
          />
        </div>
        <div>
          <label>Código</label>
          <Input disabled value={receipt[0]?.tag} />
        </div>
        <div>
          <label>Fornecedor</label>
          <Input disabled value={receipt[0]?.supplier?.name} />
        </div>
      </section>
      <section className="uk-margin-small-top">
        <h3 className="uk-heading-line">
          <span>Produtos</span>
        </h3>
        <Table dataSource={products} columns={detailsProductColumns} />
      </section>
      <section className="uk-margin-small-top">
        <h3 className="uk-heading-line">
          <span>Pagamentos</span>
        </h3>
        <PaymentsPanel
          payments={receipt[0]?.payments}
          reload={reload}
          setReload={setReload}
          receipt={receipt[0]}
          origin="details"
        />
      </section>
      <section className="uk-margin-small-top">
        <h3 className="uk-heading-line">
          <span>Observações</span>
        </h3>
        <TextArea readOnly />
      </section>
      <section className="uk-margin-small-top">
        <h3 className="uk-heading-line">
          <span>
            Documentos fiscais <Button text="Emitir nota fiscal" />
          </span>
        </h3>
        <Table
          columns={productFiscalDocumentsColumns}
          dataSource={formattedFiscalDocuments}
        />
      </section>
      <Modal
        title="Emissão de Nota Fiscal"
        visible={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        width={600}
      >
        <Typography.Title level={4} style={{ textAlign: "center" }}>
          Selecione os documentos Fiscais a serem impressos
        </Typography.Title>

        {loadingFiscalDocuments.isLoading && <Skeleton />}

        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (hasServices) {
              authorizeNfse.mutate();
            }

            if (hasProductToIssue) {
              authorizeNfeMutation.mutate();
            }
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "2rem",
            gap: "2rem",
          }}
        >
          {fiscalDocuments.data?.map((item) => (
            <div
              key={item?.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "2rem",
                cursor: "pointer",
                width: "250px",
              }}
            >
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    setDocumentsToIssue([...documentsToIssue, item?.id]);
                  } else {
                    setDocumentsToIssue(
                      documentsToIssue.filter((i) => i !== item?.id)
                    );
                  }
                }}
                checked={documentsToIssue.includes(item?.id)}
              ></Checkbox>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  width: "200px",
                }}
                onClick={() => {
                  if (documentsToIssue.includes(item?.id)) {
                    setDocumentsToIssue(
                      documentsToIssue.filter((i) => i !== item?.id)
                    );
                  } else {
                    setDocumentsToIssue([...documentsToIssue, item?.id]);
                  }
                }}
              >
                <Typography.Text>{item?.description}</Typography.Text>
                <Image
                  src={`/icons/${item.fiscalDocument.image_name}`}
                  width={100}
                  height={100}
                />
              </div>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            <Button onClick={() => setOpenModal(false)} text="Cancelar" />

            <Button
              text="Emitir"
              type="submit"
              disabled={documentsToIssue.length === 0}
              loading={loading}
            />
          </div>
        </form>
      </Modal>
      <Modal

        visible={openCancelNfe}
        onCancel={() => {
          setOpenCancelNfe(false);
          setCancelNfeData({});
        }}
        footer={null}
        width={500}
      >
        <h3 className="font-18-bold">Cancelamento de Nota Fiscal de Produto</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (!cancelNfeData?.reason) {
              return createToast({
                status: "error",
                message: "Informe o motivo do cancelamento",
              });
            }

            cancelNfeMutation.mutate(cancelNfeData);
          }}
        >
          <div>
            <label>Motivo</label>
            <Input
              onChange={(e) =>
                setCancelNfeData({ ...cancelNfeData, reason: e.target.value })
              }
              value={cancelNfeData?.reason}
              required
              minLength={10}
            />
          </div>

          <div className="uk-margin-top uk-flex uk-flex-between">
            <Button
              onClick={() => {
                setOpenCancelNfe(false);
                setCancelNfeData({});
              }}
              text="Cancelar"
            />

            <Button type="submit" text="Concluir" text="Concluir" />
          </div>
        </form>
      </Modal>

      <Modal
        visible={openDisableNfe}
        onCancel={() => {
          setOpenDisableNfe(false);
          setDisableNfeData({});
        }}
        footer={null}
        width={500}
      >
        <h3 className="font-18-bold">Motivo inutilização</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!disableNfeData?.reason) {
              return createToast({
                status: "error",
                message: "Informe o motivo da inutilização",
              });
            }

            disableNfeMutation.mutate(disableNfeData);
          }}
        >
          <div>
            <label>Motivo</label>
            <Input
              onChange={(e) =>
                setDisableNfeData({ ...disableNfeData, reason: e.target.value })
              }
              value={disableNfeData?.reason}
              required
              minLength={10}
            />
          </div>

          <div className="uk-margin-top uk-flex uk-flex-between">
            <Button
              onClick={() => {
                setOpenCancelNfe(false);
                setDisableNfeData({});
              }}
              text="Cancelar"
            />

            <Button type="submit" text="Concluir" />
          </div>
        </form>
      </Modal>
      <Modal
        title="Erros apresentados na nfe"
        visible={nfeErrorsVisible}
        onCancel={() => setNfeErrorsVisible(false)}
        footer={null}
      >
        <div className="uk-flex uk-flex-between">
          <div className="uk-width-1-5">Código</div>
          <div className="uk-width-4-5">Erro</div>
        </div>
        {nfeErrors?.map((err) => (
          <div className="uk-flex uk-flex-between">
            <div className="uk-width-1-5">{err?.cod || "-"}</div>
            <div className="uk-width-4-5">{err?.mensagem || "-"}</div>
          </div>
        ))}
      </Modal>
    </div>
  );
}

export default Details;
