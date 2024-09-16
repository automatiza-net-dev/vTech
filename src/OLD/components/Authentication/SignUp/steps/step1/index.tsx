import React, { useCallback, useState } from "react";

import { useRouter } from "next/router";

import api from "@/OLD/services";
import { Button } from "infinity-forge";

export function Step1(props) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ email?: string }>({});

  const router = useRouter();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      await api
        ?.get(`/users/check-email/${data.email}`)
        .then((res) => {
          if (res.data?.inUse) {
            setError(true);
          } else {
            props.setData({
              email: data.email,
            });
            props.setStep((prv) => prv + 1);
          }
        })
        .catch((err) => console.log(err.response))
        .finally(() => setLoading(false));
    },
    [data]
  );

  return (
    <div>
      {error ? (
        <>
          <h3 style={{ color: "#ffffff" }}>
            Olá <strong>{data?.email}</strong>
          </h3>
          <h3 style={{ color: "#ffffff" }}>
            Encontramos em nosso sistema um cadastro já existente para esse
            e-mail.
          </h3>
          <h3 className="uk-margin-medium-bottom">
            Acesse sua clinica fazendo login no sistema
          </h3>
          <Button
            text={loading ? "Carregando..." : "Logar"}
            onClick={() => router.push("/")}
          />
        </>
      ) : (
        <>
          <h3 style={{ color: "#ffffff" }}>
            Ótimo! Agora conte um pouco sobre você. Utilizaremos estas
            informações para entrar em contato.
          </h3>
          <form onSubmit={handleSubmit} className={"uk-flex uk-flex-column"}>
            <label htmlFor="email">Email</label>
            <input
              className={`uk-input ${
                error ? "uk-form-danger" : ""
              } uk-width-1-2 uk-margin-bottom`}
              type="email"
              id="email"
              value={data?.email}
              onChange={(e) =>
                setData((state) => ({ ...state, email: e.target.value }))
              }
              required
            />

            <footer>
              <div>
                <Button
                  text={loading ? "Carregando..." : "Próximo"}
                  type="submit"
                />
              </div>
              <div className="uk-margin-top uk-text-center uk-width-1-4">
                <span className="uk-link" onClick={() => router.push("/")}>
                  Já possuo conta
                </span>
              </div>
            </footer>
          </form>
        </>
      )}
    </div>
  );
}
