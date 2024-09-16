// @ts-nocheck
// Core
import React, { useEffect, useState, memo, useCallback } from "react";

// Components
import { Modal } from "antd";
import { useToast, Button } from "infinity-forge";

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

  const { createToast } = useToast();

  const getInvite = useCallback(() => {
    setLoading(true);
    clinicService
      .getInvites(false, id)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setLoading(false);
        return createToast({
          message: "Houve um problema ao exibir as informações do convite",
          status: "error",
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
      .then((res) => {
        setRoles(res.data);
        setLoading(false);
      })
      .catch((_err) => {
        setLoading(false);
        return createToast({
          message: "Houve um problema ao buscar os cargos disponíveis",
          status: "error",
        });
      });
  }, []);

  const getUnits = useCallback(() => {
    setLoading(true);
    clinicService
      .getClinicsByUser()
      .then((res) => {
        setLoading(false);
        setClinics(res.data);
      })
      .catch(() => {
        setLoading(false);
        return createToast({
          message: "Houve um problema ao buscar as unidades disponíveis...",
          status: "error",
        });
      });
  }, []);

  const submitUpdate = useCallback(() => {
    setLoading(true);

    delete data?.active;
    delete data?.created_at;
    delete data?.id;
    delete data?.updated_at;
    delete data?.userId;

    clinicService
      .updateInvite(id, data)
      .then((_res) => {
        setLoading(false);
        setReload(!reload);
        setVisible(false);
        return createToast({
          message: "Convite atualizado com sucesso!",
          status: "success",
        });
      })
      .catch((err) => {
        setLoading(false);

        return createToast({
          message: "Houve um erro ao atualizar o convite...",
          status: "error",
        });
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
            disabled
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
              setData({ ...data, roleId: e.target.value });
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
              setData({ ...data, businessUnitId: e.target.value });
            }}
          >
            {(clinics || []).map((clinic, key) => {
              return (
                <option className="uk-option" key={key} value={clinic.id}>
                  {clinic.fantasyName === "" ? "Sem nome" : clinic.fantasyName}
                </option>
              );
            })}
          </select>
        </div>
        <div className="uk-flex uk-flex-right uk-margin-top">
          <Button id="submit-button" type="submit" text="Atualizar" />
        </div>
      </form>
    </Modal>
  );
});

export default EditInvite;
