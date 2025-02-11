// @ts-nocheck
import React, { useCallback } from "react";

import { Modal, Button as AntdButton } from "antd";
import { Button, useToast } from "infinity-forge";

import { adminService } from "@/OLD/services/admin.service";
import { clinicService } from "@/OLD/services/clinic.service";

import * as S from "./styles";

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

  const { createToast } = useToast();

  const handleGetRoles = React.useCallback(async () => {
    try {
      const res = await adminService.getAllRoles();
      setRoles(res.data);
    } catch (err) {
      createToast({ status: "error",  message: "Erro" })
     
    }
  }, []);

  const handleGetClinics = React.useCallback(async () => {
    try {
      const res = await clinicService.getClinicsByUser();
      setClinics(res.data);
      if (res.data.length === 1) setData({ businessUnitId: res.data[0].id });
    } catch (err) {
      createToast({ status: "error",  message: "Erro" })
    }
  }, []);

  React.useEffect(() => {
    setLoading(true);

    Promise.all([handleGetClinics(), handleGetRoles()]).then((res) => {
      setLoading(false);
    });
  }, []);


  const resendInvite = useCallback(
    (mail) => {
      setLoading(true);
      clinicService
        .resendInvite(mail)
        .then((res) => createToast({ message: "Convite reenviado!" , status: "success" })
      
        )
        .catch((_err) => {
          setData({});
          setReload(!reload);
      
          setLoading(false);
          setVisible(false);

          createToast({ status: "error", message: "Houve um erro ao reenviar o convite"  })
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
        setLoading(false);

        setReload(!reload);
        setVisible(false);
        setData({});
        return createToast({
          message: "Convite enviado com sucesso",
          status: "success",
        });
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.data?.message) {
          const message = err.response?.data?.message.split(":")[1];

          if (message?.includes("Convite já existe para o usuário")) {
            return createToast({
              message: "Usuário já convidado!",
              status: "error",
            });
          }
        }

        if (err?.response?.data?.errors?.length > 0) {
          return createToast({
            message: err.response.data.errors[0].message,
            status: "error",
          });
        }

        return createToast({
          message: "Erro ao criar convite, tente novamente mais tarde",
          status: "error",
        });
      });
  }, [data]);

  return (
    <div>
      <Button text="Novo" onClick={() => setVisible(true)} />
      <Modal
        title="Enviar convite"
        footer={null}
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <S.NewInvite>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
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
                value={data?.roleId || ""}
                onChange={(e) => {
                  setData({ ...data, roleId: e.target.value });
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
                value={data?.businessUnitId || ""}
                id="clinic"
                required
                onChange={(e) => {
                  setData({ ...data, businessUnitId: e.target.value });
                }}
              >
                <option value="">Selecione</option>
                {(clinics || []).map((clinic, key) => {
                  return (
                    <option className="uk-option" key={key} value={clinic.id}>
                      {clinic.fantasyName === ""
                        ? "Sem nome"
                        : clinic.fantasyName}
                    </option>
                  );
                })}
              </select>
            </div>
            <footer className="custom-footer">
              <Button
                text="Cancelar"
                onClick={() => {
                  setData({});
                  setVisible(false);
                }}
              />

              <Button text="Enviar" loading={loading} type="submit" />
            </footer>
          </form>
        </S.NewInvite>
      </Modal>
    </div>
  );
});
