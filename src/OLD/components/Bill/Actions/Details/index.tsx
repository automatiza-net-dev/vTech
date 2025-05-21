//@ts-nocheck
import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "infinity-forge";

import { billService } from "@/OLD/services/bills.service";

import { useShowBill } from "@/OLD/hooks/useBills";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import ReactToPrint, { useReactToPrint } from "react-to-print";
import {
  productFiscalDocumentsColumns,
  productsColumns,
  serviceFiscalDocumentsColumns,
} from "./Columns";

import { DeleteTwoTone } from "@ant-design/icons";
import { Checkbox, Input, Popconfirm, Skeleton, Table, Typography } from "antd";

import Header from "./Header";
import PrintScreen from "./PrintScreen";
import ProductsPanel from "./ProductsPanel";
import { Container } from "./styles";

import { currencyFormatter } from "@/OLD/components/Budget";
import Image from "next/image";
import { FiRefreshCw } from "react-icons/fi";
import { MdOutlineCancel, MdOutlineSyncDisabled } from "react-icons/md";
import { TbAlertTriangle } from "react-icons/tb";
import { RiPrinterCloudLine } from "react-icons/ri";
import { fiscalDocumentService } from "../../../../../OLD/services/fiscal-document.service";
import moment from "moment";
import { Icon, Button, useToast, api, Modal } from "infinity-forge";
import { CheckIcon, CloseIcon } from "./icons";
import { AuthorizationStatusProduct } from "@/presentation";
import { AxiosError } from "axios";

