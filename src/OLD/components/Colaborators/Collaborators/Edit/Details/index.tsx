// @ts-nocheck
// Core
import react, { useEffect, useCallback, useState, memo } from "react";
import { useRouter } from "next/router";

// Services
import { clinicService } from "@/OLD/services/clinic.service";
import { userService } from "@/OLD/services/user.service";

// Components
import { notification, Input, Select, Space, AutoComplete } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import { Button } from "@/OLD/components/mini-components/Button";
import { Container } from "./styles";
const { Option } = Select;

// icons

//Utils
import { places } from "@/OLD/utils/places";
import Masks from "@/OLD/utils/masks";
import cep from "cep-promise";
import moment from "moment";

function snakeToCamel(snakeCaseString) {
  return snakeCaseString.replace(/_([a-zA-Z])/g, (_, character) =>
    character.toUpperCase()
  );
}

const EditColaborator = memo(function EditColaborator() {
  const [data, setData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const router = useRouter();

  const getCollab = useCallback(() => {
    setLoading(true);
    clinicService
      .getCollabById(router.query.id)
      .then((res) => {
        const dataFormated = res.data;
        const keys = Object.keys(dataFormated); // data = oq vem da requisição

        const result = {};
        for (const k of keys) {
          result[snakeToCamel(k)] = dataFormated[k];
        }
        setData({
          ...result,
          birthDate: result?.birthDate ? moment(result?.birthDate) : null,
        });
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um problema ao buscar os detalhes do colaborador...",
        });
      })
      .finally(() => setLoading(false));
  }, [router.query.id]);

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
        return notification.error({
          message: "Não foi possível localizar o cep informado!",
        });
      });
  };

  useEffect(() => {
    getCollab();
  }, [getCollab]);

  useEffect(() => {
    setStates(places);
    if (data.state) {
      setCities(places.find((item) => item.value === data.state)?.cities);
    }
  }, [places, data]);

  const submitUpdate = useCallback(() => {
    setLoading(false);
    delete data.roles;

    data.phone
      .replace("(", "")
      .replace(")", "")
      .replace("-", "")
      .replace("-", "");

    data?.document?.replaceAll(".", "").replace("-", "");

    parseInt(data.phone);
    parseInt(data.document);

    clinicService
      .updateCollaborator(router.query.id, data)
      .then((_res) =>
        notification.success({ message: "Colaborador atualizado com sucesso!" })
      )
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao atualizar os dados do colaborador...",
        });
      })
      .finally(() => {
        setLoading(false);
        router.back();
      });
  }, [data]);

  const verifyDocument = (doc) => {
    setLoading(true);
    userService
      .checkDocument(Masks?.noDocument(doc))
      .then((res) => {
        if (!res?.data?.valid) {
          return notification.warning({ message: "CPF Inválido" });
        }
      })
      .catch((err) => setLoading(false));
  };

  return (
    <div className="">
      <form
        className="uk-margin-top"
        onSubmit={(e) => {
          e.preventDefault();
          submitUpdate();
        }}
      >
        <Container className="uk-padding">
          <div className="input-box">
            <div className="uk-width-1-3">
              <label>Nome</label>
              <Input
                value={data?.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>

            <div className="uk-width-1-3">
              <label>Email</label>
              <Input
                value={data?.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                type="email"
              />
            </div>
            <div className="uk-width-1-5">
              <label>telefone</label>
              <Input
                value={data?.phone}
                onChange={(e) =>
                  setData({ ...data, phone: Masks.phone(e.target.value) })
                }
              />
            </div>
          </div>
          <div className="input-box uk-margin-top">
            <div className="uk-width-1-3">
              <label>Cpf</label>
              <Input
                onBlur={() =>
                  data?.document &&
                  verifyDocument(
                    data?.document.replaceAll(".", "").replace("-", "")
                  )
                }
                value={data?.document}
                onChange={(e) =>
                  setData({ ...data, document: Masks.cpf(e.target.value) })
                }
              />
            </div>

            <div className="uk-width-1-3">
              <label>RG</label>
              <Input
                value={data?.inscription}
                onChange={(e) =>
                  setData({ ...data, inscription: e.target.value })
                }
              />
            </div>

            <div className="uk-width-1-5">
              <label>Data de nascimento</label>
              <Space direction="vertical" className="uk-width-1-1">
                <DatePicker
                  slotProps={{ textField: { variant: "standard" } }}
                  id={"birthDate"}
                  type="date"
                  required
                  value={data?.birthDate}
                  onChange={(val) => setData({ ...data, birthDate: val })}
                />
              </Space>
            </div>
          </div>

          <h4 className="uk-heading-line">
            <span>Endereço</span>
          </h4>
          <div className="input-box uk-margin-top">
            <div className="uk-width-1-5">
              <label>Cep</label>
              <Input
                className=""
                value={data?.postalCode}
                onChange={(e) => {
                  setData({ ...data, postalCode: e.target.value });
                  const cepData = e.target.value.replace("-", "");
                  cepData.length === 8 ? getAddress(cepData) : null;
                }}
              />
            </div>

            <div className="uk-width-1-4">
              <label>Rua</label>
              <Input
                value={data?.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
              />
            </div>

            <div className="uk-width-1-5">
              <label>Número</label>
              <Input
                value={data?.number}
                onChange={(e) => setData({ ...data, number: e.target.value })}
              />
            </div>

            <div className="uk-width-1-4">
              <label>Complemento</label>
              <Input
                value={data?.complement}
                onChange={(e) =>
                  setData({ ...data, complement: e.target.value })
                }
              />
            </div>
          </div>
          <div className="input-box uk-margin-top">
            <div className="uk-width-1-4">
              <label>Bairro</label>
              <Input
                value={data?.district}
                onChange={(e) => setData({ ...data, district: e.target.value })}
              />
            </div>

            <div className="uk-width-1-3">
              <label>Estado</label>
              <Select
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

            <div className="uk-width-1-3">
              <label>Cidade</label>
              <AutoComplete
                className="uk-width-1-1"
                value={data?.city}
                options={cities}
                onSelect={(e) => setData({ ...data, city: e })}
                filterOption={(inputValue, option) =>
                  option.label.toUpperCase().includes(inputValue.toUpperCase())
                    ? option
                    : null
                }
              />
            </div>
          </div>
          <h4 className="uk-heading-line">
            <span>Dados Profissionais</span>
          </h4>
          <div
            className="input-box uk-margin-top uk-width-1-1 uk-flex"
            style={{ justifyContent: "flex-start" }}
          >
            <div className="uk-width-1-5">
              <label>Registro Conselho</label>
              <Input
                className=""
                value={data?.licensingJob}
                onChange={(e) => {
                  setData({ ...data, licensingJob: e.target.value });
                }}
              />
            </div>
          </div>
        </Container>
        <div className="uk-margin-small-top">
          <div className="uk-width-1-3 uk-flex uk-flex-around">
            <Button loading={loading} type="submit">
              Salvar
            </Button>
            <Button type="button" onClick={() => router.back()}>
              Voltar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
});

export default EditColaborator;
