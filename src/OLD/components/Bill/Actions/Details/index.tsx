// @ts-nocheck
import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { billService } from "@/OLD/services/bills.service";

import { useShowBill } from "@/OLD/hooks/useBills";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import ReactToPrint from "react-to-print";
import {
  productFiscalDocumentsColumns,
  productsColumns,
  serviceFiscalDocumentsColumns,
} from "./Columns";

import { DeleteTwoTone } from "@ant-design/icons";

import {
  Button,
  Checkbox,
  Input,
  Modal,
  notification,
  Popconfirm,
  Skeleton,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";
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
import { Icon } from "infinity-forge";
import { CheckIcon, CloseIcon } from "./icons";

const verifyErrors = (message) => {
  if (!message) {
    return notification.error({
      message: "Houve um erro interno, tente novamente mais tarde",
    });
  }

  if (message?.includes("E_NOT_OPEN")) {
    return notification.warning({
      message: "Nota não está aberta, não é possível alterar o vendedor",
    });
  }

  if (message?.includes("E_ERR")) {
    return notification.warning({ message: message?.split(":")[1] });
  }
};

const Details = memo(function Details({ billId, setVisible }) {
  const [formatedProducts, setFormatedProducts] = useState([]);
  const [higherBlock, setHigherBlock] = useState(0);
  const blockArr = Array.from(Array(higherBlock).keys());
  const [openModal, setOpenModal] = useState(false);

  const [openCancelNfse, setOpenCancelNfse] = useState(false);
  const [cancelNfseData, setCancelNfseData] = useState({});

  const [openCancelNfe, setOpenCancelNfe] = useState(false);
  const [cancelNfeData, setCancelNfeData] = useState({});

  const [openDisableNfe, setOpenDisableNfe] = useState(false);
  const [disableNfeData, setDisableNfeData] = useState({});

  const [documentsToIssue, setDocumentsToIssue] = useState([]);
  const [nfeErrorsVisible, setNfeErrorsVisible] = useState(false);
  const [reload, setReload] = useState(false);

  const [nfeErrors, setNfeErrors] = useState([]);
  const [authorizeData, setAuthorizeData] = useState({
    type: "SAIDA",
    billId: null,
  });

  const [changeFields, setChangeFields] = useState({});
  const [seller, setSeller] = useState({});
  const [finResponsible, setFinResponsible] = useState({});
  const [loading, setLoading] = useState(false);

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

  const getFiscalDocumentsQuery = useQuery(
    ["fiscalDocuments", tokens],
    () =>
      fiscalDocumentService.getAllUnitFiscalDocuments({
        document: tokens,
        movement: "SAIDA,AMBOS",
      }),
    {
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
    }
  );

  const getIssuedNfseQuery = useQuery(
    ["fiscalDocuments", "nfse", data?.id],
    () =>
      fiscalDocumentService.getIssuedNfse({
        bill: data?.id,
      }),
    {
      enabled: !!data,
    }
  );

  const getIssuedNfeQuery = useQuery(
    ["fiscalDocuments", "nfe", data?.id],
    () =>
      fiscalDocumentService.getIssuedNfe({
        bill: data?.id,
      }),
    {
      enabled: !!data,
    }
  );

  const authorizeNfse = useMutation(
    () => {
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
    {
      onSuccess: () => {
        setLoading(false);
        notification.success({ message: "Nota emitida com sucesso" });
        setOpenModal(false);
        queryClient.invalidateQueries(["bills"]);
        queryClient.invalidateQueries(["fiscalDocuments"]);
      },
      onError: (err) => {
        setLoading(false);
        notification.error({
          message: err.response.data[0].message ?? "Erro na emissão",
        });
      },
    }
  );

  const updateNfseMutation = useMutation(
    async (_id) => {
      await fiscalDocumentService.updateIssuedNfse({
        id: _id,
      });
    },
    {
      onSuccess: () => {
        getIssuedNfseQuery.refetch();
      },
    }
  );

  const cancelNfseMutation = useMutation(
    async (data) => {
      await fiscalDocumentService.cancelIssuedNfse({
        data,
      });
    },
    {
      onSuccess: () => {
        getIssuedNfseQuery.refetch();
        setOpenCancelNfse(false);
        setCancelNfseData({});
      },
      onError: (err) => {
        notification.error({
          message: err.response.data.message || "Erro na emissão",
        });
      },
    }
  );

  const authorizeNfeMutation = useMutation(
    async () => {
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
    {
      onSuccess: () => {
        setLoading(false);
        setOpenModal(false);
        queryClient.invalidateQueries(["bills"]);
        queryClient.invalidateQueries(["fiscalDocuments"]);
      },
      onError: (err) => {
        setLoading(false);
        notification.error({
          message: err.response.data.message ?? "Erro na emissão",
        });
      },
    }
  );

  const updateNfeMutation = useMutation(
    async (_id) => {
      await fiscalDocumentService.updateIssuedNfe({
        id: _id,
      });
    },
    {
      onSuccess: () => {
        getIssuedNfeQuery.refetch();
      },
    }
  );

  const cancelNfeMutation = useMutation(
    async (data) => {
      await fiscalDocumentService.cancelIssuedNfe({
        data,
      });
    },
    {
      onSuccess: () => {
        getIssuedNfeQuery.refetch();
        setOpenCancelNfe(false);
        setCancelNfeData({});
      },
      onError: (err) => {
        notification.error({
          message: err.response.data.message || "Erro na emissão",
        });
      },
    }
  );

  const disableNfeMutation = useMutation(
    async (data) => {
      await fiscalDocumentService.disableIssuedNfe({
        data,
      });
    },
    {
      onSuccess: () => {
        getIssuedNfeQuery.refetch();
        setOpenDisableNfe(false);
        setDisableNfeData({});
      },
      onError: (err) => {
        notification.error({
          message: err.response.data.message.split(":")[1],
        });
      },
    }
  );

  const getAuthData = (item) => {
    if (!item) return;

    const {
      courtesyApprovedUser,
      approved,
      courtesy,
      max_discount,
      courtesyIssuedUser,
      courtesy_approved_at,
      created_at,
    } = item;

    const approvalDate = moment(courtesy_approved_at).format("DD/MM/YYYY");

    if (approved) {
      return (
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <CheckIcon />
          Aprovado por {courtesyApprovedUser.name} em {approvalDate}
        </span>
      );
    }

    if ((courtesy || max_discount) && courtesy_approved_at) {
      return (
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <CloseIcon />
          Não Aprovado por {courtesyApprovedUser.name} em {approvalDate}
        </span>
      );
    }

    if ((courtesy || max_discount) && courtesy_approved_at === null) {
      return (
        <>
          {" "}
          <svg
            version="1.1"
            id="Layer_1"
            width={20}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="red"
          >
            <g>
              <g>
                <path
                  d="M493.297,159.693c-12.477-30.878-31.231-59.828-56.199-84.792c-24.965-24.969-53.917-43.723-84.795-56.2
C321.421,6.22,288.611,0,255.816,0c-32.747,0-65.495,6.249-96.311,18.744c-30.813,12.491-59.693,31.244-84.603,56.158
c-24.915,24.911-43.668,53.792-56.158,84.607C6.249,190.324,0,223.072,0,255.822c0,32.794,6.222,65.602,18.701,96.485
c12.477,30.877,31.231,59.828,56.2,84.792c24.964,24.967,53.914,43.722,84.792,56.199c30.882,12.48,63.69,18.701,96.484,18.703
c32.748,0,65.497-6.249,96.315-18.743c30.814-12.49,59.695-31.242,84.607-56.158c24.915-24.912,43.668-53.793,56.158-84.608
c12.494-30.817,18.743-63.565,18.744-96.315C512,223.383,505.778,190.575,493.297,159.693z M461.611,339.66
c-10.821,26.683-27.018,51.648-48.659,73.292c-21.643,21.64-46.608,37.837-73.291,48.659
c-26.679,10.818-55.078,16.241-83.484,16.241c-28.477,0-56.947-5.406-83.688-16.214c-26.744-10.813-51.76-27.008-73.441-48.685
C77.37,391.27,61.174,366.255,50.363,339.51c-10.808-26.741-16.214-55.212-16.213-83.689c-0.001-28.405,5.423-56.802,16.24-83.482
c10.821-26.683,27.018-51.648,48.659-73.291c21.643-21.64,46.607-37.837,73.289-48.659c26.678-10.818,55.075-16.242,83.48-16.242
c28.478,0,56.95,5.405,83.691,16.213c26.745,10.811,51.762,27.007,73.445,48.686c21.678,21.682,37.873,46.697,48.685,73.441
c10.808,26.741,16.214,55.211,16.214,83.688C477.852,284.582,472.429,312.98,461.611,339.66z"
                />
              </g>
            </g>
            <g>
              <g>
                <path
                  d="M279.627,256.001l82.693-82.693c6.525-6.525,6.525-17.102,0-23.627c-6.524-6.524-17.102-6.524-23.627,0L256,232.375
l-82.693-82.693c-6.525-6.524-17.102-6.524-23.627,0c-6.524,6.524-6.524,17.102,0,23.627l82.693,82.693l-82.693,82.693
c-6.524,6.523-6.524,17.102,0,23.627c6.525,6.524,17.102,6.524,23.627,0L256,279.628l82.693,82.693
c6.525,6.524,17.102,6.524,23.627,0c6.525-6.524,6.525-17.102,0-23.627L279.627,256.001z"
                />
              </g>
            </g>
          </svg>
          Pendente de liberação;
        </>
      );
    }
  };

  const formatProducts = () => {
    setFormatedProducts(
      data?.items
        ?.map((item) => {
          if (item?.status === "INATIVA") return null;

          return {
            quantity: item?.quantity,
            productCode: item?.productVariation?.product?.reference_code,
            description: item?.productVariation?.product?.description,
            unitPrice: currencyFormatter(item?.unitary_value),
            discount: currencyFormatter(item?.discount_value),
            total: currencyFormatter(item?.total_value),
            courtesy: item?.courtesy ? "Sim" : "Não",
            max_discount: item?.max_discount ? "Sim" : "Não",
            auth_data: getAuthData(item),
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
                <Tooltip title={"Cancelar Nota"}>
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
                </Tooltip>
              )}
              {disableFNPermission && (
                <Tooltip title={"Inutilizar Nota"}>
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
                </Tooltip>
              )}
              <Tooltip title={"Atualizar Dados"}>
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
              </Tooltip>
              {renderErrors(item?.corrections, item?.sefaz_status) && (
                <Tooltip title="Visualizar erros da nota">
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
                </Tooltip>
              )}{" "}
              {item?.sefaz_status === "autorizado" && (
                <Tooltip title={"Imprimir nota"}>
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
                </Tooltip>
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
                <Tooltip title={"Cancelar Nota"}>
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
                </Tooltip>
              )}
              <Tooltip title={"Atualizar Dados"}>
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
              </Tooltip>
              {item?.errors?.length > 0 ? (
                <Tooltip title="Visualizar erros da nota">
                  <TbAlertTriangle
                    size={20}
                    color="var(--red)"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setNfeErrorsVisible(true);
                      return setNfeErrors(item?.errors);
                    }}
                  />
                </Tooltip>
              ) : (
                <Tooltip title={"Imprimir nota"}>
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
                </Tooltip>
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
    setSeller({ seller: data?.sellerId, name: data?.seller?.name });
    setFinResponsible({
      name: data?.financialResponsible?.name,
      id: data?.financialResponsible?.id,
    });
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
        notification.success({ message: "Item removido com sucesso" })
      )
      .finally(() => {
        queryClient.invalidateQueries(["bills"]);
      });
  };

  const changeBillSeller = useCallback(() => {
    billService
      .updateBillSeller({
        billId: data?.id,
        sellerId: seller?.id,
        clientId: data?.client?.id,
        patientId: data?.patient?.id,
      })
      .then((_res) => {
        setChangeFields((prv) => ({ ...prv, seller: false }));
        queryClient.invalidateQueries(["bills"]);
        return notification.success({ message: "Vendedor alterado!" });
      })
      .catch((err) => {
        verifyErrors(err?.response?.data?.message);
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
        return notification.success({ message: "Resp. financeiro alterado" });
      })
      .catch((err) => {
        verifyErrors(err?.response?.data?.message);
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

  return (
    <Container className="">
      {/*
      <h3 className="uk-margin-remove">Venda - Detalhes</h3>
      */}
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
        <Table columns={productsColumns} dataSource={formatedProducts} />
      </section>
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
            <CustomButton
              size={"small"}
              onClick={() => {
                if (data?.status !== "BAIXADA") {
                  return notification.warning({
                    message:
                      "A Venda deve estar finalizada para emissão de documentos fiscais!",
                  });
                }
                setOpenModal(true);
              }}
              disabled={openModal}
            >
              Emitir Nota Fiscal
            </CustomButton>
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

      <footer className="uk-margin-small-top">
        <CustomButton
          onClick={() => setVisible(false)}
          classCallback="uk-margin-right"
        >
          Voltar
        </CustomButton>
        <div style={{ display: "none" }}>
          <div ref={componentRef}>
            <PrintScreen bill={data} />
          </div>
        </div>
        <ReactToPrint
          trigger={() => <CustomButton>Imprimir</CustomButton>}
          content={() => componentRef.current}
        />
      </footer>

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
            <Button size={"large"} onClick={() => setOpenModal(false)}>
              Cancelar
            </Button>
            <Button
              type="primary"
              size={"large"}
              htmlType="submit"
              disabled={documentsToIssue.length === 0}
              loading={loading}
            >
              Emitir
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        title="Cancelamento de Nota Fiscal de Serviço"
        visible={openCancelNfse}
        onCancel={() => {
          setOpenCancelNfse(false);
          setCancelNfseData({});
        }}
        footer={null}
        width={500}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!cancelNfseData?.reason) {
              return notification.error({
                message: "Informe o motivo do cancelamento",
              });
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
              className="uk-margin-small-right"
            >
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit">
              Concluir
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        title="Cancelamento de Nota Fiscal de Produto"
        visible={openCancelNfe}
        onCancel={() => {
          setOpenCancelNfe(false);
          setCancelNfeData({});
        }}
        footer={null}
        width={500}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (!cancelNfeData?.reason) {
              return notification.error({
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
              className="uk-margin-small-right"
            >
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit">
              Concluir
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        title="Inutilização de Nota Fiscal de Produto"
        visible={openDisableNfe}
        onCancel={() => {
          setOpenDisableNfe(false);
          setDisableNfeData({});
        }}
        footer={null}
        width={500}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!disableNfeData?.reason) {
              return notification.error({
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
                setOpenDisableNfe(false);
                setDisableNfeData({});
              }}
              className="uk-margin-small-right"
            >
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit">
              Concluir
            </Button>
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
    </Container>
  );
});

export default Details;
