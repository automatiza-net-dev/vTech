// @ts-nocheck
import React, { useRef, useCallback } from "react";

import { Modal, notification, Button as AntdButton } from "antd";
import { Button } from "@/OLD/components/mini-components";

import { useProfile } from "@/OLD/hooks/useProfile";
import { adminService } from "@/OLD/services/admin.service";
import { clinicService } from "@/OLD/services/clinic.service";

export const NewInvite = React.memo(function Colaborators({
  reload,
  setReload,
  allInvites,
}) {
  const [visible, setVisible] = React.useState(false);
  const [data, setData] = React.useState({});
  const [roles, setRoles] = React.useState([]);
  const [clinics, setClinics] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleGetRoles = React.useCallback(async () => {
    try {
      const res = await adminService.getAllRoles();
      setRoles(res.data);
    } catch (err) {
      notification.error({
        message: "Erro",
        description: "Erro ao buscar os cargos",
      });
    }
  }, []);

  const handleGetClinics = React.useCallback(async () => {
    try {
      const res = await clinicService.getClinicsByUser();
      setClinics(res.data);
      if (res.data.length === 1) setData({ business_unit_id: res.data[0].id });
    } catch (err) {
      notification.error({
        message: "Erro",
        description: "Erro ao buscar as clinicas",
      });
    }
  }, []);

  React.useEffect(() => {
    setLoading(true);

    Promise.all([handleGetClinics(), handleGetRoles()]).then((res) => {
      setLoading(false);
    });
  }, []);

  const resendInviteStructure = () => (
    <div>
      <label>Deseja reenviar o convite?</label>
      <div>
        <AntdButton
          onClick={() => notification.destroy()}
          className="uk-margin-small-right"
        >
          Não
        </AntdButton>
        <AntdButton
          type="primary"
          onClick={() =>
            resendInvite(
              allInvites.find((invite) => invite?.email === data?.email)?.id
            )
          }
        >
          Sim
        </AntdButton>
      </div>
    </div>
  );

  const resendInvite = useCallback(
    (mail) => {
      setLoading(true);
      clinicService
        .resendInvite(mail)
        .then((res) =>
          notification.success({ description: "Convite reenviado!" })
        )
        .catch((_err) =>
          notification.error({
            description: "Houve um erro ao reenviar o convite",
          })
        )
        .finally(() => {
          setData({});
          setReload(!reload);
          notification.destroy();
          setLoading(false);
          setVisible(false);
        });
    },
    [data?.email]
  );

  const handleSubmit = React.useCallback(() => {
    setLoading(true);
    let error = false;
    clinicService
      .createInvite(data)
      .then(() => {
        notification.success({
          message: "Sucesso",
          description: "Convite enviado com sucesso",
        });
      })
      .catch((err) => {
        error = true;
        const message = err.response?.data?.message.split(":")[1];

        if (message.includes("Convite já existe para o usuário")) {
          return notification.warning({
            duration: null,
            message: "Usuário já convidado",
            description: resendInviteStructure(),
          });
        }

        return notification.error({
          message: "Erro",
          description: "Erro ao criar convite, tente novamente mais tarde",
        });
      })
      .finally(() => {
        if (!error) {
          setReload(!reload);
          setVisible(false);
          setData({});
        }
      });
    setLoading(false);
  }, [data]);

  return (
    <div>
      <Button onClick={() => setVisible(true)}>Novo</Button>

      <Modal
        loading={loading}
        title="Enviar convite"
        okText="Enviar"
        cancelText="Cancelar"
        visible={visible}
        onOk={() => {
          document.getElementById("submit-button").click();
        }}
        onCancel={() => {
          setData({});
          setVisible(false);
        }}
        confirmLoading={loading}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="uk-margin">
            <label htmlFor="email">Email</label>
            <input
              className="uk-input"
              id="email"
              type="email"
              required
              value={data?.email || ""}
              placeholder="exemplo@proverdor.com"
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>
          <div className="uk-margin">
            <label htmlFor="role">Selecione o cargo</label>
            <select
              className="uk-select"
              id="role"
              required
              value={data?.role_id || ""}
              onChange={(e) => {
                setData({ ...data, role_id: e.target.value });
              }}
            >
              <option value="">Selecione</option>
              {roles?.map((role, key) => {
                return (
                  <option className="uk-option" key={key} value={role.id}>
                    {role.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="uk-margin">
            <label htmlFor="clinic">Selecione a clinica</label>
            <select
              className="uk-select"
              value={data?.business_unit_id || ""}
              id="clinic"
              required
              onChange={(e) => {
                setData({ ...data, business_unit_id: e.target.value });
              }}
            >
              <option value="">Selecione</option>
              {(clinics || []).map((clinic, key) => {
                return (
                  <option className="uk-option" key={key} value={clinic.id}>
                    {clinic.fantasy_name === ""
                      ? "Sem nome"
                      : clinic.fantasy_name}
                  </option>
                );
              })}
            </select>
          </div>
          <input id="submit-button" type="submit" style={{ display: "none" }} />
        </form>
      </Modal>
    </div>
  );
});
