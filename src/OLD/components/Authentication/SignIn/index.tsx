import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

import { useAuthAdmin, Button, useToast, api, cookies } from "infinity-forge";
import { Modal, Radio, Button as AntdButton } from "antd";

import { sessionService } from "@/OLD/services/session.service";

import { Container } from "./styles";
import { useConfigurationsSystem } from "@/presentation";

export function SignIn() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    ip: "",
  });
  const [saveAccess, setSaveAccess] = useState(false);
  const [unitGroups, setUnitGroups] = useState<any[] | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState("");

  const { createToast } = useToast();
  const { loadUser } = useAuthAdmin();
  const { name } = useConfigurationsSystem()

  useEffect(() => {
    if (process.browser) {
      (async () => {
        const ip = await api({ url: "ip", method: "get" }, "/api/");

        if (ip) {
          setData((prev) => ({ ...prev, ip }));
        }
      })();
    }
  }, []);

  const finishLogin = useCallback(
    async (token?: string, message?: string) => {
      if (message) {
        return createToast({ status: "error", message });
      }

      await cookies.set("token", { value: token ?? null });
      await loadUser({ roleName: "user" });
    },
    [createToast, loadUser]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (data.email === "" || data.password === "") {
        createToast({
          status: "error",
          message: "Por favor, preencha todos os campos",
        });
        return;
      }

      setLoading(true);

      try {
        const systemUrl = new URL(window.location.origin).origin;

        const response = await sessionService.login({
          ...data,
          systemUrl,
          system: name,
        });

        // usuário tem mais de uma unidade de negócio: precisa escolher antes de logar
        if (Array.isArray(response.data)) {
          setUnitGroups(response.data);
          return;
        }

        await finishLogin(response.data?.token, response.data?.message);
      } catch (err: any) {
        createToast({
          status: "error",
          duration: 7500,
          message:
            err?.response?.data?.message ||
            "Erro ao logar. Por favor, tente novamente mais tarde.",
        });
      } finally {
        setLoading(false);
      }
    },
    [data, finishLogin, name]
  );

  const handleChooseUnit = useCallback(async () => {
    setLoading(true);

    try {
      const systemUrl = new URL(window.location.origin).origin;

      const response = await sessionService.login({
        ...data,
        systemUrl,
        system: name,
        business_unit_id: selectedUnitId,
      });

      await finishLogin(response.data?.token, response.data?.message);
    } catch (err: any) {
      createToast({
        status: "error",
        duration: 7500,
        message:
          err?.response?.data?.message ||
          "Erro ao logar. Por favor, tente novamente mais tarde.",
      });
    } finally {
      setLoading(false);
    }
  }, [data, finishLogin, name, selectedUnitId]);

  const closeChooseUnit = useCallback(() => {
    setUnitGroups(null);
    setSelectedUnitId("");
  }, []);

  const { home_image_url } = useConfigurationsSystem();

  return (
    <Container>
      <img
        className="uk-margin-xlarge-right"
        src={home_image_url}
        width="500"
      />
      
      <div className="left-side">
        <div className="uk-card uk-card-default uk-card-body uk-width-1-1 border-radius">
          <form onSubmit={(e) => handleSubmit(e)}>
            <span style={{ fontSize: "16px" }}>Email</span>
            <input
              id="email"
              type="email"
              className="uk-input uk-margin-bottom"
              required
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />

            <span style={{ fontSize: "16px" }}>Senha</span>
            <input
              id="password"
              type="password"
              className="uk-input uk-margin-bottom"
              required
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <div className="uk-flex uk-flex-column">
              <div className="uk-margin-bottom uk-flex uk-flex-between">
                <div className="checkbox">
                  <input
                    id="save-access"
                    type="radio"
                    className="uk-radio uk-margin-small-right"
                    checked={saveAccess}
                    onClick={() => setSaveAccess(!saveAccess)}
                  />
                  <span style={{ fontSize: "14px" }}>Permanecer logado </span>
                </div>
                <Link href="/senha/esqueci">Esqueci minha senha</Link>
              </div>

              <Button
                type="submit"
                text="Entrar"
                loading={loading}
                style={{ width: "100%", borderRadius: "25px" }}
              />

              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <Link href="/admin">Área do franqueador</Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Modal
        title="Selecione a unidade"
        visible={!!unitGroups}
        footer={null}
        onCancel={closeChooseUnit}
      >
        <Radio.Group
          className="uk-flex uk-flex-column"
          value={selectedUnitId}
          onChange={(e) => setSelectedUnitId(e.target.value)}
        >
          {unitGroups?.flatMap((group) =>
            group.businessUnits.map((unit) => (
              <Radio
                key={unit.id}
                className="uk-width-1-1 uk-margin-small-bottom"
                value={unit.id}
              >
                {unit.identification}
                {unitGroups.length > 1 ? ` (${group.companyName})` : ""}
              </Radio>
            ))
          )}
        </Radio.Group>
        <hr />
        <footer className="uk-flex uk-flex-right">
          <AntdButton
            type="primary"
            className="uk-margin-small-right"
            loading={loading}
            disabled={!selectedUnitId}
            onClick={handleChooseUnit}
          >
            Entrar
          </AntdButton>
          <AntdButton onClick={closeChooseUnit}>Cancelar</AntdButton>
        </footer>
      </Modal>
    </Container>
  );
}
