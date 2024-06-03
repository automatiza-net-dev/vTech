import { LayoutDashboard } from "@/presentation";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import cep from "cep-promise";
import { Form, Input, Select, notification, AutoComplete, Switch } from "antd";

import Masks from "@/OLD/utils/masks";
import { places } from "@/OLD/utils/places";
import AccessDenied from "@/OLD/components/AccessDenied";
import { Button } from "@/OLD/components/mini-components";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { clinicService } from "@/OLD/services/clinic.service";
import { useEconomicGroup } from "@/OLD/hooks/useEconomicGroup";
import { Clinica } from "@/OLD/hooks/useClinics";
import { PrivatePageAdmin } from "infinity-forge";


const { Option } = Select;

export default function CadastrarClinicaPage() {
 
  return <PrivatePageAdmin>
    <Page />
  </PrivatePageAdmin>
}


 function Page() {
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[] | undefined>([]);
  const [data, setData] = useState<Clinica | null>({ simple: true });

  const router = useRouter();
  const { economicGroup } = useEconomicGroup();
  const createClinicPermission = useUserHasPermission("CLI01");

  const getAddress = (cepData) => {
    setLoading(true);

    cep(cepData)
      .then((res) => {
        setData((state) => ({
          ...state,
          postalCode: res.cep,
          address: res.street,
          district: res.neighborhood,
          state: res?.state,
          city: res?.city,
        }));
      })
      .catch((_err) =>
        notification.error({
          message: "Houve um erro ao buscar o cep informado",
        })
      );
  };
  
  const handleSubmit = React.useCallback(async () => {
    const phoneFormated = data?.phone
      ?.replace("(", "")
      .replace(")", "")
      .replace("-", "")
      .replace(" ", "");

    try {
      setLoading(true);
      const clinic = await clinicService.create({
        ...data,
        phone: phoneFormated,
      });
      router.push(`/dashboard/clinicas`);
      notification.success({
        message: "Sucesso",
        description: "Cadastro realizado com sucesso!",
      });
      setData(null);
    } catch (err) {
      setLoading(false);
      return notification.error({
        message: "Erro",
        description: "Erro ao concluir cadastro.",
      });
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setStates(places);
    if (data?.state) {
      setCities(places.find((item) => item.value === data.state)?.cities);
    }
  }, [places, data]);

  useEffect(() => {
    setData({
      ...data,
      economic_group_id: economicGroup,
    });
  }, [economicGroup]);

  return (
    <LayoutDashboard>
      {!createClinicPermission || createClinicPermission === "loading" ? (
        <AccessDenied loading={createClinicPermission} />
      ) : (
        <div className="uk-padding uk-container">
          <div className="uk-flex uk-flex-between uk-margin-bottom">
            <h3>Cadastrar</h3>
            <div
              className="uk-flex uk-flex-left uk-margin-bottom"
              style={{ gap: "10px" }}
            >
              <Link href="/dashboard/clinicas">
                <Button>Voltar</Button>
              </Link>
            </div>
          </div>

          <Form layout="vertical" onSubmitCapture={handleSubmit}>
            <div
              className="uk-flex uk-width-1-1 uk-flex-column uk-card uk-card-body"
              style={{
                gap: "30px",
                background: "#fff",
                borderRadius: "20px",
                border: "2px",
                marginBottom: "20px",
              }}
            >
              <div>
                <h5 className="uk-heading-line">
                  <span>Documentos e contatos</span>
                </h5>
                <div
                  className="uk-flex"
                  style={{
                    gap: "30px",
                  }}
                >
                  <Form.Item label="Identificação" className="uk-width-2-5">
                    <Input
                      id={"identification"}
                      type="text"
                      value={data?.identification}
                      onChange={(e) =>
                        setData({ ...data, identification: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label="Email" className="uk-width-2-5">
                    <Input
                      id={"email"}
                      type="email"
                      value={data?.email}
                      required
                      onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label="Telefone">
                    <Input
                      id={"phone"}
                      value={data?.phone}
                      required
                      onChange={(e) =>
                        setData({ ...data, phone: Masks.phone(e.target.value) })
                      }
                    />
                  </Form.Item>
                </div>
                <div
                  className="uk-flex"
                  style={{
                    gap: "30px",
                  }}
                >
                  <Form.Item label="Nome fantasia" className="uk-width-2-5">
                    <Input
                      id={"fantasyName"}
                      type="text"
                      value={data?.fantasyName}
                      onChange={(e) =>
                        setData({ ...data, fantasyName: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label="Razão social" className="uk-width-2-5">
                    <Input
                      id={"companyName"}
                      type="text"
                      value={data?.companyName}
                      onChange={(e) =>
                        setData({ ...data, companyName: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label="CNPJ">
                    <Input
                      id={"document"}
                      type="number"
                      max="99999999999999"
                      value={data?.document}
                      onChange={(e) =>
                        setData({ ...data, document: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label="Simples">
                    <Switch
                      checked={data?.simple}
                      onChange={(e) => setData({ ...data, simple: e })}
                    />
                  </Form.Item>
                </div>
              </div>

              <div>
                <h5 className="uk-heading-line">
                  <span>Endereço</span>
                </h5>
                <div
                  className="uk-flex"
                  style={{
                    gap: "30px",
                  }}
                >
                  <Form.Item label="CEP" className="uk-width-1-5">
                    <Input
                      id={"postalCode"}
                      type="number"
                      max={"99999999"}
                      value={data?.postalCode}
                      onChange={(e) => {
                        e.target.value.length === 8 &&
                          getAddress(e.target.value);
                        setData({ ...data, postalCode: e.target.value });
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="Rua" className="uk-width-2-5">
                    <Input
                      id={"address"}
                      type="text"
                      value={data?.address}
                      onChange={(e) =>
                        setData({ ...data, address: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label="Número">
                    <Input
                      id={"number"}
                      type="text"
                      value={data?.number}
                      maxLength={8}
                      onChange={(e) =>
                        setData({ ...data, number: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label="Complemento" className="uk-width-2-5">
                    <Input
                      id={"complement"}
                      type="text"
                      value={data?.complement}
                      onChange={(e) =>
                        setData({ ...data, complement: e.target.value })
                      }
                    />
                  </Form.Item>
                </div>
                <div
                  className="uk-flex"
                  style={{
                    gap: "30px",
                  }}
                >
                  <Form.Item label="Bairro" className="uk-width-1-3">
                    <Input
                      id={"district"}
                      type="text"
                      value={data?.district}
                      onChange={(e) =>
                        setData({ ...data, district: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label="Estado" className="uk-width-1-3">
                    <Select
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
                  </Form.Item>
                  <Form.Item label="Cidade" className="uk-width-1-3">
                    <AutoComplete
                      value={data?.city}
                      className="uk-width-1-1"
                      options={cities}
                      onSelect={(e) => setData({ ...data, city: e })}
                      filterOption={(inputValue, option) =>
                        option.label
                          .toUpperCase()
                          .includes(inputValue.toUpperCase())
                          ? option
                          : null
                      }
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <Button type={"submit"} loading={loading}>
              Cadastrar
            </Button>
          </Form>
        </div>
      )}
    </LayoutDashboard>
  );
}