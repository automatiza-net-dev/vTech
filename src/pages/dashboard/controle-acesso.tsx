import { useEffect, useState, useCallback } from "react";

import {
  Form,
  Input,
  Modal,
  Table,
  Switch,
  Checkbox,
  Collapse,
  Skeleton,
  Popconfirm,
} from "antd";
import moment from "moment";
import "moment/locale/pt-br";
import { BiDuplicate } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";

import { Button, PageWrapper, useToast } from "infinity-forge";
import { sortItems } from "@/OLD/utils/sortItems";
import AccessDenied from "@/OLD/components/AccessDenied";
import { adminService } from "@/OLD/services/admin.service";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { EditTwoTone, DeleteOutlined } from "@ant-design/icons";
import { useExternalProfiles } from "@/OLD/hooks/useExternalProfile";
import { useSearchProfileInfo } from "@/OLD/hooks/useExternalProfile";

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
  const [updateRoleData, setUpdateRoleData] = useState<{
    name?: string;
    externalAccess?: boolean;
    active?: boolean;
  }>({});

  const [loading, setLoading] = useState(false);
  const [roleMetadataParams, setRoleMetadataParams] = useState<{
    newItems?: boolean | undefined;
  }>({});
  const [createdRole, setCreatedRole] = useState(false);
  const [rolesConfigVisible, setRolesConfigVisible] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);

  const [searchRoleParams, setSearchRoleParams] = useState({});

  const { info } = useSearchProfileInfo(searchRoleParams);
  const { createToast } = useToast();

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

  // profileAccessIdList: selectedProfiles,

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
    queryKey: ["role", "metadata", showRoleId, roleMetadataParams],
    queryFn: () =>
      adminService
        .getRoleMetadata(showRoleId, roleMetadataParams)
        .then(({ data }) => data),
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
        if (err?.response?.data?.errors) {
          return createToast({
            message: err?.response?.data?.errors?.[0]?.message,
            status: "error",
          });
        }
      },
    }
  );

  const updateRoleMutation = useMutation(
    (data: any) =>
      adminService.editRole(data.id, {
        ...data,
        profileAccessIdList: selectedProfiles,
      }),
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
        if (err?.response?.data?.errors) {
          return createToast({
            message: err?.response?.data?.errors?.[0]?.message,
            status: "error",
          });
        }
      },
    }
  );

  const deleteRoleMutation = useMutation((id) => adminService.deleteRole(id), {
    onSuccess: () => {
      rolesQuery.refetch();
    },
    onError: (err: any) => {
      if (err?.response?.data?.errors) {
        return createToast({
          message: err?.response?.data?.errors?.[0]?.message,
          status: "error",
        });
      }
    },
  });

  const addRolePermissionsMutation = useMutation(
    (data) => adminService.addPermissionToRole(data),
    {
      onSuccess: () => {
        showRoleMetadataQuery.refetch();
      },
      onError: (err: any) => {
        if (err?.response?.data?.errors) {
          return createToast({
            message: err?.response?.data?.errors?.[0]?.message,
            status: "error",
          });
        }
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
        showRoleMetadataQuery.refetch();
        rolesQuery.refetch();
      },
      onError: (err: any) => {
        if (err?.response?.data?.errors) {
          return createToast({
            message: err?.response?.data?.errors?.[0]?.message,
            status: "error",
          });
        }
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
        createToast({
          message: "Controle copiado com sucesso!",
          status: "success",
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
      <PageWrapper title="Controle de Acesso">
        {!listAccessControllPermission ||
        listAccessControllPermission === "loading" ? (
          <AccessDenied loading={listAccessControllPermission} />
        ) : (
          <section className="uk-padding">
            <div>
              <div>
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
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "10px",
              }}
            >
              {canCreateAccess && (
                <Button
                  onClick={() => {
                    setOpenCreate(true);
                    setSelectedProfiles([]);
                  }}
                  text="Cadastrar"
                />
              )}
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
                            <>
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
                                  setRoleMetadataParams({});
                                  setOpenUpdate(true);
                                  setShowRoleId(elem.id);
                                }}
                                disabled={isDisabled}
                              />
                              {elem.newItems && (
                                <svg
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setUpdateRoleData((prev) => ({
                                      ...prev,
                                      id: elem.id,
                                      name: elem.name,
                                      active: elem.active,
                                      externalAccess: elem.external_access,
                                    }));
                                    setShowRoleId(elem.id);
                                    setRoleMetadataParams({
                                      newItems: elem.newItems,
                                    });
                                    setOpenUpdate(true);
                                  }}
                                  id="Layer_1"
                                  height="20"
                                  viewBox="0 0 512 512"
                                  width="20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g>
                                    <path d="m272.066 193.462h-56.233c-7.333 0-13.59 5.301-14.796 12.534l-16.067 96.4c-1.525 9.144 5.54 17.466 14.796 17.466h56.234c19.902-.793 19.887-29.215 0-30h-38.526l3.033-18.2h35.493c19.902-.793 19.887-29.215 0-30h-30.493l3.033-18.2h43.526c19.902-.793 19.887-29.215 0-30z" />
                                    <path d="m162.066 193.666c-8.172-1.36-15.9 4.158-17.262 12.33l-8.483 50.9-27.571-55.142c-2.906-5.811-9.218-9.09-15.647-8.125-6.425.966-11.498 5.959-12.565 12.368l-16.067 96.4c-1.362 8.171 4.158 15.9 12.33 17.262 11.646 1.941 16.565-8.151 17.262-12.33l8.483-50.9 27.571 55.142c2.906 5.812 9.224 9.089 15.647 8.125 6.425-.966 11.498-5.959 12.565-12.368l16.067-96.4c1.362-8.172-4.158-15.9-12.33-17.262z" />
                                    <path d="m439.441 195.045c-7.41-3.705-16.419-.701-20.124 6.708l-28.649 57.297-7.492-37.464c-1.216-6.077-6.043-10.78-12.148-11.838-6.103-1.055-12.234 1.748-15.423 7.062l-20.338 33.896v-42.246c-.793-19.902-29.215-19.887-30 0v96.4c.118 15.155 19.955 20.66 27.862 7.717l28.238-47.063 8.457 42.288c1.257 6.283 6.366 11.075 12.718 11.925 6.351.855 12.542-2.427 15.407-8.159l48.2-96.4c3.705-7.408.703-16.418-6.708-20.123z" />
                                    <path d="m256 .662c-141.159 0-256 114.841-256 256 14.062 339.619 497.99 339.52 512-.002 0-141.157-114.841-255.998-256-255.998zm0 482c-124.617 0-226-101.383-226-226 12.414-299.82 439.632-299.733 452 .002 0 124.615-101.383 225.998-226 225.998z" />
                                  </g>
                                </svg>
                              )}
                            </>
                          )}

                          <BiDuplicate
                            onClick={() => submitDuplicatePermission(elem?.id)}
                            color="var(--darkBlue)"
                            size={15}
                            style={{ cursor: "pointer" }}
                          />

                          {canDeleteAccess && (
                            <DeleteOutlined
                              onClick={() => {
                                deleteRoleMutation.mutate(elem.id);
                              }}
                              size={15}
                              disabled={isDisabled}
                            />
                          )}
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

                      if (
                        a.description?.toLowerCase() > b.name?.toLowerCase()
                      ) {
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
                    ? createRoleMutation.mutate({
                        ...createRoleData,
                        profileAccessIdList: selectedProfiles,
                      } as any)
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

                  <SelectProfiles
                    selectedProfiles={selectedProfiles}
                    setSelectedProfiles={setSelectedProfiles}
                  />
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
                    onClick={() => {
                      setOpenCreate(false);
                      setCreateRoleData({
                        name: "",
                        externalAccess: false,
                      });
                      setCreatedRole(false);
                      rolesQuery.refetch();
                    }}
                    text="Cancelar"
                  />

                  <Button type="submit" text="Salvar" />
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
                onSubmitCapture={() =>
                  updateRoleMutation.mutate(updateRoleData)
                }
              >
                <div className="uk-flex uk-flex-between">
                  <Form.Item
                    label="Descrição"
                    required
                    className="uk-width-1-4"
                  >
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
                  <Button
                    onClick={() => setOpenUpdate(false)}
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
