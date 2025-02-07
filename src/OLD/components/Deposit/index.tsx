// @ts-nocheck
import { useEffect, useRef } from "react";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import {
  Col,
  Form,
  Input,
  Modal,
  Row,
  Skeleton,
  Table,
  notification,
  Popconfirm,
} from "antd";
import { Button, PageWrapper } from "infinity-forge";
import AccessDenied from "@/OLD/components/AccessDenied";
import { InputBox } from "./styles";
import moment from "moment";
import "moment/locale/pt-br";
import { memo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useProfile, useUserHasPermission } from "@/OLD/hooks/useProfile";
import { depositService } from "@/OLD/services/deposit.service";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import PrintScreen from "./PrintScreen";

import { Select } from "antd";
import Link from "next/link";
import { CgDetailsMore } from "react-icons/cg";
import { MdLocalPrintshop } from "react-icons/md";

const columns = [
  {
    title: "Descrição",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Tipo Deposito",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Principal",
    dataIndex: "principal",
    key: "principal",
    render: (text) => (text ? "Sim" : "Não"),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Data de criação",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "Ações",
    dataIndex: "actions",
    key: "actions",
  },
];

export const Deposits = memo(() => {
  const { clinic } = useProfile();

  const [searchParams, setSearchParams] = useState({
    description: "",
    type: "",
    status: "",
    unitId: clinic?.id,
  });
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const componentRef = useRef();

  const listDepositsPermission = useUserHasPermission("DEP00");
  const canCreateDeposit = useUserHasPermission("DEP01");
  const canEditDeposit = useUserHasPermission("DEP02");
  const canRemoveDeposit = useUserHasPermission("DEP03");

  const [depositDetails, setDepositDetails] = useState(false);
  const [createDepositData, setCreateDepositData] = useState({
    description: "",
    type: "Venda",
  });
  const [updateDepositData, setUpdateDepositData] = useState({
    description: "",
    type: "Venda",
  });

  const depositsQuery = useQuery({
    queryKey: ["deposits", searchParams],
    queryFn: () => {
      if (!searchParams?.unitId) {
        return;
      }
      return depositService
        .searchDeposits(searchParams)
        .then(({ data }) => data);
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const createDepositMutation = useMutation(
    (data) => depositService.createDeposit(data),
    {
      onSuccess: (res) => {
        // setCreatedRole(res.data);
        // setShowRowId(res.data.id);
        setOpenCreate(false);
        depositsQuery.refetch();
        setCreateDepositData({ description: "", type: "Venda" });
      },
      onError: (err) => {
        notification.error({
          message: err.response.data.message
            ? err.response.data.message.split(":").at(1)
            : "Erro ao criar",
        });
      },
    }
  );

  const updateDepositMutation = useMutation(
    (data) => depositService.updateDeposit(data.id, data),
    {
      onSuccess: () => {
        setOpenUpdate(false);
        depositsQuery.refetch();
      },
      onError: (err) => {
        notification.error({
          message: err.response.data.message
            ? err.response.data.message.split(":").at(1)
            : "Erro ao atualizar",
        });
      },
    }
  );

  const isDisabled = updateDepositMutation.isLoading;

  useEffect(() => {
    setSearchParams((prv) => ({ ...prv, unitId: clinic?.id }));
  }, [clinic]);

  const imprimir = useReactToPrint({
    contentRef: componentRef,
    onAfterPrint: () => setDepositDetails(false),
  });

  return !listDepositsPermission || listDepositsPermission === "loading" ? (
    <AccessDenied loading={listDepositsPermission} />
  ) : (
    <PageWrapper title="Deposito Estoque">
      <section>
        <div className="uk-flex uk-flex-between uk-flex-middle uk-margin-bottom uk-margin-small-top">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ flex: 1 }}>
            <Col span={8}>
              <span>Descrição</span>
              <InputBox className="uk-flex uk-flex-column">
                <Input
                  value={searchParams.description}
                  onInput={(e) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </InputBox>
            </Col>

            <Col span={4}>
              <span>Tipo</span>
              <InputBox className="uk-flex uk-flex-column">
                <Select
                  value={searchParams.type}
                  className="uk-width-1-1"
                  onChange={(e) =>
                    setSearchParams((prev) => ({ ...prev, type: e }))
                  }
                >
                  <Option value=""> Todos </Option>
                  <Option value="Venda"> Venda </Option>
                  <Option value="Consumo"> Consumo </Option>
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

          <div className="uk-flex uk-flex-middle">
            {canCreateDeposit && (
              <Button text="Cadastrar" onClick={() => setOpenCreate(true)} />
            )}
          </div>
        </div>

        {depositsQuery.isLoading && <Skeleton paragraph={{ rows: 4 }} />}
        {depositsQuery.data && (
          <div>
            <Table
              columns={columns}
              dataSource={(depositsQuery.data ?? [])
                .map((elem) => ({
                  id: elem.id,
                  description: elem.description,
                  type: elem.type,
                  status: elem.status,
                  createdAt: elem.created_at
                    ? moment(elem.created_at).format("DD/MM/YYYY - HH:mm")
                    : "-",
                  actions: (
                    <div
                      className="uk-flex"
                      style={{ gap: "1rem", alignItems: "center" }}
                    >
                      {canEditDeposit && (
                        <EditTwoTone
                          size={15}
                          onClick={() => {
                            setUpdateDepositData({
                              id: elem.id,
                              description: elem.description,
                              type: elem.type,
                              status: elem.status,
                            });

                            setOpenUpdate(true);
                            // setShowRowId(elem.id);
                          }}
                          disabled={isDisabled}
                        />
                      )}
                      <Link href={`/dashboard/depositos/${elem.id}`}>
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
                      {canRemoveDeposit && (
                          <Popconfirm
                            onConfirm={() =>
                              notification.warning({
                                message: "Verificar método",
                              })
                            }
                            title="Deseja remover este depósito?"
                          >
                            <DeleteTwoTone twoToneColor={"red"} />
                          </Popconfirm>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          depositService
                            .getDeposit(elem?.id)
                            .then((res) => setDepositDetails(res.data));

                          imprimir();
                        }}
                      >
                        <MdLocalPrintshop />
                      </button>
                    </div>
                  ),
                }))
                .sort((a, b) => {
                  if (
                    a?.description?.toLowerCase() < b.description?.toLowerCase()
                  ) {
                    return -1;
                  }

                  if (a.description?.toLowerCase() > b.name?.toLowerCase()) {
                    return 1;
                  }

                  return 0;
                })}
            />
          </div>
        )}

        <Modal
          title="Cadastrar Deposito"
          visible={openCreate}
          footer={null}
          width={600}
          onCancel={() => {
            setOpenCreate(false);
            // setCreatedRole(false);
            setCreateDepositData({
              description: "",
              type: "Venda",
            });
            depositsQuery.refetch();
          }}
        >
          <Form
            layout="vertical"
            onSubmitCapture={() =>
              createDepositMutation.mutate(createDepositData)
            }
          >
            <div
              className="uk-flex uk-flex-between"
              style={{ columnGap: "2rem" }}
            >
              <Form.Item label="Descrição" required style={{ width: "100%" }}>
                <Input
                  required
                  placeholder=""
                  value={createDepositData?.description}
                  style={{ width: "100%" }}
                  onChange={(e) =>
                    setCreateDepositData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </Form.Item>

              <Form.Item label="Tipo" required style={{ width: "50%" }}>
                <Select
                  value={createDepositData?.type}
                  className="uk-width-1-1"
                  onChange={(e) =>
                    setCreateDepositData((prev) => ({ ...prev, type: e }))
                  }
                >
                  <Option value="Venda"> Venda </Option>
                  <Option value="Consumo"> Consumo </Option>
                </Select>
              </Form.Item>
            </div>

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
                  setCreateDepositData(false);
                  depositsQuery.refetch();
                }}
                text="Cancelar"
              />

              <Button type="submit" text="Salvar" />
            </div>
          </Form>
        </Modal>

        <Modal
          title="Atualizar Deposito"
          onCancel={() => setOpenUpdate(false)}
          visible={openUpdate}
          footer={null}
          width={600}
        >
          <Form
            layout="vertical"
            onSubmitCapture={() =>
              updateDepositMutation.mutate(updateDepositData)
            }
          >
            <div
              className="uk-flex uk-flex-between"
              style={{ columnGap: "2rem" }}
            >
              <Form.Item label="Descrição" required style={{ width: "100%" }}>
                <Input
                  required
                  placeholder=""
                  value={updateDepositData?.description}
                  style={{ width: "100%" }}
                  onChange={(e) =>
                    setUpdateDepositData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </Form.Item>

              <Form.Item label="Tipo" required style={{ width: "50%" }}>
                <Select
                  value={updateDepositData?.type}
                  className="uk-width-1-1"
                  onChange={(e) =>
                    setUpdateDepositData((prev) => ({ ...prev, type: e }))
                  }
                >
                  <Option value="Venda"> Venda </Option>
                  <Option value="Consumo"> Consumo </Option>
                </Select>
              </Form.Item>

              <Form.Item label="Status" required style={{ width: "40%" }}>
                <Select
                  value={updateDepositData?.status}
                  className="uk-width-1-1"
                  onChange={(e) =>
                    setUpdateDepositData((prev) => ({ ...prev, status: e }))
                  }
                >
                  <Option value="Ativo"> Ativo </Option>
                  <Option value="Inativo"> Inativo </Option>
                </Select>
              </Form.Item>
            </div>

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
                  setOpenUpdate(false);
                }}
                text="Cancelar"
              />

              <Button type="submit" text="Salvar" />
            </div>
          </Form>
        </Modal>
        <div style={{ display: "none" }}>
          <div ref={componentRef}>
            <PrintScreen data={depositDetails} />
          </div>
        </div>
      </section>
    </PageWrapper>
  );
});
