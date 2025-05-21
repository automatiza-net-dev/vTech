import { useState } from "react";

import moment from "moment";
import "moment/locale/pt-br";
import styled from "styled-components";
import { useMutation, useQuery } from "infinity-forge";
import { Form, Input, Modal, Skeleton, Table } from "antd";

import api from "@/OLD/services";
import AccessDenied from "@/OLD/components/AccessDenied";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { LayoutDashboard } from "@/presentation";
import { PageWrapper, Button } from "infinity-forge";

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
    queryFn: async () =>  await api.get("/ip-access/search", {}).then(({ data }) => data),
    enableCache: true,
  });

  const createIpMutation = useMutation({
    queryKey: ["mutation_ip"],
    queryFn: async (data) => {
      await api.post("/ip-access/store", data);
    },
    onSuccess: () => {
      ipsQuery.refetch();
      setFormData({ ipAddress: "" });
      setOpenCreate(false);
    },
  });

  return (
    <LayoutDashboard>
      <PageWrapper title="Controle de IPs">
        {!listIpPermission ? (
          <AccessDenied />
        ) : (
          <section className="uk-padding">
            <div className="uk-flex uk-flex-between uk-flex-middle uk-margin-bottom">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                {insertIpAuthPermission && (
                  <Button
                    onClick={() => setOpenCreate(true)}
                    text="Cadastrar"
                  />
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
                    onClick={() => {
                      setOpenCreate(false);
                      ipsQuery.refetch();
                    }}
                    text="Cancelar"
                  />

                  <Button type="submit" text="Salvar" />
                </div>
              </Form>
            </Modal>
          </section>
        )}
      </PageWrapper>
    </LayoutDashboard>
  );
}

export const Container = styled.section`
  border-left: solid 1px #dcdcdc;
  padding-left: 20px;
`;
