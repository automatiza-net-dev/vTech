import React, { JSX, useCallback, useState } from "react";

import { Table } from "antd";

import { convertDate } from "@/OLD/utils/convertDate";
import { Delete } from "./Delete";
import Link from "next/link";
import { clinicService } from "@/OLD/services/clinic.service";
import { useEconomicGroup } from "@/OLD/hooks/useEconomicGroup";

import { Input } from "./styles";

import { FiEdit2 } from "react-icons/fi";

import Masks from "@/OLD/utils/masks";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { CreateCollaborator } from "@/presentation";

function Colaborators() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<{ name: JSX.Element, active: boolean }[]>([]);
  const [refreshList, setRefreshList] = useState(false);
  const [filters, setFilters] = useState({});

  const { economicGroup } = useEconomicGroup();

  const canEditColaborator = useUserHasPermission("COL02");
  const canDeleteColaborator = useUserHasPermission("COL03");

  const columnsColaborators = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Telefone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Cargo",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Criado em",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Ações",
      dataIndex: "actions",
      key: "actions",
    },
  ];

  const handleCreateTableUsers = useCallback(() => {
    setLoading(true);
    clinicService
      .getColaborators(filters)
      .then((res) => {
        if (res.data.length > 0) {
          setUsers(
            res.data.map((user) => {
              return {
                name: (
                  <Link href={`/dashboard/colaboradores/detalhes/${user.id}`}>
                    {user.name}
                  </Link>
                ),
                email: user.email,
                role: user?.roles[0]?.name,
                phone: user?.phone
                  ? Masks.phone(user?.phone)
                  : "Telefone não informado",
                createdAt: convertDate(user.created_at),
                active: user.active,
                actions: (
                  <div className="uk-flex uk-flex-middle uk-flex-around">
                    {canEditColaborator && (
                      <Link
                        href={`/dashboard/colaboradores/editar-colaborador/${user.id}`}
                      >
                        <FiEdit2 style={{ cursor: 'pointer', fontSize: '1.2rem' }} />
                      </Link>
                    )}

                    {canDeleteColaborator && (
                      <Delete
                        id={user.id}
                        setRefreshList={() => {
                          setRefreshList(!refreshList);
                        }}
                      />
                    )}
                  </div>
                ),
              };
            })
          );
        } else setUsers([]);

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [economicGroup, filters, refreshList]);

  React.useEffect(() => {
    handleCreateTableUsers();
  }, [handleCreateTableUsers, canEditColaborator, canDeleteColaborator]);

  return (
    <div className="">
      <div className="uk-margin-right uk-flex uk-flex-around">
        <Input>
          <input
            type="search"
            placeholder="Busque por nome"
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
        </Input>
        <Input>
          <input
            type="search"
            placeholder="Busque por CPF"
            onChange={(e) =>
              setFilters({ ...filters, document: e.target.value })
            }
          />
        </Input>
        <Input>
          <input
            type="search"
            placeholder="Busque por telefone"
            onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
          />
        </Input>
      </div>
      <div className="uk-margin-right uk-flex uk-flex-around">
        <Input>
          <input
            type="search"
            placeholder="Busque por cargo"
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          />
        </Input>
        <Input>
          <input type="search" placeholder="Verificar funcionalidade" />
        </Input>
        <div className="uk-margin-small-top">
          <CreateCollaborator onSuccess={() => setRefreshList(s => !s)} />
        </div>
      </div>
      <hr />
      <div className="uk-margin-medium-bottom uk-margin-medium-top">
        <Table
          columns={columnsColaborators}
          dataSource={Object.keys(filters).length === 0 ? [] : users}
          loading={loading}
          rowClassName={(record, index) =>
            `ant-table-row ant-table-row-level-0 ${!record.active ? "______table-row" : ""}`
          }
          locale={{
            emptyText:
              Object.keys(filters).length === 0 ? (
                <>Pesquise acima para exibir o resultado</>
              ) : (
                <>Nenhum resultado encontrado</>
              ),
          }}
        />
      </div>
    </div>
  );
}

export default Colaborators;
