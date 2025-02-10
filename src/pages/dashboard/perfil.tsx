import React, { useState, useEffect, useCallback } from "react";

import cep from "cep-promise";
import styled from "styled-components";
import { Input, Select, AutoComplete } from "antd";

import { Button, useToast } from "infinity-forge";
import { places } from "@/OLD/utils/places";
import { useProfile } from "@/OLD/hooks/useProfile";
import { userService } from "@/OLD/services/user.service";

import { LayoutDashboard } from "@/presentation";

const { Option } = Select;

export default function PerfilPage() {
  const [edit, setEdit] = useState(false);
  const [states, setStates] = useState<any>([]);
  const [cities, setCities] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const [reload, setReload] = useState<any>(false);
  const [data, setData] = useState<any>({});
  const { user } = useProfile(reload);

  const {createToast} = useToast()

  const getAddress = (cepData) => {
    setLoading(true);
    cep(cepData)
      .then((res) => {
        setData({
          ...data,
          postalCode: res.cep,
          address: res?.street,
          district: res?.neighborhood,
          state: res.state,
          city: res.city,
        });
      })
      .catch((_err) => {
        setLoading(false);

        return createToast({ status: "error", message:  "Não foi possível localizar o cep informado!"})
      });
  };

  useEffect(() => {
    setData({
      name: user?.name,
      active: user?.active,
      address: user?.address,
      complement: user?.complement,
      district: user?.district,
      document: user?.document,
      email: user?.email,
      number: user?.number,
      phone: user?.phone,
      postalCode: user?.postal_code,
      state: user?.state,
      city: user?.city,
    });
  }, [user]);

  useEffect(() => {
    setStates(places);
    if (data.state) {
      setCities(places?.find((item) => item.value === data.state)?.cities);
    }
  }, [places, data]);

  const submitUpdate = useCallback(() => {
    setLoading(true);
    userService
      .updateLoggedUser(data)
      .then((_res) =>

        createToast({ status: "success", message:  "Informações atualizadas com sucesso!"})
      )
      .catch((_err) => {
        setLoading(false);
      
        return createToast({ status: "error", message:  "Houve um erro ao atualizar as informações, verifique os campos informados"})
      })
      .finally(() => {
        setLoading(false);
        setEdit(false);
        setReload(!reload);
      });
  }, [data]);

  return (
    <LayoutDashboard>
      <Container className="uk-padding">
        <h3 className="uk-margin-remove">Perfil</h3>
        <section className="uk-padding body-page uk-margin-top">
          <div>
            <h5 className="uk-margin-remove">Dados</h5>
            <hr />
            <div className="uk-flex">
              <div className="uk-margin-right uk-width-1-3">
                <label>Nome</label>
                <Input
                  value={data?.name}
                  disabled={!edit}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
              </div>
              <div className="uk-width-1-3 uk-margin-right">
                <label>Documento</label>
                <Input
                  value={data?.document}
                  disabled={!edit}
                  onChange={(e) =>
                    setData({ ...data, document: e.target.value })
                  }
                  type="number"
                />
              </div>
              <div className="uk-width-1-3">
                <label>Email</label>
                <Input disabled={true} value={data?.email} />
              </div>
            </div>
          </div>
          <div className="uk-margin-top">
            <h5 className="uk-margin-remove">Endereço</h5>
            <hr />
            <div className="uk-margin-top uk-flex">
              <div className="uk-width-1-5 uk-margin-right">
                <label>Cep</label>
                <Input
                  className=""
                  value={data?.postalCode}
                  disabled={!edit}
                  onChange={(e) => {
                    setData({ ...data, postalCode: e.target.value });
                    const cepData = e.target.value.replace("-", "");
                    cepData.length === 8 ? getAddress(cepData) : null;
                  }}
                />
              </div>
              <div className="uk-width-1-4 uk-margin-right">
                <label>Rua</label>
                <Input
                  disabled={!edit}
                  value={data?.address}
                  onChange={(e) =>
                    setData({ ...data, address: e.target.value })
                  }
                />
              </div>
              <div className="uk-width-1-5 uk-margin-right">
                <label>Número</label>
                <Input
                  disabled={!edit}
                  value={data?.number}
                  onChange={(e) => setData({ ...data, number: e.target.value })}
                />
              </div>
              <div className="uk-width-1-4 uk-margin-right">
                <label>Complemento</label>
                <Input
                  disabled={!edit}
                  value={data?.complement}
                  onChange={(e) =>
                    setData({ ...data, complement: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="uk-flex uk-margin-top">
              <div className="uk-width-1-4 uk-margin-right">
                <label>Bairro</label>
                <Input
                  disabled={!edit}
                  value={data?.district}
                  onChange={(e) =>
                    setData({ ...data, district: e.target.value })
                  }
                />
              </div>
              <div className="uk-width-1-3 uk-margin-right">
                <label>Estado</label>
                <Select
                  disabled={!edit}
                  onChange={(e) => setData({ ...data, state: e })}
                  value={data?.state}
                  className="uk-width-1-1"
                >
                  {states.length > 0 &&
                    states.map((item, i) => (
                      <Option value={item.value} key={i}>
                        {item.value}
                      </Option>
                    ))}
                </Select>
              </div>
              <div className="uk-width-1-3 uk-margin-right">
                <label>Cidade</label>
                <AutoComplete
                  disabled={!edit}
                  className="uk-width-1-1"
                  value={data?.city}
                  options={cities}
                  onSelect={(e) => setData({ ...data, city: e })}
                  onChange={(e) => setData({ ...data, city: e })}
                  filterOption={(inputValue, option) =>
                    (option as any).label
                      .toUpperCase()
                      .includes(inputValue.toUpperCase())
                      ? option
                      : (null as any)
                  }
                />
              </div>
            </div>
          </div>
          <hr />
          <footer className="uk-margin-top uk-flex uk-flex-right">
            <Button
              onClick={() => {
                edit ? submitUpdate() : setEdit(true);
              }}
              text={edit ? "Salvar" : "Editar"}
            />
          </footer>
        </section>
      </Container>
    </LayoutDashboard>
  );
}

export const Container = styled.div`
  .body-page {
    background-color: #ffffff;
    border-radius: 5px;
  }
`;
