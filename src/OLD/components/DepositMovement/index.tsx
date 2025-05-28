import { Col, Form, Input, Modal, Row, Table, AutoComplete } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import { Button, PageWrapper, useToast } from "infinity-forge";

import { InputBox } from "./styles";
import moment from "moment";
import "moment/locale/pt-br";
import { useMemo, useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@/presentation/use-query";
import { useColaborators } from "@/OLD/hooks/useColaborators";
import { useProfile, useUserHasPermission } from "@/OLD/hooks/useProfile";
import { depositService } from "@/OLD/services/deposit.service";
import { useReactToPrint } from "react-to-print";

import { Select } from "antd";
const { Option } = Select;

import Link from "next/link";
import { CgDetailsMore } from "react-icons/cg";
import { useDepositMovements, useDeposits } from "@/OLD/hooks/useDeposits";
import { userService } from "@/OLD/services/user.service";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { productService } from "@/OLD/services/product.service";
import PrintScreen from "./PrintScreen";

import { MdOutlineClear } from "react-icons/md";
import { MdLocalPrintshop } from "react-icons/md";

import { sortItems } from "@/OLD/utils/sortItems";
import { PermissionItem } from "@/presentation";

const columns = [
  {
    title: "Data",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Deposito Origem",
    dataIndex: "origin",
    key: "origin",
  },
  {
    title: "Deposito Destino",
    dataIndex: "destination",
    key: "destination",
  },
  {
    title: "Usuário Responsável Retirada",
    dataIndex: "responsible",
    key: "responsible",
  },
  {
    title: "Usuário Soliciante",
    dataIndex: "removal",
    key: "removal",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Ações",
    dataIndex: "actions",
    key: "actions",
  },
];

const productColumns = [
  {
    title: "Produto",
    dataIndex: "product",
    key: "product",
  },
  {
    title: "Quantidade",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Remover",
    dataIndex: "remove",
    key: "remove",
  },
];

const initialCreateState = {
  responsibleUserId: "",
  removalUserId: "",
  fromDepositId: null,
  toDepositId: null,
  items: [],
};

export function DepositMovements() {
  return (
    <PermissionItem hash="MDE00" DaniedComponent={() => <>Usuário não autorizado</>}>
      <Page />
    </PermissionItem>
  );
}

function Page() {
  const { clinic } = useProfile();
  const [searchParams, setSearchParams] = useState<any>({
    user: "",
    responsible: "",
    removal: "",
    fromDeposit: "",
    toDeposit: "",
    status: "",
    unitId: clinic?.id,
    noSearch: true,
  });

  const [openCreate, setOpenCreate] = useState(false);

  const canEditDeposit = useUserHasPermission("MDE02");
  const canRemoveDepositMov = useUserHasPermission("MDE03");

  const canCreateDeposit = useUserHasPermission("MDE01");

  const componentRef = useRef(null);

  const [values, setValues] = useState<any>({});
  const [movDetails, setMovDetails] = useState(false);
  const [createMovementData, setCreateMovementData] =
    useState<any>(initialCreateState);
  const [addProductData, setAddProductData] = useState<any>({
    partial: "",
    selectedProduct: "",
    quantity: 0,
  });

  const { createToast } = useToast();
  const [reload, setReload] = useState(false);

  const { colaborators } = useColaborators();

  const depositsQuery = useDeposits("movements", {
    unitId: clinic?.id,
  });
  const depositMovementsQuery = useDepositMovements(searchParams, reload);


  const productsQuery = useQuery({
    queryKey: ["deposit-movement-products"],
    queryFn: () => productService.listProducts().then((res) => res.data),
    
    enabled: openCreate,
  });

  const imprimir = useReactToPrint({
    contentRef: componentRef,
  });

  const memoedProducts = useMemo(() => {
    if (!productsQuery.data) return [];

    const productsWithPriceRef = productsQuery.data.filter(
      (elem) => !!elem.price.ref
    );

    if (addProductData.partial === "") return productsWithPriceRef;

    return productsWithPriceRef.filter((elem) => {
      return normalizeStr(elem.description)
        .toLowerCase()
        .includes(normalizeStr(addProductData.partial).toLowerCase());
    });
  }, [productsQuery.data, addProductData.partial]);

  const createDepositMovementMutation = useMutation({
    queryKey: ["createDepositMovementMutation"],
    queryFn: (data) => depositService.createDepositMovement(data),
        onSuccess: () => {
        setCreateMovementData(initialCreateState);
        setOpenCreate(false);
        depositMovementsQuery.refetch();
      },
      onError: (err: any) => {
        createToast({
          status: "error",
          message: err.response.data[0].message
            ? err.response.data[0].message
            : "Erro ao criar",
        });
      },
  }
  );

  const handleAddProduct = () => {
    if (addProductData.selectedProduct === "") return;
    if (addProductData.quantity === 0) return;

    const selectedProduct = productsQuery.data.find(
      (elem) =>
        !!elem.price.ref && elem.description === addProductData.selectedProduct
    );
    if (!selectedProduct) {
      alert("Produto não encontrado");
      return;
    }

    setCreateMovementData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productVariationId: selectedProduct.price.id,
          businessUnitProductId: selectedProduct.price.ref,
          quantity: addProductData.quantity,
        },
      ],
    }));
    setAddProductData({
      partial: "",
      selectedProduct: "",
      quantity: 0,
    });
  };

  const isDisabled = createDepositMovementMutation.isLoading;

  sortItems(depositsQuery.data, "description");
  sortItems(colaborators, "name");
  sortItems(memoedProducts, "dscription");

  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        setSearchParams({ ...searchParams, noSearch: false });
      }
    });
  }, []);

  return (
    <PageWrapper title="Movimentações Depositos Estoque">
      <section>
        <div className="uk-margin-bottom uk-margin-small-top">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ flex: 1 }}>
            <Col span={6}>
              <span>Data</span>
              <InputBox className="uk-flex">
                <DatePicker
                  slotProps={{ textField: { variant: "standard" } }}
                  value={searchParams?.from || null}
                  onChange={(val) => {
                    setSearchParams((prev) => ({
                      ...prev,
                      from: val,
                    }));
                  }}
                />
                &nbsp;&nbsp;à&nbsp;
                <DatePicker
                  value={searchParams?.to || null}
                  slotProps={{ textField: { variant: "standard" } }}
                  onChange={(val) => {
                    setSearchParams((prev) => ({
                      ...prev,
                      to: val,
                    }));
                  }}
                />
                &nbsp; &nbsp;
                <MdOutlineClear
                  size={40}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSearchParams((prv) => ({
                      ...prv,
                      from: null,
                      to: null,
                    }));
                  }}
                />
              </InputBox>
            </Col>

            <Col span={6}>
              <span>Deposito Origem</span>
              <InputBox className="uk-flex uk-flex-column">
                <Select
                  value={searchParams.fromDeposit}
                  className="uk-width-1-1"
                  onChange={(e) =>
                    setSearchParams((prev) => ({ ...prev, fromDeposit: e }))
                  }
                >
                  <Option value=""> Todos </Option>
                  {depositsQuery.data?.map(
                    (elem) =>
                      elem.type === "Venda" && (
                        <Option value={elem.id}>
                          {elem.description} - ({elem.id})
                        </Option>
                      )
                  )}
                </Select>
              </InputBox>
            </Col>

            <Col span={6}>
              <span>Deposito Destino</span>
              <InputBox className="uk-flex uk-flex-column">
                <Select
                  value={searchParams.toDeposit}
                  className="uk-width-1-1"
                  onChange={(e) =>
                    setSearchParams((prev) => ({ ...prev, toDeposit: e }))
                  }
                >
                  <Option value=""> Todos </Option>
                  {depositsQuery.data?.map((elem) => (
                    <Option value={elem.id}>
                      {elem.description} - ({elem.id})
                    </Option>
                  ))}
                </Select>
              </InputBox>
            </Col>
            <Col span={4}>
              <span>Status</span>
              <InputBox className="uk-flex uk-flex-column">
                <Select
                  value={searchParams.status}
                  className="uk-width-1-1"
                  onChange={(e) =>
                    setSearchParams((prev) => ({ ...prev, status: e }))
                  }
                >
                  <Option value=""> Todos </Option>
                  <Option value="Ativo"> Ativo </Option>
                  <Option value="Inativo"> Inativo </Option>
                </Select>
              </InputBox>
            </Col>
          </Row>
          <Row className="uk-margin-small-top">
            <Col span={8}>
              <span>Responsável retirada</span>
              <InputBox className="uk-flex uk-flex-column uk-margin-small-right">
                <AutoComplete
                  allowClear
                  onClear={() => {
                    const newObj = { ...searchParams };
                    let newValuesObj: any = { ...values };
                    delete newObj?.responsible;
                    delete newValuesObj?.responsible;
                    setSearchParams(newObj);
                    setValues(newValuesObj);
                  }}
                  value={values?.responsible}
                  className="uk-width-1-1"
                  options={colaborators?.map((collab) => ({
                    ...collab,
                    value: collab?.name,
                    key: collab?.id,
                  }))}
                  onChange={(val) => setValues({ ...values, responsible: val })}
                  onSelect={(val, opt) => {
                    setValues({ ...values, responsible: opt?.value });
                    setSearchParams((prv) => ({
                      ...prv,
                      responsible: opt?.id,
                    }));
                  }}
                  filterOption={(val, opt) =>
                    normalizeStr(opt?.name.toUpperCase()).includes(
                      normalizeStr(val.toUpperCase())
                    )
                  }
                />
                {/*
          onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, user: e }))
            }
            <Option value=""> Todos </Option>
            {usersQuery.data?.map((elem) => (
              <Option value={elem.id}>{elem.name}</Option>
            ))}
          </Select>
            */}
              </InputBox>
            </Col>
            <Col span={8}>
              <span>Solicitante</span>
              <InputBox className="uk-flex uk-flex-column">
                <AutoComplete
                  value={values?.user}
                  className="uk-width-1-1"
                  allowClear
                  onClear={() => {
                    const newObjFilters = { ...searchParams };
                    const newObjValues = { ...values };
                    delete newObjFilters?.user;
                    delete newObjValues?.user;
                    setSearchParams(newObjFilters);
                    setValues(newObjValues);
                  }}
                  options={colaborators?.map((collab) => ({
                    ...collab,
                    value: collab?.name,
                    key: collab?.id,
                  }))}
                  onChange={(val) => setValues({ ...values, user: val })}
                  onSelect={(_, opt) => {
                    setValues({ ...values, user: opt?.value });
                    setSearchParams((prv) => ({ ...prv, user: opt?.id }));
                  }}
                  filterOption={(val, opt) =>
                    normalizeStr(opt?.name.toUpperCase()).includes(
                      normalizeStr(val.toUpperCase())
                    )
                  }
                />
                {/*
          <Select
            value={searchParams.responsible}
            className="uk-width-1-1"
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, responsible: e }))
            }
          >
            <Option value=""> Todos </Option>
            {usersQuery.data?.map((elem) => (
              <Option value={elem.id}>{elem.name}</Option>
            ))}
          </Select>
          */}
              </InputBox>
            </Col>
            <Col span={4} className="uk-margin-top uk-flex uk-flex-right">
              <Button
                onClick={(prv) => {
                  setSearchParams((prv) => ({ ...prv, noSearch: false }));
                  setReload((prv) => !prv);
                }}
                text="Filtrar"
              />
            </Col>
            {canCreateDeposit && (
              <Col
                span={4}
                style={{
                  paddingTop: "1rem",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  onClick={() => setOpenCreate(true)}
                  text="Nova Movimentação"
                />
              </Col>
            )}
          </Row>
        </div>

        {
          // {depositMovementsQuery.isLoading && <Skeleton paragraph={{ rows: 4 }} />}
        }
        <div>
          <Table
            columns={columns}
            dataSource={(depositMovementsQuery.data ?? []).map((elem) => ({
              id: elem.id,
              date: moment(elem.date).format("DD/MM/YYYY - HH:mm"),
              origin: elem.fromDeposit.description,
              destination: elem.toDeposit.description,
              description: elem.description,
              responsible: elem.responsibleUser.name,
              removal: elem.removalUser.name,
              type: elem.type,
              status: elem.status,
              actions: (
                <div
                  className="uk-flex"
                  style={{ gap: "1rem", alignItems: "center" }}
                >
                  <Link href={`/dashboard/movimentacao-depositos/${elem.id}`}>
                    <div
                      style={{
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <CgDetailsMore size={15} />
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      depositService
                        ?.getDepositMovements({ ids: [elem?.id] })
                        .then((res) => setMovDetails(res?.data[0]));

                      imprimir();

                      setMovDetails(false);
                    }}
                  >
                    <MdLocalPrintshop />
                  </button>
                </div>
              ),
            }))}
          />
        </div>

        <Modal
          visible={openCreate}
          footer={null}
          width={1000}
          onCancel={() => {
            setOpenCreate(false);
            setCreateMovementData(initialCreateState);
          }}
        >
          <PageWrapper title="Nova Movimentação">
            <Form
              layout="vertical"
              onSubmitCapture={() =>
                createDepositMovementMutation.mutate(createMovementData)
              }
            >
              <div
                className="uk-flex uk-flex-between"
                style={{ columnGap: "2rem" }}
              >
                <Form.Item
                  label="Deposito Origem"
                  required
                  style={{ width: "100%" }}
                >
                  <Select
                    value={createMovementData?.fromDepositId}
                    className="uk-width-1-1"
                    onChange={(e) =>
                      setCreateMovementData((prev) => ({
                        ...prev,
                        fromDepositId: e,
                        toDepositId: null,
                      }))
                    }
                  >
                    {depositsQuery.data?.map(
                      (elem) =>
                        elem?.type === "Venda" && (
                          <Option value={elem.id}>
                            {elem.description} - ({elem.id})
                          </Option>
                        )
                    )}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Deposito Destino"
                  required
                  style={{ width: "100%" }}
                >
                  <Select
                    value={createMovementData?.toDepositId}
                    className="uk-width-1-1"
                    onChange={(e) =>
                      setCreateMovementData((prev) => ({
                        ...prev,
                        toDepositId: e,
                      }))
                    }
                  >
                    {(depositsQuery.data ?? [])
                      .filter((v) => {
                        // Evita que o deposito de origem seja selecionado como destino
                        if (!createMovementData.fromDepositId) return true;
                        return v.id !== createMovementData.fromDepositId;
                      })
                      .map((elem) => (
                        <Option value={elem.id}>
                          {elem.description} - ({elem.id})
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>

              <div
                className="uk-flex uk-flex-between"
                style={{ columnGap: "2rem" }}
              >
                <Form.Item
                  label="Responsável Retirada"
                  required
                  style={{ width: "100%" }}
                >
                  <AutoComplete
                    options={colaborators?.map((collab) => ({
                      ...collab,
                      value: collab?.name,
                    }))}
                    value={createMovementData?.responsibleUserName}
                    className="uk-width-1-1"
                    onChange={(val) =>
                      setCreateMovementData((prv) => ({
                        ...prv,
                        responsibleUserName: val,
                      }))
                    }
                    onSelect={(_, opt) => {
                      setCreateMovementData((prv) => ({
                        ...prv,
                        responsibleUserName: opt?.value,
                        responsibleUserId: opt?.id,
                      }));
                    }}
                    filterOption={(val, opt) =>
                      normalizeStr(opt?.name.toUpperCase()).includes(
                        normalizeStr(val.toUpperCase())
                      )
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="Soliciante"
                  required
                  style={{ width: "100%" }}
                >
                  <AutoComplete
                    options={colaborators?.map((collab) => ({
                      ...collab,
                      value: collab?.name,
                    }))}
                    value={createMovementData?.removalUserName}
                    className="uk-width-1-1"
                    onChange={(val) =>
                      setCreateMovementData((prv) => ({
                        ...prv,
                        removalUserName: val,
                      }))
                    }
                    onSelect={(_, opt) => {
                      setCreateMovementData((prv) => ({
                        ...prv,
                        removalUserName: opt?.value,
                        removalUserId: opt?.id,
                      }));
                    }}
                    filterOption={(val, opt) =>
                      normalizeStr(opt?.name.toUpperCase()).includes(
                        normalizeStr(val.toUpperCase())
                      )
                    }
                  />
                </Form.Item>
              </div>

              <div
                className="uk-width-1-1"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <div
                  className="uk-width-1-1"
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <Form.Item label="Produto" required style={{ width: "100%" }}>
                    <AutoComplete
                      className="uk-width-1-1"
                      options={memoedProducts.map((elem) => ({
                        value: elem.description,
                      }))}
                      value={addProductData.partial}
                      onChange={(val) => {
                        // value to be searched
                        setAddProductData((prev) => ({
                          ...prev,
                          partial: val,
                        }));
                      }}
                      onSelect={(_, opt) => {
                        // selected option
                        setAddProductData((prev) => ({
                          ...prev,
                          selectedProduct: opt.value,
                          quantity: 1,
                        }));
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Quantidade"
                    required
                    style={{ width: "40%" }}
                  >
                    <Input
                      placeholder="Quantidade"
                      value={addProductData.quantity}
                      onChange={(e) => {
                        setAddProductData((prev) => ({
                          ...prev,
                          quantity: e.target.value,
                        }));
                      }}
                      min={1}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </div>

                <Button
                  onClick={handleAddProduct}
                  disabled={addProductData.quantity < 1}
                  text="Adicionar Produto"
                />
              </div>

              <Table
                columns={productColumns}
                dataSource={createMovementData.items.map((elem: any) => ({
                  key: elem.productVariationId,
                  product: productsQuery.data.find(
                    (prod) => prod.price.id === elem.productVariationId
                  )?.description,
                  quantity: elem.quantity,
                  remove: (
                    <Button
                      onClick={() => {
                        setCreateMovementData((prev) => ({
                          ...prev,
                          items: prev.items.filter(
                            (item) =>
                              item.productVariationId !==
                              elem.productVariationId
                          ),
                        }));
                      }}
                      text="Remover"
                    />
                  ),
                }))}
                pagination={false}
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  marginTop: "2rem",
                }}
              />

              <hr />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                  columnGap: "1rem",
                  width: "100%",
                }}
              >
                <Button
                  onClick={() => {
                    setOpenCreate(false);
                    setCreateMovementData(initialCreateState);
                    setAddProductData({
                      partial: "",
                      selectedProduct: "",
                      quantity: 0,
                    });
                    // setCreatedRole(false);
                    // setCreateMovementData({ externalAccess: false });
                  }}
                  text="Cancelar"
                />

                <Button type="submit" text="Salvar" />
              </div>
            </Form>
          </PageWrapper>
        </Modal>
        <div style={{ display: "none" }}>
          <div ref={componentRef}>
            <PrintScreen data={movDetails} />
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
