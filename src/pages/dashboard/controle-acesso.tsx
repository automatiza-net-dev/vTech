import { memo, useEffect, useState, useCallback } from "react";

import {
    Form,
    Input,
    Modal,
    Table,
    Button,
    Switch,
    Tooltip,
    Checkbox,
    Collapse,
    Skeleton,
    Popconfirm,
    notification,
  } from "antd";
import moment from "moment";
import "moment/locale/pt-br";
import { BiDuplicate } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";

import { sortItems } from "@/OLD/utils/sortItems";
import AccessDenied from "@/OLD/components/AccessDenied";
import { adminService } from "@/OLD/services/admin.service";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { EditTwoTone, DeleteOutlined } from "@ant-design/icons";
import { useExternalProfiles } from "@/OLD/hooks/useExternalProfile";
import { useSearchProfileInfo } from "@/OLD/hooks/useExternalProfile";
import { profileService } from "@/OLD/services/External/profileService";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";

import { LayoutDashboard } from "@/presentation";

const columns = [
  {
    title: "Descrição",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Acesso Externo",
    dataIndex: "externalAccess",
    key: "externalAccess",
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

export default function ControlesDeAcessoPage() {
  const [showRoleId, setShowRoleId] = useState(false);
  const [managePermissionsData, setManagePermissionsData] = useState<
    { id: string; active: boolean }[]
  >([]);

  useEffect(() => {
    if (!showRoleId) return;

    setManagePermissionsData([]);
  }, [showRoleId]);

  const [term, setTerm] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const [createRoleData, setCreateRoleData] = useState({
    name: "",
    externalAccess: false,
  });
  const [updateRoleData, setUpdateRoleData] = useState<{name?: string, externalAccess?: boolean, active?: boolean}>({});

  const [createdRole, setCreatedRole] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [rolesConfigVisible, setRolesConfigVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchRoleParams, setSearchRoleParams] = useState({});

  const { info } = useSearchProfileInfo(searchRoleParams);

  useEffect(() => {
    setSearchRoleParams({ id: showRoleId });
  }, [showRoleId]);

  useEffect(() => {
    info?.profiles &&
      setSelectedProfiles(info?.profiles?.map((item) => item?.id));
  }, [info?.profiles]);

  const canCreateAccess = useUserHasPermission("ACE01");
  const canEditAccess = useUserHasPermission("ACE02");
  const canDeleteAccess = useUserHasPermission("ACE03");
  const listAccessControllPermission = useUserHasPermission("ACE00");

  const syncProfileConfig = useCallback(
    (roleId) => {
      profileService
        .syncProfileConfig({
          roleId,
          profileAccessIdList: selectedProfiles,
        })
        .then(() => setShowRoleId(false));
    },
    [selectedProfiles]
  );

  const rolesQuery = useQuery({
    queryKey: ["roles", term],
    queryFn: () =>
      adminService.getAllRoles({ name: term }).then(({ data }) => data),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const showRoleQuery = useQuery({
    queryKey: ["role", showRoleId],
    queryFn: () => adminService.getOneRole(showRoleId).then(({ data }) => data),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!showRoleId,
  });

  const showRoleMetadataQuery = useQuery({
    queryKey: ["role", "metadata", showRoleId],
    queryFn: () =>
      adminService.getRoleMetadata(showRoleId).then(({ data }) => data),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!showRoleId,
    onSuccess: (data) => {
      const result = data.reduce((acc, curr) => {
        const permissions = curr.permissions.map((p) => ({
          id: p.id,
          active: p.active,
        }));

        return acc.concat(permissions);
      }, []);

      setManagePermissionsData(result);
    },
  });

  const permissionsQuery = useQuery({
    queryKey: ["role", "permissions", showRoleId],
    queryFn: () => adminService.getAllPermissions().then(({ data }) => data),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!showRoleId,
  });

  const createRoleMutation = useMutation(
    (data) => adminService.createRole(data),
    {
      onSuccess: (res) => {
        setCreatedRole(res.data);
        setShowRoleId(res.data.id);
      },
      onError: (err: any) => {
        notification.error({
          message: err.response.data.message
            ? err.response.data.message.split(":").at(1)
            : "Erro ao criar",
        });
      },
    }
  );

  const updateRoleMutation = useMutation(
    (data: any) => adminService.editRole(data.id, data),
    {
      onSuccess: () => {
        setOpenUpdate(false);
        setUpdateRoleData({});
        manageRolePermissionsMutation.mutate({
          data: [{ role: showRoleId, permissions: managePermissionsData }],
        } as any);
        rolesQuery.refetch();
      },
      onError: (err: any) => {
        notification.error({
          message: err.response.data.message
            ? err.response.data.message.split(":").at(1)
            : "Erro ao atualizar",
        });
      },
    }
  );

  const deleteRoleMutation = useMutation((id) => adminService.deleteRole(id), {
    onSuccess: () => {
      rolesQuery.refetch();
    },
    onError: (err: any) => {
      notification.error({
        message: err.response.data.message
          ? err.response.data.message.split(":").at(1)
          : "Erro ao deletar cargo",
      });
    },
  });

  const addRolePermissionsMutation = useMutation(
    (data) => adminService.addPermissionToRole(data),
    {
      onSuccess: () => {
        showRoleMetadataQuery.refetch();
      },
      onError: (err: any) => {
        notification.error({
          message: err.response.data.message
            ? err.response.data.message.split(":").at(1)
            : "Erro ao adicionar",
        });
      },
    }
  );

  const manageRolePermissionsMutation = useMutation(
    (data) => adminService.manageRolePermissions(data),
    {
      onSuccess: () => {
        setOpenCreate(false);
        setCreateRoleData({
          name: "",
          externalAccess: false,
        });
        setSelectedProfiles([]);
        setRolesConfigVisible(false);
        syncProfileConfig(showRoleId);
        showRoleMetadataQuery.refetch();
        rolesQuery.refetch();
      },
      onError: (err: any) => {
        notification.error({
          message: err.response.data.message
            ? err.response.data.message.split(":").at(1)
            : "Erro ao adicionar",
        });
      },
    }
  );

  const submitDuplicatePermission = (id) => {
    setLoading(true);

    adminService
      .duplicatePermission({ roleId: id })
      .then((res) => {
        setTerm(res?.data?.name);
        setLoading(false);
        return notification.success({
          message: "Controle copiado com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  const isDisabled =
    showRoleQuery.isLoading ||
    deleteRoleMutation.isLoading ||
    updateRoleMutation.isLoading;

  return (
    <LayoutDashboard>
      {!listAccessControllPermission ||
      listAccessControllPermission === "loading" ? (
        <AccessDenied loading={listAccessControllPermission} />
      ) : (
        <section className="uk-padding">
          <div className="uk-flex uk-flex-between uk-flex-middle uk-margin-bottom">
            <h3 className="uk-margin-remove">Controle de Acesso</h3>

            <div className="uk-flex uk-flex-middle">
              <div>
                <label>Descrição</label>
                <br />
                <Input
                  placeholder="Pesquisar"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  style={{ width: 300 }}
                />
              </div>
              {canCreateAccess && (
                <CustomButton
                  type="primary"
                  classCallback="uk-margin-left uk-margin-top"
                  onClick={() => setOpenCreate(true)}
                >
                  Cadastrar
                </CustomButton>
              )}
            </div>
          </div>

          {rolesQuery.isLoading && <Skeleton paragraph={{ rows: 4 }} />}
          {rolesQuery.data && (
            <div>
              <Table
                columns={columns}
                dataSource={(rolesQuery.data ?? [])
                  .map((elem) => ({
                    id: elem.id,
                    description: elem.name,
                    externalAccess: elem.external_access ? "Sim" : "Não",
                    status: elem.active ? "Ativo" : "Desativado",
                    createdAt: elem.created_at
                      ? moment(elem.created_at).format("DD/MM/YYYY - HH:mm")
                      : "-",
                    actions: (
                      <div className="uk-flex" style={{ gap: "1rem" }}>
                        {/*
                  <CopyOutlined
                    size={15}
                    onClick={() => {
                      setRolesConfigVisible(true);
                      setShowRoleId(elem.id);
                    }}
                    disabled={isDisabled}
                  />
                    */}
                        {canEditAccess && (
                          <EditTwoTone
                            size={15}
                            onClick={() => {
                              setUpdateRoleData((prev) => ({
                                ...prev,
                                id: elem.id,
                                name: elem.name,
                                active: elem.active,
                                externalAccess: elem.external_access,
                              }));
                              setOpenUpdate(true);
                              setShowRoleId(elem.id);
                            }}
                            disabled={isDisabled}
                          />
                        )}
                        <Popconfirm
                          title={`Deseja fazer uma cópia do acesso ${elem?.name}?`}
                          onConfirm={() => submitDuplicatePermission(elem?.id)}
                        >
                          <Tooltip title="Duplicar controle">
                            <BiDuplicate
                              color="var(--darkBlue)"
                              size={15}
                              style={{ cursor: "pointer" }}
                            />
                          </Tooltip>
                        </Popconfirm>
                        <Popconfirm
                          title="Tem certeza que deseja deletar?"
                          onConfirm={() => {
                            deleteRoleMutation.mutate(elem.id);
                          }}
                        >
                          {canDeleteAccess && (
                            <DeleteOutlined size={15} disabled={isDisabled} />
                          )}
                        </Popconfirm>
                      </div>
                    ),
                  }))
                  .sort((a, b) => {
                    if (
                      a?.description?.toLowerCase() <
                      b.description?.toLowerCase()
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
            title="Cadastrar controle de acesso"
            visible={openCreate}
            footer={null}
            width={1000}
            onCancel={() => {
              setOpenCreate(false);
              setCreatedRole(false);
              setCreateRoleData({
                name: "",
                externalAccess: false,
              });
              rolesQuery.refetch();
            }}
          >
            <Form
              layout="vertical"
              onSubmitCapture={() =>
                !createdRole
                  ? createRoleMutation.mutate(createRoleData as any)
                  : updateRoleMutation.mutate({
                      ...createRoleData,
                      id: showRoleId,
                      active: true,
                    })
              }
            >
              <div className="uk-flex uk-flex-between">
                <Form.Item label="Descrição" required>
                  <Input
                    required
                    placeholder=""
                    value={createRoleData?.name}
                    onChange={(e) =>
                      setCreateRoleData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </Form.Item>

                <Form.Item label="Acesso Externo" required>
                  <Switch
                    checked={createRoleData?.externalAccess}
                    onChange={(e) =>
                      setCreateRoleData((prev) => ({
                        ...prev,
                        externalAccess: e,
                      }))
                    }
                    title="Acesso Externo"
                  />
                </Form.Item>

                {createdRole && (
                  <SelectProfiles
                    selectedProfiles={selectedProfiles}
                    setSelectedProfiles={setSelectedProfiles}
                  />
                )}
              </div>

              {createdRole && (
                <div className="uk-margin-small-top">
                  <hr />
                  {showRoleMetadataQuery.data && (
                    <div style={{ maxHeight: "370px", overflow: "auto" }}>
                      <Collapse>
                        {(
                          showRoleMetadataQuery.data.sort((a, b) =>
                            a.name.localeCompare(b.name)
                          ) ?? []
                        ).map((elem) => (
                          <Collapse.Panel
                            showArrow={false}
                            header={elem.name}
                            key={elem.id}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: "0.75rem",
                              }}
                            >
                              {elem.permissions
                                .sort((a, b) =>
                                  a.controlId.localeCompare(b.controlId)
                                )
                                .map((permission) => (
                                  <div
                                    key={permission.id}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "start",
                                      columnGap: "1rem",
                                    }}
                                  >
                                    <Switch
                                      checked={
                                        managePermissionsData.find(
                                          (p) => p.id === permission.id
                                        )?.active
                                      }
                                      onChange={(e) => {
                                        setManagePermissionsData((prev) => {
                                          const index = prev.findIndex(
                                            (p) => p.id === permission.id
                                          );
                                          if (index !== -1) {
                                            prev[index].active = e;
                                          } else {
                                            prev.push({
                                              id: permission.id,
                                              active: e,
                                            });
                                          }
                                          return [...prev];
                                        });
                                      }}
                                      title={permission.description}
                                    />
                                    <span className="">
                                      {permission.description}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </Collapse.Panel>
                        ))}
                      </Collapse>
                    </div>
                  )}
                </div>
              )}
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
                  type="ghost"
                  onClick={() => {
                    setOpenCreate(false);
                    setCreateRoleData({
                      name: "",
                      externalAccess: false,
                    });
                    setCreatedRole(false);
                    rolesQuery.refetch();
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

          <Modal
            title="Atualizar Controle de acessos"
            onCancel={() => setOpenUpdate(false)}
            visible={openUpdate}
            footer={null}
            width={1000}
          >
            <Form
              layout="vertical"
              onSubmitCapture={() => updateRoleMutation.mutate(updateRoleData)}
            >
              <div className="uk-flex uk-flex-between">
                <Form.Item label="Descrição" required className="uk-width-1-4">
                  <Input
                    required
                    className="uk-width-1-1"
                    placeholder=""
                    value={updateRoleData?.name}
                    onChange={(e) =>
                      setUpdateRoleData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Acesso Externo"
                  className="uk-margin-right"
                  required
                >
                  <Switch
                    checked={updateRoleData?.externalAccess}
                    onChange={(e) =>
                      setUpdateRoleData((prev) => ({
                        ...prev,
                        externalAccess: e,
                      }))
                    }
                    title="Acesso Externo"
                  />
                </Form.Item>
                <Form.Item label="Ativo" className="uk-margin-right" required>
                  <Switch
                    checked={updateRoleData?.active}
                    onChange={(e) =>
                      setUpdateRoleData((prev) => ({ ...prev, active: e }))
                    }
                    title="Ativo"
                  />
                </Form.Item>
                <SelectProfiles
                  selectedProfiles={selectedProfiles}
                  setSelectedProfiles={setSelectedProfiles}
                />
              </div>

              <div className="uk-margin-small-top">
                <hr />
                {showRoleMetadataQuery.data && (
                  <div style={{ maxHeight: "370px", overflow: "auto" }}>
                    <Collapse>
                      {(
                        showRoleMetadataQuery.data.sort((a, b) =>
                          a.name.localeCompare(b.name)
                        ) ?? []
                      ).map((elem) => (
                        <Collapse.Panel
                          showArrow={false}
                          header={elem.name}
                          key={elem.id}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              rowGap: "0.75rem",
                            }}
                          >
                            {elem.permissions
                              .sort((a, b) =>
                                a.controlId.localeCompare(b.controlId)
                              )
                              .map((permission) => (
                                <div
                                  key={permission.id}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "start",
                                    columnGap: "1rem",
                                  }}
                                >
                                  <Switch
                                    checked={
                                      managePermissionsData.find(
                                        (p) => p.id === permission.id
                                      )?.active
                                    }
                                    onChange={(e) => {
                                      setManagePermissionsData((prev) => {
                                        const index = prev.findIndex(
                                          (p) => p.id === permission.id
                                        );
                                        if (index !== -1) {
                                          prev[index].active = e;
                                        } else {
                                          prev.push({
                                            id: permission.id,
                                            active: e,
                                          });
                                        }
                                        return [...prev];
                                      });
                                    }}
                                    title={permission.description}
                                  />
                                  <span className="">
                                    {permission.description}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </Collapse.Panel>
                      ))}
                    </Collapse>
                  </div>
                )}
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
                <Button type="ghost" onClick={() => setOpenUpdate(false)}>
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

function SelectProfiles({ setSelectedProfiles, selectedProfiles }) {
  const { profiles } = useExternalProfiles(false);

  sortItems(profiles, "descricao");

  return (
    <div
      className="uk-width-1-2"
      style={{ borderLeft: "solid 1px #dcdcdc", paddingLeft: "20px" }}
    >
      <label>Departamentos</label>
      <div className="uk-flex uk-flex-wrap uk-margin-small-top">
        {profiles.length > 0 &&
          profiles.map((profile: any) => (
            <div className="uk-width-1-2">
              <Checkbox
                checked={selectedProfiles?.includes(profile?.idPerfil)}
                onChange={(e) => {
                  let arr = [...selectedProfiles];
                  e.target.checked
                    ? arr.push(profile?.idPerfil)
                    : (arr = arr.filter(
                        (sProfile) => sProfile !== profile.idPerfil
                      ));
                  setSelectedProfiles(arr);
                }}
              >
                {profile.descricao}
              </Checkbox>
            </div>
          ))}
      </div>
    </div>
  );
}
