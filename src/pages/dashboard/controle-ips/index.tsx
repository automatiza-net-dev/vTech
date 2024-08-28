import { useState } from "react";

import moment from "moment";
import "moment/locale/pt-br";
import styled from "styled-components";
import { useMutation, useQuery } from "react-query";
import { Button, Form, Input, Modal, Skeleton, Table, Typography } from "antd";

import api from "@/OLD/services";
import AccessDenied from "@/OLD/components/AccessDenied";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { LayoutDashboard } from "@/presentation";
import { PrivatePage } from "infinity-forge";

export default function IpAccessControlPage() {
  return <Page />;
}

function Page() {
  const [openCreate, setOpenCreate] = useState(false);

  const [formData, setFormData] = useState({ ipAddress: "" });

  const listIpPermission = useUserHasPermission("CIP00");
  const insertIpAuthPermission = useUserHasPermission("CIP01");

  const ipsQuery = useQuery({
    queryKey: ["ip-access"],
    queryFn: async () =>
      await api.get("/ip-access/search", {}).then(({ data }) => data),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const createIpMutation = useMutation(
    async (data) => await api.post("/ip-access/store", data),
    {
      onSuccess: () => {
        ipsQuery.refetch();
        setFormData({ ipAddress: "" });
        setOpenCreate(false);
      },
    }
  );

  return (
    <LayoutDashboard>
      {!listIpPermission ? (
        <AccessDenied />
      ) : (
        <section className="uk-padding">
          <div className="uk-flex uk-flex-between uk-flex-middle uk-margin-bottom">
            <Typography.Title level={3}>Controle de IPs</Typography.Title>

            <div className="uk-flex uk-flex-middle">
              {insertIpAuthPermission && (
                <Button
                  type="primary"
                  className="uk-margin-left"
                  onClick={() => setOpenCreate(true)}
                >
                  Cadastrar
                </Button>
              )}
            </div>
          </div>

          {ipsQuery.isLoading && <Skeleton paragraph={{ rows: 4 }} />}
          {ipsQuery.data && (
            <div>
              <Table
                columns={[
                  {
                    title: "Unidade",
                    dataIndex: "unit",
                    key: "unit",
                  },
                  {
                    title: "IP",
                    dataIndex: "ipAddress",
                    key: "ipAddress",
                  },
                  {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                  },
                  {
                    title: "Usuário",
                    dataIndex: "user",
                    key: "user",
                  },
                  {
                    title: "Data de criação",
                    dataIndex: "createdAt",
                    key: "createdAt",
                  },
                ]}
                dataSource={(ipsQuery.data ?? []).map((elem) => ({
                  id: elem.id,
                  unit: elem?.unit?.identification ?? "-",
                  ipAddress: elem.ip_address,
                  status: elem.active ? "Ativo" : "Desativado",
                  user: elem?.user?.name ?? "-",
                  createdAt: elem.created_at
                    ? moment(elem.created_at).format("DD/MM/YYYY - HH:mm")
                    : "-",
                }))}
              />
            </div>
          )}

          <Modal
            title="Cadastrar Endereço IP"
            visible={openCreate}
            footer={null}
            width={500}
            onCancel={() => {
              setOpenCreate(false);
              ipsQuery.refetch();
            }}
          >
            <Form
              layout="vertical"
              onSubmitCapture={() => {
                createIpMutation.mutate(formData as any);
              }}
            >
              <div className="uk-flex uk-flex-between">
                <Form.Item
                  label="Endereço IP"
                  required
                  style={{ width: "100%" }}
                >
                  <Input
                    required
                    placeholder="Endereço IP"
                    value={formData?.ipAddress}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ipAddress: e.target.value,
                      }))
                    }
                  />
                </Form.Item>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <Button
                  type="ghost"
                  onClick={() => {
                    setOpenCreate(false);
                    ipsQuery.refetch();
                  }}
                >
                  Cancelar
                </Button>

                <Button type="primary" htmlType="submit">
                  Salvar
                </Button>
              </div>
            </Form>
          </Modal>
        </section>
      )}
    </LayoutDashboard>
  );
}

export const Container = styled.section`
  border-left: solid 1px #dcdcdc;
  padding-left: 20px;
`;
