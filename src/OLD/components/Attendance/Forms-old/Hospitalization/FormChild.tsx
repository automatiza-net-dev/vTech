// @ts-nocheck
// Core
import { useProfile } from "@/OLD/hooks/useProfile";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";

// Services
import { bedsService } from "@/OLD/services/beds.service";
import { clinicService } from "@/OLD/services/clinic.service";

// Utils
import moment from "moment";

// Components
import {
  AutoComplete,
  DatePicker,
  Input,
  Modal,
  notification,
  Select
} from "antd";
import Footer from "@/OLD/components/mini-components/CustomFormFooter";

const { Option } = Select;
const { TextArea } = Input;

const risks = [
  { id: 1, value: "Leve" },
  { id: 2, value: "Médio" },
  { id: 3, value: "Grave" },
  { id: 4, value: "Gravíssimo" }
];

function Hospitalization({
  visible,
  setVisible,
  submit,
  data,
  setData,
  edit = true
}) {
  const [loading, setLoading] = useState(false);
  const [allBeds, setAllBeds] = useState([]);
  const [allVets, setAllVets] = useState([]);
  const router = useRouter();
  const { user } = useProfile();

  const getBeds = useCallback(() => {
    setLoading(true);
    bedsService
      .listBeds({ active: true })
      .then((res) => setAllBeds(res.data))
      .catch((_err) => {
        notification.error({
          message: "Houve um erro ao buscar os leitos disponíveis..."
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getVets = useCallback(() => {
    setLoading(true);
    clinicService
      .getColaborators({})
      .then((res) =>
        setAllVets(
          res.data.map((item) => {
            return {
              value: item?.name,
              id: item?.id
            };
          })
        )
      )
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Não foi possível buscar os veterinários disponíveis."
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getBeds();
    getVets();
    visible &&
      setData({
        ...data,
        user: user?.name,
        selectedVetId: user.id,
        expectedDischarge: moment(new Date())
      });
  }, [getBeds, getVets, visible]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="uk-flex uk-wdith-1-1">
        <div className="uk-width-1-1 uk-margin-right">
          <label> Situação </label>
          <Select
            disabled={!edit}
            value={data?.type}
            className="uk-width-1-1"
            onChange={(e) => setData({ ...data, type: e })}
          >
            <Option value="1">Admissão de Internação</Option>
            <Option value="2">Admissão de Observação</Option>
            <Option value="3">Admissão de Uti</Option>
          </Select>
        </div>
        <div className="uk-width-1-1 uk-margin-right">
          <label>Grau de risco</label>
          <Select
            disabled={!edit}
            value={
              data?.risk
                ? risks.find((item) => item.id === data?.risk)?.value
                : ""
            }
            className="uk-width-1-1"
            onChange={(e) => setData({ ...data, risk: parseInt(e) })}
          >
            <Option value="1"> Leve </Option>
            <Option value="2"> Médio </Option>
            <Option value="3">Grave</Option>
            <Option value="4"> Grávissimo </Option>
          </Select>
        </div>
        <div className="uk-width-1-1">
          <label>Leito de internação</label>
          <Select
            disabled={!edit}
            className="uk-width-1-1"
            value={data?.bedId}
            onChange={(e) => setData({ ...data, bedId: e })}
          >
            {allBeds.length > 0 &&
              allBeds.map((item, i) => (
                <Option value={item?.id}> {item?.name} </Option>
              ))}
          </Select>
        </div>
      </div>
      <div className="uk-flex uk-margin-top">
        <div className="uk-width-1-1 uk-margin-right">
          <label>Veterinário</label>
          <AutoComplete
            disabled={!edit}
            className="uk-width-1-1"
            options={allVets}
            value={data?.user}
            onSelect={(e, option) =>
              setData({ ...data, user: e, selectedVetId: option.id })
            }
            onChange={(e) => setData({ ...data, user: e })}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().includes(inputValue.toUpperCase())
                ? option
                : null
            }
          />
        </div>
        <div className="uk-width-1-2">
          <label> Data previsão de alta </label>
          <br />
          <DatePicker
            disabled={!edit}
            format="DD/MM/YYYY"
            className="uk-width-1-1"
            onChange={(e) => setData({ ...data, expectedDischarge: e })}
            value={moment(data?.expectedDischarge)}
          />
        </div>
      </div>
      <div className="uk-margin-top">
        <label>Queixa</label>
        <TextArea
          disabled={!edit}
          value={data?.complaint}
          autoSize={{ minRows: 4, maxRows: 10 }}
          onChange={(e) => setData({ ...data, complaint: e.target.value })}
        />
      </div>
      <div className="uk-margin-top">
        <label>Diagnóstico</label>
        <TextArea
          disabled={!edit}
          value={data?.diagnosis}
          autoSize={{ minRows: 4, maxRows: 10 }}
          onChange={(e) => setData({ ...data, diagnosis: e.target.value })}
        />
      </div>
      <div className="uk-margin-top">
        <label>Prógnostico</label>
        <TextArea
          disabled={!edit}
          value={data?.prognosis}
          autoSize={{ minRows: 4, maxRows: 10 }}
          onChange={(e) => setData({ ...data, prognosis: e.target.value })}
        />
      </div>
      {edit && <Footer setVisible={setVisible} />}
    </form>
  );
};

export default Hospitalization;
