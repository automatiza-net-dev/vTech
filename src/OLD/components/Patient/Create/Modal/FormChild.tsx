// @ts-nocheck
import { memo, useState, useEffect } from "react";

// Components
import { Form, Input, Select, Upload, AutoComplete } from "antd";

import dynamic from "next/dynamic";

const ImgCrop = dynamic(() => import("antd-img-crop"), { ssr: false });
const { Option } = Select;

// Utils
import cep from "cep-promise";
import { places } from "@/OLD/utils/places";
import masks from "@/OLD/utils/masks";

export const FormChild = memo(function FormChild({ data, setData, setPhoto }) {
  const [fileList, setFileList] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  useEffect(() => {
    setStates(places);
    if (data?.state) {
      setCities(places.find((item) => item.value === data.state).cities);
    }
  }, [places, data]);

  const getAddress = (cepData) => {
    setLoading(true);
    cep(cepData)
      .then((res) => {
        setData({
          ...data,
          postal_code: res.cep,
          address: res.street,
          district: res.neighborhood,
          street: res.street,
          state: res.state,
          city: res.city,
        });
      })
      .catch((_err) => {
        return notification.error({
          message: "Houve um erro ao buscar o cep informado",
        });
      });
  };

  return (
    <div
      className="uk-flex uk-width-1-1 uk-flex-column uk-card uk-card-body"
      style={{
        gap: "30px",
        background: "#fff",
        borderRadius: "20px",
        boder: "2px",
        marginBottom: "20px",
      }}
    >
      <div>
        <h5 className="uk-heading-line">
          <span>Dados pessoais</span>
        </h5>
        <div
          className="uk-flex"
          style={{
            gap: "30px",
          }}
        >
          <Form.Item label="Nome" className="uk-width-1-2">
            <Input
              id={"name"}
              type="text"
              value={data?.name}
              required
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </Form.Item>

          <Form.Item label="Email" className="uk-width-1-2">
            <Input
              id={"email"}
              type="email"
              value={data?.email}
              required
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </Form.Item>
        </div>
        <div
          className="uk-flex"
          style={{
            gap: "30px",
          }}
        >
          <Form.Item label="Celular" className="uk-width-1-4">
            <Input
              id={"cellphone"}
              value={data?.cellphone}
              required
              onChange={(e) =>
                setData({ ...data, cellphone: masks.phone(e.target.value) })
              }
            />
          </Form.Item>
          <Form.Item label="Aniversário" className="uk-width-1-4">
            <Input
              id={"birthDate"}
              type="date"
              value={data?.birthDate}
              onChange={(e) => setData({ ...data, birthDate: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Gênero" className="uk-width-1-4">
            <Select
              id={"gender"}
              value={data?.gender}
              required
              onChange={(e) => setData({ ...data, gender: e })}
            >
              <option value="male">M</option>
              <option value="female">F</option>
            </Select>
          </Form.Item>

          <Form.Item label="Documento" className="uk-width-1-4">
            <Input
              id={"document"}
              type="text"
              value={data?.document}
              onChange={(e) => setData({ ...data, document: e.target.value })}
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Tag" className="uk-width-1-1">
            <Input
              id={"document"}
              type="tag"
              value={data?.tags}
              onChange={(e) => setData({ ...data, tags: e.target.value })}
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Perfil">
            <ImgCrop>
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
              >
                {fileList.length === 0 && "+ Imagem"}
              </Upload>
            </ImgCrop>
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
          <Form.Item label="CEP" className="uk-width-1-4">
            <Input
              id={"postalCode"}
              type="number"
              value={data?.postal_code}
              onChange={(e) => {
                e.target.value.length === 8 && getAddress(e.target.value);
                setData({ ...data, postal_code: e.target.value });
              }}
            />
          </Form.Item>
          <Form.Item label="Rua" className="uk-width-1-4">
            <Input
              id={"street"}
              type="text"
              value={data?.street}
              onChange={(e) => setData({ ...data, street: e.target.value })}
            />
          </Form.Item>

          <Form.Item label="Complemento" className="uk-width-1-4">
            <Input
              id={"complement"}
              type="text"
              value={data?.complement}
              onChange={(e) => setData({ ...data, complement: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Número" className="uk-width-1-4">
            <Input
              id={"number"}
              type="text"
              value={data?.number}
              onChange={(e) => setData({ ...data, number: e.target.value })}
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
              onChange={(e) => setData({ ...data, district: e.target.value })}
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
              className="uk-width-1-1"
              options={cities}
              value={data?.city ? data?.city : citySearch}
              onChange={(val) => {
                setData({ ...data, city: false });
                setCitySearch(val);
              }}
              onSelect={(e) => setData({ ...data, city: e })}
              filterOption={(inputValue, option) =>
                option.label.toUpperCase().includes(inputValue.toUpperCase())
                  ? option
                  : null
              }
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
});
