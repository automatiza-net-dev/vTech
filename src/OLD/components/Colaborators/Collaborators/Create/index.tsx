// @ts-nocheck
// Core
import React, { useEffect, useState, useCallback, memo } from "react";
import { useProfile } from "@/OLD/hooks/useProfile";


//Services
import { clinicService } from "@/OLD/services/clinic.service";
import { adminService } from "@/OLD/services/admin.service";
import { userService } from "@/OLD/services/user.service";

// Utils
import Masks from "@/OLD/utils/masks";

// Components
import { Modal, Form, Select, notification, Input, Button } from "antd";
const { Item } = Form;
const { Option } = Select;

const Create = memo(function Create({
  reload,
  setReload,
  visible,
  setVisible,
}) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const { clinic } = useProfile();

  const getRoles = useCallback(() => {
    setLoading(true);
    adminService
      .getAllRoles()
      .then((res) => {
        setRoles(res.data);
      })
      .catch((err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao buscar os cargos disponíveis...",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const submitInvite = () =>
    clinicService
      .createInvite({
        business_unit_id: clinic.id,
        role_id: selectedRole,
        email: data?.email,
      })
      .then((_res) => true)
      .catch((_err) => false);

  const submitUser = useCallback(() => {
    setLoading(true);

    if (data.phone) {
      data.phone = data.phone
        .replace("(", "")
        .replace(")", "")
        .replace("-", "")
        .replace("-", "");
    }

    parseInt(data.phone);

    let error = false;

    clinicService
      .createCollaborator({ ...data, systemName: process.env.clientName })
      .then((_res) => {
        submitInvite();
        notification.success({
          message: "Colaborador cadastrado com sucesso!",
        });
      })
      .catch((err) => {
        error = true;
        setLoading(false);
        if (
          err.response.data.errors[0].message.includes("Campo já está em uso")
        ) {
          notification.error({
            message: "E-mail já está em uso",
          });
        } else {
          notification.error({
            message: err.response.data.errors[0].message,
          });
        }
      })
      .finally(() => {
        setReload(!reload);
        setLoading(false);
        if (!error) {
          setVisible(false);
          setSelectedRole();
          setData({});
        }
        error = false;
      });
  }, [data]);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  return (
    <Modal
      title="Cadastrar novo colaborador"
      visible={visible}
      onCancel={() => setVisible(false)}
      width={500}
      footer={null}
    >
      <form
        className="uk-margin-top"
        onSubmit={(e) => {
          e.preventDefault();
          submitUser();
        }}
      >
        <div>
          <label>Nome</label>
          <Input
            value={data?.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </div>
        <div className="uk-margin-top">
          <label>Cargo</label>
          <Select
            className="uk-width-1-1"
            onChange={(val) => setData({ ...data, roleId: val })}
            value={data?.roleId}
          >
            {roles.map((item, i) => (
              <Option value={item.id} key={i}>
                {item?.name}
              </Option>
            ))}
          </Select>
        </div>
        <div className="uk-margin-top">
          <label>Email</label>
          <Input
            className="uk-width-1-1"
            value={data?.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            type="email"
          />
        </div>
        <div className="uk-margin-top">
          <label>Senha</label>
          <Input
            className="uk-width-1-1"
            type="password"
            value={data?.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </div>
        <div className="uk-margin-top">
          <label>Confirme a senha</label>
          <Input
            className="uk-width-1-1"
            value={data?.password_confirmation}
            type="password"
            onChange={(e) =>
              setData({ ...data, password_confirmation: e.target.value })
            }
          />
        </div>
        <div className="uk-margin-top">
          <label>telefone</label>
          <Input
            className="uk-width-1-1"
            value={data?.phone}
            onChange={(e) =>
              setData({ ...data, phone: Masks.phone(e.target.value) })
            }
          />
        </div>
        <div className="uk-flex uk-flex-right">
          <Button
            htmlType="submit"
            loading={loading}
            type="primary"
            className="uk-margin-top"
          >
            Cadastrar
          </Button>
        </div>
      </form>
    </Modal>
  );
});

export default Create;
