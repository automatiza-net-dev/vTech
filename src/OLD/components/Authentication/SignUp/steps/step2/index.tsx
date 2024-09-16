import React, { useCallback, useState } from "react";

import { useRouter } from "next/router";

import { notification } from "antd";

import api from "@/OLD/services";
import Masks from "@/OLD/utils/masks";
import { Button } from "infinity-forge";

export function Step2(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ phone?: string; name?: string }>({});

  const router = useRouter();

  const sendToken = useCallback(async () => {
    await api
      ?.post("/users/send-confirmation", {
        email: props?.data?.email,
        phone: data?.phone,
        name: data?.name,
      })
      .catch((err) => {
        err?.response?.data?.errors?.map((error) => {
          if (error?.message.includes("Campo já está em uso")) {
            notification.error({
              message:
                "Email já em uso, faça login ou verifique o e-mail informado",
            });
            props.setStep(1);
          }
        });
      });
  }, [props?.data, data]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLoading(true);
      if (
        data.name &&
        data.name.length > 0 &&
        data.phone &&
        data.phone.length > 14
      ) {
        sendToken();
        props.setData({
          ...props.data,
          name: data.name,
          phone: data.phone,
        });
        props.setStep(3);
      } else {
        notification.error({
          message: "Erro",
          description: "Por favor, preencha todos os campos corretamente",
        });
      }

      setLoading(false);
    },
    [data, props]
  );

  return (
    <div>
      <h3 style={{ color: "#ffffff" }}>
        Olá <strong>{props?.data?.email}</strong>, nos conte um pouco mais sobre
        você.
      </h3>
      <h4 className="uk-margin-remove" style={{ color: "#ffffff" }}>
        Estas informações serão usadas para entrarmos em contato.
      </h4>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className={"uk-flex uk-flex-column uk-margin-top"}
      >
        <div className="uk-margin-small uk-flex uk-flex-column">
          <label htmlFor="name">Nome</label>
          <input
            className="uk-input uk-width-1-2"
            type="text"
            id="name"
            onChange={(e) => setData({ ...data, name: e.target.value })}
            required
            minLength={2}
          />
        </div>

        <div className="uk-margin-bottom uk-flex uk-flex-column">
          <label htmlFor="phone">Telefone</label>
          <input
            className="uk-input uk-width-1-2"
            type="text"
            id="phone"
            minLength={14}
            maxLength={15}
            value={data.phone}
            onChange={(e) =>
              setData({ ...data, phone: Masks.phone(e.target.value) })
            }
            required
          />
        </div>
        <footer>
          <div>
            <Button
              onClick={() => props.setStep((prev) => prev - 1)}
              text="Voltar"
            />

            <Button
              type="submit"
              text={loading ? "Carregando..." : "Próximo"}
            />
          </div>
          <div className="uk-margin-top">
            <span className="uk-link" onClick={() => router.push("/")}>
              Já possuo conta
            </span>
          </div>
        </footer>
      </form>
    </div>
  );
}
