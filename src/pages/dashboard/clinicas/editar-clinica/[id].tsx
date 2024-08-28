import React, { useState } from "react";

import { useRouter } from "next/router";

import {
  Form,
  Input,
  Select,
  Switch,
  Skeleton,
  notification,
  AutoComplete,
} from "antd";
import cep from "cep-promise";

import { places } from "@/OLD/utils/places";
import AccessDenied from "@/OLD/components/AccessDenied";
import { Button } from "@/OLD/components/mini-components";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { clinicService } from "@/OLD/services/clinic.service";

import {
  formatPhone,
  LayoutDashboard,
  useLoadBusinessUnits,
} from "@/presentation";
import { BusinessUnit } from "@/domain";

const { Option } = Select;

export default function EditarClinicaPage() {
  return <Page />;
}

function Page() {
  const [formData, setFormData] = useState<Partial<BusinessUnit>>({});

  const router = useRouter();
  const { data, isLoading } = useLoadBusinessUnits();
  const editPermission = useUserHasPermission("CLI02");

  if (!data) {
    return <></>;
  }

  function handleInputValue(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    setFormData((prev) => ({ ...prev, [target.id]: target.value }));
  }

  async function handleSubmit() {
    if (!data) {
      return;
    }

    try {
      const clinicId = router?.query?.id as string;
      const phone = formatPhone(data.phone);
      const payload = { ...data, ...formData };
      await clinicService.upDateClinic(clinicId, { ...payload, phone });

      notification.success({
        message: "Sucesso!",
        description: "Clinica editada com sucesso",
      });
      router.push(`/dashboard/clinicas/${clinicId}`);
    } catch (error) {
      notification.error({
        message: "Erro!",
        description: "Erro ao editar a clinica. Tente novamente mais tarde.",
      });
    }
  }

  async function getAddress(cepData: BusinessUnit["postalCode"]) {
    if (cepData.length === 8) {
      try {
        const result = await cep(cepData);
        setFormData((prev) => ({
          ...prev,
          postalCode: result.cep,
          address: result?.street,
          district: result?.neighborhood,
          state: result?.state,
          city: result?.city,
        }));
      } catch (e: any) {
        console.log(e);

        return notification.error({
          message: "Houve um erro ao buscar o cep informado",
        });
      }
    }
  }

  return (
    <LayoutDashboard>
      {!editPermission ? (
        <AccessDenied />
      ) : (
        <div className="uk-container uk-padding">
          <div className="uk-flex uk-flex-between uk-margin-bottom">
            <h2>Editar Clinica</h2>
            <div
              className="uk-flex uk-flex-left uk-margin-bottom"
              style={{ gap: "10px" }}
            >
              <Button onClick={() => router.back()}>Voltar</Button>
            </div>
          </div>

          {isLoading ? (
            <Skeleton active />
          ) : (
            <Form layout="vertical">
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
                        id="identification"
                        type="text"
                        value={formData?.identification || data?.identification}
                        onChange={handleInputValue}
                      />
                    </Form.Item>
                    <Form.Item label="Email" className="uk-width-2-5">
                      <Input
                        id="email"
                        type="email"
                        value={formData?.email || data?.email}
                        required
                        onChange={handleInputValue}
                      />
                    </Form.Item>
                    <Form.Item label="Telefone">
                      <Input
                        id="phone"
                        value={formData?.phone || data?.phone}
                        required
                        onChange={handleInputValue}
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
                        id="fantasyName"
                        type="text"
                        value={formData?.fantasyName || data?.fantasyName}
                        onChange={handleInputValue}
                      />
                    </Form.Item>
                    <Form.Item label="Razão social" className="uk-width-2-5">
                      <Input
                        id="companyName"
                        type="text"
                        value={formData?.companyName || data?.companyName}
                        onChange={handleInputValue}
                      />
                    </Form.Item>
                    <Form.Item label="CNPJ">
                      <Input
                        id="document"
                        type="text"
                        value={formData?.document || data?.document}
                        onChange={handleInputValue}
                      />
                    </Form.Item>
                    <Form.Item label="Simples">
                      <Switch
                        checked={formData?.simple ?? data?.simple}
                        onChange={(checked) => {
                          setFormData((prev) => ({
                            ...prev,
                            simple: checked,
                          }));
                        }}
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
                        id="postalCode"
                        type="number"
                        min={0}
                        max={8}
                        onChange={(e) => getAddress(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item label="Rua" className="uk-width-2-5">
                      <Input
                        id="address"
                        type="text"
                        value={formData?.address || data?.address}
                        onChange={handleInputValue}
                      />
                    </Form.Item>
                    <Form.Item label="Número">
                      <Input
                        id="number"
                        type="text"
                        value={formData?.number || data?.number}
                        onChange={handleInputValue}
                      />
                    </Form.Item>
                    <Form.Item label="Complemento" className="uk-width-2-5">
                      <Input
                        id="complement"
                        type="text"
                        onChange={handleInputValue}
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
                        id="district"
                        type="text"
                        value={formData?.district || data?.district}
                        onChange={handleInputValue}
                      />
                    </Form.Item>

                    <Form.Item label="Estado" className="uk-width-1-3">
                      <Select
                        onChange={(value) =>
                          handleInputValue({
                            target: { value, id: "state" },
                          } as any)
                        }
                        value={formData?.state || data?.state}
                      >
                        {places &&
                          places?.length > 0 &&
                          places.map((item, i) => (
                            <Option value={item.value} key={i}>
                              {item.value}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                    <Form.Item label="Cidade" className="uk-width-1-3">
                      <AutoComplete
                        className="uk-width-1-1"
                        options={
                          (formData?.state &&
                            places?.find(
                              (item) => item.value === formData.state
                            )?.cities) ||
                          []
                        }
                        value={formData?.city || data?.city}
                        onChange={(value) =>
                          handleInputValue({
                            target: { value, id: "city" },
                          } as any)
                        }
                        filterOption={(inputValue, option) =>
                          option?.label
                            .toUpperCase()
                            .includes(inputValue.toUpperCase())
                            ? option
                            : (null as any)
                        }
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <Button onClick={handleSubmit}>Salvar</Button>
            </Form>
          )}
        </div>
      )}
    </LayoutDashboard>
  );
}
