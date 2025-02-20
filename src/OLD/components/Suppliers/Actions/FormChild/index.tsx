// @ts-nocheck
import React, { memo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { usePlans } from "@/OLD/hooks/usePlans";

import { Container } from "./styles";
import {
  Upload,
  Input,
  Switch,
  Select,
  AutoComplete,
} from "antd";
import { Button, useToast } from "infinity-forge";
const { Option } = Select;

const ImgCrop = dynamic(() => import("antd-img-crop"), { ssr: false });

import Masks from "@/OLD/utils/masks";
import { places } from "@/OLD/utils/places";
import { normalizeStr } from "@/OLD/utils/normalizeString";

import { viacepService } from "@/OLD/services/viacep.service";

const FormChild = memo(function ({ data, setData, submit, setPhoto }) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { plans } = usePlans();

  const router = useRouter();

  const {createToast} = useToast()

  useEffect(() => {
    setStates(places);
    if (data?.state) {
      setCities(places.find((item) => item.value === data.state).cities);
    }
  }, [places, data]);

  const getAddress = (cepData) => {
    setLoading(true);
    viacepService
      .getAddressByPostalCode(cepData)
      .then((res) => {
        setData({
          ...data,
          postalCode: res.data.cep,
          district: res.data.bairro,
          street: res.data.logradouro,
          state: res.data.uf,
          city: res.data.localidade,
          complement: res.data.complemento,
          cityCode: res.data.ibge,
        });
      })
      .catch((_err) => {
        return  createToast({ status: "error", message: "Houve um erro ao buscar o cep informado" })
      });
  };

  return (
    <form
      className="uk-margin-top"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <Container className="uk-padding">
        <div className="uk-heading-line">
          <span>Dados</span>
        </div>
        <div className="uk-flex uk-margin-top">
          <div>
            <label>Perfil</label>
            <ImgCrop
              modalTitle="Editar imagem"
              modalOk="Salvar"
              modalCancel="Cancelar"
            >
              <Upload
                listType="picture-card"
                onChange={(e) => {
                  setFileList(e.fileList);
                  if (e.fileList.length > 0) {
                    setPhoto(e.fileList[0].originFileObj);
                  } else {
                    setPhoto(null);
                  }
                }}
                accept=".png, .jpeg, .jpg"
                action=""
                method=""
              >
                {fileList.length === 0 && "+ Imagem"}
              </Upload>
            </ImgCrop>
          </div>
          <div className="uk-flex uk-flex-column uk-width-1-1">
            <div className="uk-flex uk-width-1-1">
              <div className="uk-width-1-2 uk-margin-right">
                <label>Razão social*</label>
                <Input
                  value={data?.corporateName}
                  onChange={(e) =>
                    setData({ ...data, corporateName: e.target.value })
                  }
                />
              </div>
              <div className="uk-width-1-2 uk-margin-right">
                <label>Nome fantasia*</label>
                <Input
                  value={data?.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
              </div>
              <div className="uk-width-1-4 uk-flex uk-flex-column uk-flex-middle">
                <label>Ativo</label>
                <Switch
                  checked={data?.active}
                  onChange={(val) => {
                    setData({ ...data, active: val });
                  }}
                />
              </div>
            </div>
            <div className="uk-flex">
              <div className="uk-flex uk-width-1-2 uk-margin-small-top uk-margin-right">
                <div className="uk-width-1-2 uk-margin-right">
                  <label>CNPJ / CPF</label>
                  <Input
                    value={data?.document}
                    onChange={(e) =>
                      setData({ ...data, document: e.target.value })
                    }
                  />
                </div>
                <div className="uk-width-1-2">
                  <label>Inscrição estadual</label>
                  <Input
                    value={data?.inscription}
                    onChange={(e) =>
                      setData({ ...data, inscription: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="uk-flex uk-width-1-2 uk-margin-small-top">
                <div className="uk-width-1-2 uk-margin-right">
                  <label>Telefone</label>
                  <Input
                    value={data?.telephone}
                    onChange={(e) =>
                      setData({
                        ...data,
                        telephone: Masks.phone(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="uk-width-1-2 uk-margin-right">
                  <label>Celular</label>
                  <Input
                    value={data?.cellphone}
                    onChange={(e) =>
                      setData({
                        ...data,
                        cellphone: Masks.phone(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="uk-flex uk-width-1-1 uk-margin-small-top">
          <div className="uk-width-1-2 uk-margin-right">
            <label>Email</label>
            <Input
              value={data?.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>
          <div className="uk-width-1-4 uk-margin-right">
            <label>Tag</label>
            <Input
              value={data?.tag}
              onChange={(e) => setData({ ...data, tag: e.target.value })}
            />
          </div>
          <div className="uk-width-1-4">
            <label>Plano de contas padrão</label>
            <AutoComplete
              className="uk-width-1-1"
              value={data?.planDesc}
              options={plans
                ?.filter((plan) => plan?.type === "DEBITO")
                .map((plan) => ({
                  ...plan,
                  value: plan?.description,
                  key: plan?.id,
                }))}
              onChange={(val) => setData({ ...data, planDesc: val })}
              onSelect={(val, opt) => {
                setData({
                  ...data,
                  accountPlanId: opt?.id,
                  planDesc: opt?.value,
                });
              }}
              filterOption={(val, opt) =>
                normalizeStr(opt?.value.toUpperCase()).includes(
                  normalizeStr(val.toUpperCase())
                )
              }
            />
          </div>
        </div>
        <div className="uk-heading-line uk-margin-top">
          <span>Endereço</span>
        </div>
        <div className="uk-flex uk-margin-top">
          <div className="uk-width-1-5 uk-margin-right">
            <label>Cep</label>
            <Input
              value={data?.postalCode}
              onChange={(e) => {
                e.target.value.length === 8 && getAddress(e.target.value);
                setData({ ...data, postalCode: e.target.value });
              }}
            />
          </div>
          <div className="uk-width-1-2 uk-margin-right">
            <label>Rua</label>
            <Input
              value={data?.street}
              onChange={(e) => setData({ ...data, street: e.target.value })}
            />
          </div>
          <div className="uk-width-1-5 uk-margin-right">
            <label>Número</label>
            <Input
              value={data?.number}
              onChange={(e) => setData({ ...data, number: e.target.value })}
            />
          </div>
          <div className="uk-width-1-5">
            <label>Complemento</label>
            <Input
              value={data?.complement}
              onChange={(e) => setData({ ...data, complement: e.target.value })}
            />
          </div>
        </div>
        <div className="uk-flex uk-margin-small-top">
          <div className="uk-width-1-3 uk-margin-right">
            <label>Bairro</label>
            <Input
              value={data?.district}
              onChange={(e) => setData({ ...data, district: e.target.value })}
            />
          </div>
          <div className="uk-width-1-5 uk-margin-right">
            <label>Estado</label>
            <Select
              className="uk-width-1-1"
              onChange={(e) => setData({ ...data, state: e })}
              value={data?.state}
            >
              {states.length > 0 &&
                states.map((item, i) => (
                  <Option value={item.value} key={i}>
                    {item.value}
                  </Option>
                ))}
            </Select>
          </div>
          <div className="uk-width-1-5 uk-margin-right">
            <label>Cidade</label>
            <AutoComplete
              className="uk-width-1-1"
              value={data?.city}
              options={cities}
              onChange={(e) => setData({ ...data, city: e })}
              onSelect={(e) => setData({ ...data, city: e })}
              filterOption={(inputValue, option) =>
                option.label.toUpperCase().includes(inputValue.toUpperCase())
                  ? option
                  : null
              }
            />
          </div>
          <div className="uk-width-1-3 uk-margin-right">
            <label>Tipo residência</label>
            <Select
              className="uk-width-1-1"
              onChange={(e) => setData({ ...data, residence: e })}
              value={data?.residence}
            >
              <Option value="CASA">Casa</Option>
              <Option value="APARTAMENTO">Apartamento</Option>
              <Option value="CONDOMINIO">Condominio</Option>
              <Option value="SITIO">Sitio</Option>
              <Option value="COMERCIAL">Comercial</Option>
            </Select>
          </div>
          <div className="uk-width-1-3 uk-margin-right">
            <label>Código da cidade</label>
            <Input
              id={"city_code"}
              type="number"
              readOnly
              value={data?.cityCode}
              onChange={(e) => setData({ ...data, cityCode: e.target.value })}
            />
          </div>
        </div>
      </Container>
      <footer style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={() => router.back()}
          text="Voltar"
          style={{ marginRight: "10px" }}
        />

        <Button type="submit" text="Salvar" />
      </footer>
    </form>
  );
});

export default FormChild;
