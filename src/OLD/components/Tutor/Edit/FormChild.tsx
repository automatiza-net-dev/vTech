// @ts-nocheck
import React, { useState, useEffect } from "react";

import { userService } from "@/OLD/services/user.service";

import {
  Form,
  Input,
  Select as AntSelect,
  Switch,
  Upload,
  AutoComplete,
  notification,
  Dropdown,
  Menu,
  Modal,
} from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import CamBox from "@/OLD/components/mini-components/CamBox";
import MultipleContacts from "../MultipleContacts";
import { Select, FormHandler, useToast } from "infinity-forge";

// utils
import { places } from "@/OLD/utils/places";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import Masks from "@/OLD/utils/masks";

// Hooks
import {
  useTutorOrigins,
  useUniquetutorOrigins,
} from "@/OLD/hooks/useTutorOrigins";
import { useProfessions } from "@/OLD/hooks/useProfessions";

import { viacepService } from "@/OLD/services/viacep.service";
import { sortItems } from "@/OLD/utils/sortItems";
import moment from "moment";

export function FormChild({
  data,
  setData,
  setPhoto,
  padding = true,
  contacts,
  setContacts,
}) {
  const [fileList, setFileList] = React.useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCam, setOpenCam] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState({});
  const [originFilters, setOriginFilters] = useState({});

  const { tutorOrigins } = useTutorOrigins();

  const { professions } = useProfessions();
  const { uniqueOrigins } = useUniquetutorOrigins(selectedOrigin);
  const { createToast } = useToast();

  sortItems(tutorOrigins, "description");

  useEffect(() => {
    setOriginFilters({ type: "Cadastro" });
  }, []);

  useEffect(() => {
    setStates(places);
    if (data?.state) {
      setCities(places.find((item) => item.value === data.state)?.cities);
    }
  }, [places, data]);

  const getAddress = (cepData) => {
    setLoading(true);
    viacepService
      .getAddressByPostalCode(cepData)
      .then((res) => {
        setData({
          ...data,
          postalCode: res.data.cep.replace("-", ""),
          district: res.data.bairro,
          street: res.data.logradouro,
          state: res.data.uf,
          city: res.data.localidade,
          complement: res.data.complemento,
          cityCode: res.data.ibge,
        });
      })
      .catch((_err) => {
        return createToast({
          message: "Houve um erro ao buscar o cep informado",
          status: "error",
        });
      });
  };

  useEffect(() => {
    data?.photo &&
      fetch(process.env.NEXT_PUBLIC_API + data?.photo)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File(
            [blob],
            `Foto Câmera - ${moment(new Date()).format("DD/MM/YYYY")}`,
            {
              type: "image/png",
            }
          );
          setFileList([{ originFileObj: file }]);
        });
  }, [data?.photo]);

  useEffect(() => {
    if (tutorOrigins && data?.clientOriginId) {
      setSelectedOrigin(
        tutorOrigins?.find((item) => data?.clientOriginId === item?.id)
      );
    }
  }, [tutorOrigins, data]);

  const verifyDocument = (doc) => {
    let str = doc?.split("");

    if (str?.length <= 11) {
      for (let i = str?.length; i < 11; i += 1) {
        str?.unshift(0);
      }

      setData((prv) => ({
        ...prv,
        document: Masks.cpf(str?.join(",").replaceAll(",", "")),
      }));
    }

    if (str?.length > 11) {
      for (let i = str?.length; i < 14; i += 1) {
        str?.unshift(0);
      }

      setData((prv) => ({
        ...prv,
        document: Masks.cnpj(str?.join(",").replaceAll(",", "")),
      }));
    }

    userService
      .checkDocument(Masks?.noDocument(str?.join(",").replaceAll(",", "")))
      .then((res) => {
        if (!res?.data?.valid) {
          return createToast({
            message: "CPF Inválido",
            status: "error",
          });
        }
      })
      .catch((err) => setLoading(false));
  };

  return (
    <div
      className={`uk-flex uk-width-1-1 uk-flex-column uk-card ${
        padding ? "uk-padding" : ""
      }`}
      style={{
        gap: "10px",
        background: "#fff",
        borderRadius: "20px",
        boder: "2px",
        marginBottom: "20px",
      }}
    >
      <div>
        <h5 className="uk-heading-line uk-margin-remove">
          <span>Dados pessoais</span>
        </h5>
        <div className="uk-flex uk-flex-between">
          <Form.Item label="Perfil">
            <div className="img-box">
              <Dropdown
                trigger="click"
                overlay={
                  <Menu
                    items={[
                      {
                        key: "1",
                        label: (
                          <Upload
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
                            <div>Buscar foto no pc</div>
                          </Upload>
                        ),
                      },
                      {
                        key: "2",
                        label: (
                          <div onClick={() => setOpenCam(true)}>
                            Abrir Câmera
                          </div>
                        ),
                      },
                    ]}
                  />
                }
              >
                {fileList.length === 0 ? (
                  <div className="add-image">+ imagem</div>
                ) : (
                  <div className="add-image">
                    <img src={URL.createObjectURL(fileList[0].originFileObj)} />
                  </div>
                )}
              </Dropdown>
            </div>
          </Form.Item>
          <div className="uk-width-5-6">
            <div
              className="uk-flex"
              style={{
                gap: "10px",
              }}
            >
              <Form.Item label="Nome*" className="uk-width-2-5">
                <Input
                  id={"name"}
                  type="text"
                  value={data?.name}
                  required
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
              </Form.Item>
              <Form.Item label="CPF*" className="uk-width-1-6">
                <Input
                  onBlur={() =>
                    data?.document &&
                    verifyDocument(
                      data?.document.replaceAll(".", "").replace("-", "")
                    )
                  }
                  id={"document"}
                  type="text"
                  value={data?.document}
                  onChange={(e) =>
                    setData({ ...data, document: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item label="RG" className="uk-width-1-6">
                <Input
                  id={"rg"}
                  type="rg"
                  value={data?.inscription}
                  onChange={(e) =>
                    setData({ ...data, inscription: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item label="Data de nascimento*" className="uk-width-1-5">
                <DatePicker
                  slotProps={{ textField: { variant: "standard" } }}
                  value={data?.birthDate}
                  onChange={(val) => setData({ ...data, birthDate: val })}
                />
              </Form.Item>
            </div>

            <div
              className="uk-flex"
              style={{
                gap: "10px",
              }}
            >
              <Form.Item label="Gênero*" className="uk-width-1-6">
                <FormHandler>
                  <Select
                    menuPlacement="bottom"
                    name="gender"
                    options={[
                      { label: "Feminino", value: "female" },
                      { value: "male", label: "Masculino" },
                    ]}
                    onlyOneValue
                    value={data?.gender}
                    onChangeSelect={async (value) => {
                      setData({ ...data, gender: value });
                    }}
                  />
                </FormHandler>
              </Form.Item>
              <Form.Item label="Profissão*" className="uk-width-1-3">
                {professions?.length > 0 && (
                  <FormHandler>
                    <Select
                      menuPlacement="bottom"
                      name="professions"
                      options={professions.map((race) => ({
                        label: race?.description,
                        value: race?.id,
                      }))}
                      onlyOneValue
                      value={data?.professionId}
                      onChangeSelect={async (value) => {
                        const opt = professions.find(
                          (prof) => prof.id === value
                        );

                        setData({
                          ...data,
                          professionId: opt?.id,
                          profDescription: opt?.value,
                        });
                      }}
                    />
                  </FormHandler>
                )}
              </Form.Item>
              <Form.Item label="Estado Civil" className="uk-width-1-6">
                <FormHandler>
                  <Select
                    menuPlacement="bottom"
                    name="professions"
                    options={[
                      { value: "Solteiro(a)", label: "Solteiro(a)" },
                      { value: "Casado(a)", label: "Casado(a)" },
                      { value: "Separado(a)", label: "Separado(a)" },
                      { value: "Divorciado(a)", label: "Divorciado(a)" },
                      { value: "Viuvo(a)", label: "Viuvo(a)" },
                    ]}
                    onlyOneValue
                    value={data?.civilStatus}
                    onChangeSelect={async (value) => {
                      setData({ ...data, civilStatus: value });
                    }}
                  />
                </FormHandler>
              </Form.Item>
              <Form.Item label="Nacionalidade" className="uk-width-1-6">
                <Input
                  value={data?.nationality}
                  onChange={(e) =>
                    setData({ ...data, nationality: e.target.value })
                  }
                />
              </Form.Item>
            </div>
            <section className="uk-flex" style={{ gap: "10px" }}>
              <Form.Item
                label="Como conheceu a clínica?*"
                className="uk-width-1-3"
                requried
              >
                <FormHandler>
                  <Select
                    menuPlacement="bottom"
                    name="houseType"
                    options={tutorOrigins?.map((origin) => ({
                      label: origin.description,
                      value: origin.id,
                    }))}
                    onlyOneValue
                    value={data?.clientOriginId}
                    onChangeSelect={async (value) => {
                      setData({ ...data, clientOriginId: value });
                      setSelectedOrigin(
                        tutorOrigins?.find((item) => item?.id === value)
                      );
                    }}
                  />
                </FormHandler>
              </Form.Item>
              {selectedOrigin?.default && (
                <Form.Item label="Campanha Mídia" className="uk-width-1-4">
                  <AutoComplete
                    options={uniqueOrigins?.sort().map((item) => ({
                      value: item,
                      key: item,
                    }))}
                    value={data?.clientOriginItemDescription}
                    onChange={(val) =>
                      setData({ ...data, clientOriginItemDescription: val })
                    }
                    onSelect={(_, opt) =>
                      setData({
                        ...data,
                        clientOriginItemDescription: opt?.value,
                      })
                    }
                    filterOption={(inputValue, option) =>
                      option.value
                        .toUpperCase()
                        .includes(inputValue.toUpperCase())
                        ? option
                        : null
                    }
                  />
                </Form.Item>
              )}
              <Form.Item label="Tag" className="uk-width-1-6">
                <Input
                  id={"document"}
                  type="tag"
                  value={data?.tags}
                  onChange={(e) => setData({ ...data, tags: e.target.value })}
                />
              </Form.Item>
              <Form.Item label={data?.active ? "Ativo" : "Inativo"}>
                <Switch
                  checked={data?.active}
                  onChange={(e) => {
                    setData({ ...data, active: e });
                  }}
                />
              </Form.Item>
            </section>
            {process.env.client === "liftone" && (
              <div className="uk-flex">
                <div className="uk-flex uk-flex-column uk-width-1-6">
                  <label>Diabetes</label>
                  <Switch
                    checked={data?.diabetes}
                    onChange={(val) => setData({ ...data, diabetes: val })}
                    className="uk-width-1-5"
                  />
                </div>
                <div className="uk-flex uk-flex-column uk-width-1-6">
                  <label>Hipertensão</label>
                  <Switch
                    checked={data?.hypertension}
                    onChange={(val) => setData({ ...data, hypertension: val })}
                    className="uk-width-1-5"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <MultipleContacts contacts={contacts} setContacts={setContacts} />
      <div>
        <h5 className="uk-heading-line uk-margin-remove">
          <span>Endereço</span>
        </h5>

        <div
          className="uk-flex"
          style={{
            gap: "10px",
          }}
        >
          <Form.Item label="CEP*" className="uk-width-1-5">
            <Input
              id={"postal_code"}
              type="text"
              value={data?.postalCode}
              onChange={(e) => {
                e.target.value.length === 8 && getAddress(e.target.value);
                setData({ ...data, postalCode: e.target.value });
              }}
            />
          </Form.Item>
          <Form.Item label="Rua*" className="uk-width-2-5">
            <Input
              id={"street"}
              type="text"
              value={data?.street}
              onChange={(e) => setData({ ...data, street: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Número*">
            <Input
              id={"number"}
              type="text"
              value={data?.number}
              onChange={(e) => setData({ ...data, number: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Complemento" className="uk-width-2-5">
            <Input
              id={"complement"}
              type="text"
              value={data?.complement}
              onChange={(e) => setData({ ...data, complement: e.target.value })}
            />
          </Form.Item>
        </div>
        <div
          className="uk-flex"
          style={{
            gap: "10px",
          }}
        >
          <Form.Item label="Bairro*" className="uk-width-1-3">
            <Input
              id={"district"}
              type="text"
              value={data?.district}
              onChange={(e) => setData({ ...data, district: e.target.value })}
            />
          </Form.Item>

          <Form.Item label="Estado*" className="uk-width-1-3">
            <AntSelect
              onChange={(e) => setData({ ...data, state: e })}
              value={data?.state}
            >
              {states.length > 0 &&
                states.map((item, i) => (
                  <Option value={item.value} key={i}>
                    {item.value}
                  </Option>
                ))}
            </AntSelect>
          </Form.Item>
          <Form.Item label="Cidade*" className="uk-width-1-3">
            <AutoComplete
              value={data?.city}
              className="uk-width-1-1"
              options={cities}
              onSelect={(e) => setData({ ...data, city: e })}
              onChange={(val) => setData({ ...data, city: val })}
              filterOption={(inputValue, option) =>
                option.label.toUpperCase().includes(inputValue.toUpperCase())
                  ? option
                  : null
              }
            />
          </Form.Item>
          <Form.Item label="Tipo de residência*" className="uk-width-1-4">
            <FormHandler>
              <Select
                menuPlacement="bottom"
                name="houseType"
                options={[
                  { label: "Casa", value: "CASA" },
                  {
                    label: "Apartamento",
                    value: "APARTAMENTO",
                  },
                  { value: "CONDOMINIO", label: "Condominio" },
                  { value: "SITIO", label: "Sitio" },
                  { value: "COMERCIAL", label: "Comercial" },
                ]}
                onlyOneValue
                value={data?.residence}
                onChangeSelect={async (value) => {
                  setData({ ...data, residence: value });
                }}
              />
            </FormHandler>
          </Form.Item>
          <Form.Item label="Código da cidade" className="uk-width-1-4">
            <Input
              readOnly
              id={"cityCode"}
              value={data?.cityCode}
              onChange={(e) => setData({ ...data, cityCode: e.target.value })}
            />
          </Form.Item>
        </div>
      </div>
      <Modal
        title="Tirar Foto"
        visible={openCam}
        onCancel={() => setOpenCam(false)}
        footer={null}
      >
        <CamBox setVisible={setOpenCam} setFileList={setFileList} />
      </Modal>
    </div>
  );
}
