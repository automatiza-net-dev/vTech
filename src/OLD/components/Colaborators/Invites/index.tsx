// @ts-nocheck
import React, { useState, useEffect, useCallback } from "react";

import { Table } from "antd";

import { clinicService } from "@/OLD/services/clinic.service";
import { convertDate } from "@/OLD/utils/convertDate";
import { Delete } from "./Delete";
import { NewInvite } from "./NewInvite";
import EditInvite from "./Update";
import { Input } from "./styles";

// Icons
import { EditTwoTone } from "@ant-design/icons";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

export const Invites = React.memo(function Invites() {
  const [invitesPending, setInvitesPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [editVisible, setEditVisible] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [reload, setReload] = useState(true);

  const canCreateInvite = useUserHasPermission("COL08");
  const canEditInvite = useUserHasPermission("COL09");
  const canDeleteInvite = useUserHasPermission("COL10");

  const columnsInvites = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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

  const handleCreateTableInvites = useCallback(() => {
    setLoading(true);
    clinicService
      .getInvites({ filters })
      .then((res) => {
        if (res.data.length > 0) {
          setInvitesPending(
            res.data.map((invite, i) => {
              return {
                id: invite?.id,
                email: invite.email,
                role: invite?.role ? user.role : "--------",
                createdAt: convertDate(invite.created_at),
                actions: (
                  <div
                    key={`collab-box${i}`}
                    className="uk-flex uk-flex-middle"
                    style={{ gap: 14 }}
                  >
                    {canEditInvite && (
                      <EditTwoTone
                        onClick={() => {
                          setSelectedId(invite.id);
                          setEditVisible(true);
                        }}
                      />
                    )}

                    {canDeleteInvite && (
                      <Delete
                        id={invite.id}
                        setReload={setReload}
                        reload={reload}
                      />
                    )}
                  </div>
                ),
              };
            })
          );
        }
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [reload, filters]);

  useEffect(() => {
    handleCreateTableInvites();
  }, [handleCreateTableInvites, canEditInvite, canDeleteInvite]);

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
            placeholder="Busque por email"
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
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
          <input
            type="search"
            placeholder="Busque por clinica"
            onChange={(e) => setFilters({ ...filters, unit: e.target.value })}
          />
 
        </Input>
        <div className="uk-margin-small-top">
          {canCreateInvite && (
            <NewInvite
              reload={reload}
              setReload={setReload}
              allInvites={invitesPending}
            />
          )}
        </div>
      </div>
      <hr />
      <div className="">
        <Table
          columns={columnsInvites}
          dataSource={invitesPending}
          loading={loading}
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
      <EditInvite
        id={selectedId}
        visible={editVisible}
        setVisible={setEditVisible}
        reload={reload}
        setReload={setReload}
      />
    </div>
  );
});
