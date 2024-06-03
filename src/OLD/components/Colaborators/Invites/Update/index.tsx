// @ts-nocheck
// Core
import React, { useEffect, useState, memo, useCallback } from "react";

// Components
import { Modal, notification } from "antd";
import { Button } from "@/OLD/components/mini-components/Button";

//Services
import { clinicService } from "@/OLD/services/clinic.service";
import { adminService } from "@/OLD/services/admin.service";

const EditInvite = memo(function EditInvite({
  id,
  visible,
  setVisible,
  reload,
  setReload,
}) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [clinics, setClinics] = useState([]);

  const getInvite = useCallback(() => {
    setLoading(true);
    clinicService
      .getInvites(false, id)
      .then((res) => setData(res.data))
      .catch((err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um problema ao exibir as informações do convite",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const getAllRoles = useCallback(() => {
    setLoading(true);
    adminService
      .getAllRoles()
      .then((res) => setRoles(res.data))
      .catch((_err) => {
        setLoading(false);
        notification.error({
          message: "Houve um problema ao buscar os cargos disponíveis",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const getUnits = useCallback(() => {
    setLoading(true);
    clinicService
      .getClinicsByUser()
      .then((res) => setClinics(res.data))
      .catch(() => {
        return notification.error({
          message: "Houve um problema ao buscar as unidades disponíveis...",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const submitUpdate = useCallback(() => {
    setLoading(true);

    delete data?.active;
    delete data?.created_at;
    delete data?.id;
    delete data?.updated_at;
    delete data?.user_id;

    clinicService
      .updateInvite(id, data)
      .then((_res) => {
        return notification.success({
          message: "Convite atualizado com sucesso!",
        });
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao atualizar o convite...",
        });
      })
      .finally(() => {
        setLoading(false);
        setReload(!reload);
        setVisible(false);
      });
  }, [id, data]);

  useEffect(() => {
    getInvite();
    getAllRoles();
    getUnits();
  }, [getInvite, getAllRoles, getUnits]);

  return (
    <Modal visible={visible} onCancel={() => setVisible(false)} footer={null}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitUpdate();
        }}
      >
        <div className="uk-margin">
          <label htmlFor="email">Email</label>
          <input
            className="uk-input"
            id="email"
            required
            placeholder="exemplo@proverdor.com"
            value={data?.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>
        <div className="uk-margin">
          <label htmlFor="role">Selecione o cargo</label>
          <select
            className="uk-select"
            id="role"
            required
            onChange={(e) => {
              setData({ ...data, role_id: e.target.value });
            }}
          >
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
            id="clinic"
            required
            onChange={(e) => {
              setData({ ...data, business_unit_id: e.target.value });
            }}
          >
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
        <div className="uk-flex uk-flex-right uk-margin-top">
          <Button id="submit-button" type="submit">
            Atualizar
          </Button>
        </div>
      </form>
    </Modal>
  );
});

export default EditInvite;