export default function Details({ billId, setVisible }: any) {
  const [formatedProducts, setFormatedProducts] = useState<any>([]);
  const [higherBlock, setHigherBlock] = useState<any>(0);
  const blockArr = Array.from(Array(higherBlock).keys());
  const [openModal, setOpenModal] = useState<any>(false);

  const { createToast } = useToast();

  const [openCancelNfse, setOpenCancelNfse] = useState<any>(false);
  const [cancelNfseData, setCancelNfseData] = useState<any>({});

  const [openCancelNfe, setOpenCancelNfe] = useState<any>(false);
  const [cancelNfeData, setCancelNfeData] = useState<any>({});

  const [openDisableNfe, setOpenDisableNfe] = useState<any>(false);
  const [disableNfeData, setDisableNfeData] = useState<any>({});

  const [documentsToIssue, setDocumentsToIssue] = useState<any>([]);
  const [nfeErrorsVisible, setNfeErrorsVisible] = useState<any>(false);
  const [reload, setReload] = useState<any>(false);

  const [nfeErrors, setNfeErrors] = useState<any>([]);
  const [authorizeData, setAuthorizeData] = useState<any>({
    type: "SAIDA",
    billId: null,
  });

  const [changeFields, setChangeFields] = useState<any>({});
  const [seller, setSeller] = useState<any>({});
  const [finResponsible, setFinResponsible] = useState<any>({});
  const [loading, setLoading] = useState<any>(false);

  const queryClient = useQueryClient();
  const emitFiscalNotePermission = useUserHasPermission("VEN08");
  const cancelFNPermission = useUserHasPermission("VEN09");
  const disableFNPermission = useUserHasPermission("VEN10");

  const { data } = useShowBill(billId, true);

  useEffect(() => {
    const _id = data?.id;
    if (_id) {
      setAuthorizeData({
        ...authorizeData,
        billId: _id,
      });
    }
  }, [data?.id]);

  const hasProducts = useMemo(() => {
    if (data?.items?.length === 0) {
      return false;
    }

    return data?.items?.some(
      (item) => item.productVariation?.product?.type === "product"
    );
  }, [data]);

  const hasServices = useMemo(() => {
    if (data?.items?.length === 0) {
      return false;
    }
    return data?.items?.some(
      (item) =>
        item.productVariation?.product?.type === "service" && !item.nfe_issued
    );
  }, [data]);

  const tokens = useMemo(() => {
    if (!hasProducts && !hasServices) {
      return "";
    }

    return [hasProducts && "produtos", hasServices && "servicos"]
      .filter(Boolean)
      .join(",")
      .toUpperCase();
  }, [hasProducts, hasServices]);

  const getFiscalDocumentsQuery = useQuery({
    queryKey: ["fiscalDocuments", tokens],
    queryFn: () =>
      fiscalDocumentService.getAllUnitFiscalDocuments({
        document: tokens,
        movement: "SAIDA,AMBOS",
      }),
    enabled: !!tokens && (hasProducts || hasServices) && openModal,
    onSuccess: (data) => {
      const _hasProduct = data?.find(
        (item) => item?.document_type === "PRODUTOS"
      );

      if (_hasProduct) {
        setAuthorizeData({
          ...authorizeData,
          unitFiscalDocumentId: _hasProduct.id,
        });
      }
    },
  });

  const getIssuedNfseQuery = useQuery({
    queryKey: ["fiscalDocuments", "nfse", data?.id],
    queryFn: () =>
      fiscalDocumentService.getIssuedNfse({
        bill: data?.id,
      }),
    enabled: !!data,
  });

  const getIssuedNfeQuery = useQuery({
    queryKey: ["fiscalDocuments", "nfe", data?.id],
    queryFn: () =>
      fiscalDocumentService.getIssuedNfe({
        bill: data?.id,
        enabled: !!data,
      }),
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
      createToast({ message: "Nota emitida com sucesso", status: "success" });

      setOpenModal(false);
      queryClient.invalidateQueries(["bills"]);
      queryClient.invalidateQueries(["fiscalDocuments"]);
    },
    onError: (err: any) => {
      setLoading(false);
      createToast({
        message: err?.response?.data?.[0]?.message ?? "Erro na emissão",
        status: "error",
      });
    },
  });

  const updateNfseMutation = useMutation({
    queryKey: ["updateNfseMutation"],
    queryFn: async (_id) => {
      await fiscalDocumentService.updateIssuedNfse({
        id: _id,
      });
    },
    onSuccess: () => {
      getIssuedNfseQuery.refetch();
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
    onError: (err: any) => {
      createToast({
        message: err?.response?.data?.message || "Erro na emissão",
        status: "error",
      });
    },
  });

  const authorizeNfeMutation = useMutation({
    queryKey: ["authorizeNfeMutation"],
    queryFn: async () => {
      const productDocs = getFiscalDocumentsQuery?.data?.filter(
        (item) => item?.document_type === "PRODUTOS"
      );
      const productSelected = productDocs.filter((item) =>
        documentsToIssue.includes(item.id)
      );
      setLoading(true);
      const tasks = productSelected.map((item) =>
        fiscalDocumentService.authorizeNfe({
          type: authorizeData.type,
          billId: authorizeData.billId,
          unitFiscalDocumentId: item?.id,
        })
      );
      await Promise.all(tasks);
    },
    onSuccess: () => {
      setLoading(false);
      setOpenModal(false);
      queryClient.invalidateQueries(["bills"]);
      queryClient.invalidateQueries(["fiscalDocuments"]);
    },
    onError: (err: any) => {
      setLoading(false);

      createToast({
        message: err?.response?.data?.message || "Erro na emissão",
        status: "error",
      });
    },
  });

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
    onError: (err: any) => {
      createToast({
        message: err?.response?.data?.message ?? "Erro na emissão",
        status: "error",
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
    onError: (err: any) => {
      createToast({
        message: err?.response?.data?.message?.split(":")?.[1],
        status: "error",
      });
    },
  });

  function FormatProductCanceled({ text, item }: { text: string; item: any }) {
    if (!item) {
      return text;
    }
    return (
      <>
        {text} {item?.reviewerCancelUser?.name || "-"} em <br />
        {item?.reviewCancelDate &&
          moment(item?.reviewCancelDate).format("DD/MM/YYYY HH:mm")}{" "}
        <br />
        {item?.reviewCancelNotes && (
          <p className="font-14-regular">{item?.reviewCancelNotes}</p>
        )}
      </>
    );
  }

  const formatProducts = () => {
    setFormatedProducts(
      data?.items
        ?.map((item) => {
          if (item?.status === "INATIVA") return null;

          console.log(item, "AA");

          return {
            quantity: item?.quantity,
            productCode: item?.productVariation?.product?.reference_code,
            description:
              item?.productVariation?.product?.description +
              (item?.departmentItems && item?.departmentItems.length > 0
                ? " - "
                : "") +
              item?.departmentItems?.map(
                (item) => item.department_item_description
              ),
            unitPrice: currencyFormatter(item?.unitary_value),
            discount: currencyFormatter(item?.discount_value),
            total: currencyFormatter(item?.total_value),
            courtesy: item?.courtesy ? "Sim" : "Não",
            max_discount: item?.max_discount ? "Sim" : "Não",
            auth_data: <AuthorizationStatusProduct item={item} />,
            cancelledStatus: item?.cancelled,
            cancelled: (
              <div className="font-16-regular" style={{ textAlign: "right" }}>
                {item?.cancelled === "P" ? (
                  <FormatProductCanceled text={"Revisão pendente"} />
                ) : item.cancelled === "S" ? (
                  <FormatProductCanceled text={"Aprovado por"} item={item} />
                ) : item.cancelled === "N" ? (
                  <FormatProductCanceled text={"Recusado por"} item={item} />
                ) : (
                  <></>
                )}
              </div>
            ),
            delete: () =>
              data?.status !== "BAIXADA" && (
                <Popconfirm
                  title="Deseja remover este item?"
                  onConfirm={() => removeBillItem(item?.id)}
                >
                  <DeleteTwoTone twoToneColor="red" />
                </Popconfirm>
              ),
          };
        })
        .filter((item) => !!item)
    );
  };

  data?.payments?.map((item) => {
    if (item?.block > higherBlock) {
      setHigherBlock(item?.block);
    }
  });

  const renderErrors = (corrections, status) => {
    if (
      status === "erro_autorizacao" ||
      status === "rejeitado" ||
      corrections.length > 0
    ) {
      return true;
    }
    return false;
  };

  const productIssuedDocuments = useMemo(() => {
    const result = [];

    if (getIssuedNfeQuery.data) {
      getIssuedNfeQuery.data.forEach((item) => {
        const validToUpdate =
          Boolean(item.authorization_date) &&
          !item.authorization_receipt_date &&
          !item.cancellation_receipt_date &&
          !item.disabling_receipt_date;

        const validToCancel =
          Boolean(item.authorization_receipt) && !item.cancellation_date;

        const validToDisable =
          Boolean(item.authorization_date) &&
          !item.authorization_receipt &&
          !item.cancellation_receipt;

        const validToPrint = Boolean(item.authorization_pdf_path);

        result.push({
          id: item.id,
          type: "Produto",
          model: item.model ?? "-",
          serie: item.series ?? "-",
          numberNF: item.sequence ?? "-",
          accessKey: item.access_key ?? "-",
          recibo: item.authorization_receipt ?? "-",
          status: item.sefaz_status ?? "-",
          reciboCancelamento:
            item.sefaz_status === "Cancelado"
              ? item.cancellation_receipt || ""
              : item.disabling_receipt || "",
          cancelamentDate:
            item.sefaz_status === "Cancelado"
              ? item.cancellation_receipt_date || "-"
              : item.disabling_receipt_date || "",
          actions: (
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {cancelFNPermission && (
                <MdOutlineCancel
                  opacity={validToCancel ? 1 : 0.5}
                  onClick={() => {
                    if (!validToCancel) return;

                    setOpenCancelNfe(true);
                    setCancelNfeData({
                      issuedDocumentId: item.id,
                      reason: "",
                    });
                  }}
                  size={25}
                  className="icon"
                  cursor={"pointer"}
                />
              )}
              {disableFNPermission && (
                <FiRefreshCw
                  opacity={validToDisable ? 1 : 0.5}
                  onClick={() => {
                    if (!validToDisable) return;

                    setOpenDisableNfe(true);
                    setDisableNfeData({
                      issuedDocumentId: item.id,
                      reason: "",
                    });
                  }}
                  size={25}
                  className="icon"
                  cursor={"pointer"}
                />
              )}
              <MdOutlineSyncDisabled
                opacity={validToUpdate ? 1 : 0.5}
                onClick={() => {
                  if (!validToUpdate) return;

                  updateNfeMutation.mutate(item.id);
                }}
                size={25}
                className="icon"
                cursor={"pointer"}
              />
              {renderErrors(item?.corrections, item?.sefaz_status) && (
                <TbAlertTriangle
                  size={20}
                  color="var(--red)"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setNfeErrorsVisible(true);
                    return setNfeErrors([
                      {
                        cod: item?.sefaz_status_code,
                        mensagem: item?.sefaz_message,
                      },
                    ]);
                  }}
                />
              )}{" "}
              {item?.sefaz_status === "autorizado" && (
                <RiPrinterCloudLine
                  opacity={validToPrint ? 1 : 0.5}
                  onClick={() => {
                    if (!validToPrint) {
                      return;
                    }

                    window.open(item.authorization_pdf_path, "_blank");
                  }}
                  size={25}
                  className="icon"
                  cursor={"pointer"}
                />
              )}
            </div>
          ),
        });
      });
    }

    return result;
  }, [getIssuedNfeQuery?.data, cancelFNPermission]);

  const serviceIssuedDocuments = useMemo(() => {
    const result = [];

    console.log(getIssuedNfseQuery.data);

    if (getIssuedNfseQuery?.data) {
      getIssuedNfseQuery.data.forEach((item) => {
        const validToUpdate =
          Boolean(item.authorization_date) &&
          !item.authorization_receipt &&
          !item.cancellation_receipt_date;
        const validToCancel =
          Boolean(item.authorization_date) &&
          !item.authorization_receipt &&
          !item.cancellation_receipt_date;
        const validToPrint = Boolean(item.authorization_pdf_path);

        result.push({
          id: item.id,
          numberNF: item.sequence ?? "-",
          rps_series: item.rps_series ?? "-",
          rps_number: item.rps_number ?? "-",
          verification_code: item.verification_code ?? "-",
          authorizationDate: item.authorization_date ?? "-",
          cancelamentDate: item.cancellation_date ?? "-",
          status: item.status,
          actions: (
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {cancelFNPermission && (
                <MdOutlineCancel
                  opacity={validToCancel ? 1 : 0.5}
                  onClick={() => {
                    if (!validToCancel) {
                      return;
                    }

                    setCancelNfseData({
                      issuedDocumentId: item.id,
                      reason: "",
                    });
                    setOpenCancelNfse(true);
                  }}
                  size={25}
                  className="icon"
                  cursor={"pointer"}
                />
              )}

              <MdOutlineSyncDisabled
                opacity={validToUpdate ? 1 : 0.5}
                onClick={() => {
                  if (!validToUpdate) {
                    return;
                  }

                  updateNfseMutation.mutate(item.id);
                }}
                size={25}
                className="icon"
                cursor={"pointer"}
              />

              {item?.errors?.length > 0 ? (
                <TbAlertTriangle
                  size={20}
                  color="var(--red)"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setNfeErrorsVisible(true);
                    return setNfeErrors(item?.errors);
                  }}
                />
              ) : (
                <RiPrinterCloudLine
                  opacity={validToPrint ? 1 : 0.5}
                  onClick={() => {
                    if (!validToPrint) {
                      return;
                    }

                    window.open(item.authorization_pdf_path, "_blank");
                  }}
                  size={25}
                  className="icon"
                  cursor={"pointer"}
                />
              )}
            </div>
          ),
        });
      });
    }

    return result;
  }, [getIssuedNfseQuery?.data, cancelFNPermission]);

  useEffect(() => {
    formatProducts();
  }, [data]);

  useEffect(() => {
    if (data?.seller) {
      setSeller({ seller: data?.sellerId, name: data?.seller?.name });
    }

    if (data?.financialResponsible?.name) {
      setFinResponsible({
        name: data?.financialResponsible?.name,
        id: data?.financialResponsible?.id,
      });
    }
  }, [data, changeFields]);

  const componentRef = useRef();

  const hasProductToIssue = useMemo(() => {
    if (documentsToIssue.length === 0) {
      return false;
    }

    const findProductDocument = getFiscalDocumentsQuery?.data?.find(
      (item) => item?.document_type === "PRODUTOS"
    );

    if (!findProductDocument) {
      return false;
    }

    const selected = documentsToIssue?.find(
      (item) => item === findProductDocument?.id
    );

    return !!selected;
  }, [documentsToIssue, getFiscalDocumentsQuery]);

  const removeBillItem = (id) => {
    billService
      .removeBillItem(id)
      .then((_res) =>
        createToast({ message: "Item removido com sucesso", status: "success" })
      )
      .finally(() => {
        queryClient.invalidateQueries(["bills"]);
      });
  };

  const changeBillSeller = useCallback(async () => {
    await api({
      method: "put",
      url: "bills/seller",
      body: {
        billId: data?.id,
        sellerId: seller?.id,
      },
    });

    setChangeFields((prv) => ({ ...prv, seller: false }));
    queryClient.invalidateQueries(["bills"]);

    createToast({
      status: "success",
      message: "Vendedor alterado!",
    });
  }, [data, seller]);

  const changeBillFinancialResponsible = useCallback(() => {
    billService
      .updateFinancialResponsible({
        billId: data?.id,
        financialResponsibleId: finResponsible?.id,
      })
      .then((_res) => {
        setChangeFields((prv) => ({ ...prv, finResponsible: false }));
        queryClient.invalidateQueries(["bills"]);
        createToast({
          message: "Resp. financeiro alterado",
          status: "success",
        });
      })
      .catch((err) => {
        if (!message) {
          return createToast({
            status: "error",
            message: "Houve um erro interno, tente novamente mais tarde",
          });
        }

        if (message?.includes("E_NOT_OPEN")) {
          return createToast({
            status: "warning",
            message: "Nota não está aberta, não é possível alterar o vendedor",
          });
        }

        if (message?.includes("E_ERR")) {
          return createToast({
            status: "warning",
            message: err?.response?.data?.message?.split(":")[1],
          });
        }
      });
  }, [data, finResponsible]);

  useEffect(() => {
    const id = getFiscalDocumentsQuery?.data?.find(
      (item) => item?.document_type === "SERVICOS"
    )?.id;

    if (id) {
      setDocumentsToIssue([...documentsToIssue, id]);
    }
  }, [getFiscalDocumentsQuery?.data?.length]);

  const { TextArea } = Input;

  const imprimir = useReactToPrint({ contentRef: componentRef });

  return (
    <Container className="">
      <Header
        bill={data}
        changeBillSeller={changeBillSeller}
        submitUpdateFinResponsible={changeBillFinancialResponsible}
        setSellerId={setSeller}
        seller={seller}
        setSeller={setSeller}
        setChangeFields={setChangeFields}
        changeFields={changeFields}
        finResponsible={finResponsible}
        setFinResponsible={setFinResponsible}
      />
      <section className="uk-margin-top">
        <h4 className="uk-margin-remove">Produtos - Serviços Ativos</h4>
        <Table
          columns={productsColumns}
          dataSource={formatedProducts?.filter(
            (item) => item.cancelledStatus !== "S"
          )}
        />
      </section>

      {data?.cancelled === "S" && (
        <section className="uk-margin-top">
          <h4 className="uk-margin-remove">Produtos - Serviços Cancelados</h4>
          <Table
            columns={productsColumns}
            dataSource={formatedProducts?.filter(
              (item) => item.cancelledStatus === "S"
            )}
          />
        </section>
      )}
      <section>
        <h4 className="uk-margin-remove">Pagamentos</h4>
        {blockArr?.length > 0 &&
          blockArr?.map((i) => (
            <ProductsPanel
              key={i}
              payments={data?.payments?.filter((item) => item?.block === i + 1)}
              remove={false}
              bill={data}
            />
          ))}
      </section>

      <section className="uk-margin-top">
        <h4 className="uk-margin-remove">Observações</h4>
        <TextArea readOnly value={data?.additional_information} />
      </section>

      <section className="uk-margin-top">
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <h4 className="uk-margin-remove">Documentos Fiscais - Produtos</h4>
          {emitFiscalNotePermission && (
            <Button
              onClick={() => {
                if (data?.status !== "BAIXADA") {
                  createToast({
                    message:
                      "A Venda deve estar finalizada para emissão de documentos fiscais!",
                    status: "warning",
                  });

                  return;
                }
                setOpenModal(true);
              }}
              disabled={openModal}
              text="Emitir nota fiscal"
            />
          )}
        </div>
        <Table
          columns={productFiscalDocumentsColumns}
          className="uk-margin-small-top"
          dataSource={productIssuedDocuments}
        />
      </section>

      <section className="uk-margin-top">
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <h4 className="uk-margin-remove">Documentos Fiscais - Serviços</h4>
        </div>
        <Table
          columns={serviceFiscalDocumentsColumns}
          className="uk-margin-small-top"
          dataSource={serviceIssuedDocuments}
        />
      </section>

      <footer
        style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
      >
        <Button
          onClick={() => setVisible(false)}
          classCallback="uk-margin-right"
          text="Voltar"
        />

        <div style={{ display: "none" }}>
          <div ref={componentRef}>
            <PrintScreen bill={data} />
          </div>
        </div>

        <Button text="Imprimir" onClick={() => imprimir()} />
      </footer>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        styles={{ maxWidth: 600 }}
      >
        <Typography.Title level={4} style={{ textAlign: "center" }}>
          Selecione os documentos Fiscais a serem impressos
        </Typography.Title>

        {getFiscalDocumentsQuery.isLoading && <Skeleton />}

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
          {getFiscalDocumentsQuery.data?.map((item) => (
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
              type="submit"
              disabled={documentsToIssue.length === 0}
              loading={loading}
              text="Emitir"
            />
          </div>
        </form>
      </Modal>

      <Modal
        open={openCancelNfse}
        onClose={() => {
          setOpenCancelNfse(false);
          setCancelNfseData({});
        }}
        styles={{ maxWidth: 500 }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!cancelNfseData?.reason) {
              createToast({
                message: "Informe o motivo do cancelamento",
                status: "error",
              });
              return;
            }

            cancelNfseMutation.mutate(cancelNfseData);
          }}
        >
          <div>
            <label>Motivo</label>
            <Input
              onChange={(e) =>
                setCancelNfseData({ ...cancelNfseData, reason: e.target.value })
              }
              value={cancelNfseData?.reason}
              required
              minLength={10}
            />
          </div>

          <div className="uk-margin-top uk-flex uk-flex-between">
            <Button
              onClick={() => {
                setOpenCancelNfse(false);
                setCancelNfseData({});
              }}
              text="Cancelar"
            />

            <Button type="primary" type="submit" text="Concluir" />
          </div>
        </form>
      </Modal>

      <Modal
        open={openCancelNfe}
        onClose={() => {
          setOpenCancelNfe(false);
          setCancelNfeData({});
        }}
        styles={{ maxWidth: 500 }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (!cancelNfeData?.reason) {
              createToast({
                message: "Informe o motivo do cancelamento",
                status: "error",
              });
              return;
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

            <Button type="submit" text="Concluir" />
          </div>
        </form>
      </Modal>

      <Modal
        open={openDisableNfe}
        onClose={() => {
          setOpenDisableNfe(false);
          setDisableNfeData({});
        }}
        styles={{ maxWidth: 500 }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!disableNfeData?.reason) {
              return createToast({
                message: "Informe o motivo da inutilização",
                status: "error",
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
                setOpenDisableNfe(false);
                setDisableNfeData({});
              }}
              text="Cancelar"
            />

            <Button type="submit" text="Concluir" />
          </div>
        </form>
      </Modal>

      <Modal open={nfeErrorsVisible} onClose={() => setNfeErrorsVisible(false)}>
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
    </Container>
  );
}
