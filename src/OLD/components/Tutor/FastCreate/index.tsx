// @ts-nocheck
import React, { useState, useCallback, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, notification, AutoComplete, Select } from "antd";
const { Option } = Select;
import { petsService } from "@/OLD/services/patient.service";

import { useRaces } from "@/OLD/hooks/useRaces";
import { useTutorOrigins } from "@/OLD/hooks/useTutorOrigins";
import { useUniquetutorOrigins } from "@/OLD/hooks/useTutorOrigins";

import { sortItems } from "@/OLD/utils/sortItems";
import masks from "@/OLD/utils/masks";
import { normalizeStr } from "@/OLD/utils/normalizeString";

export default function FastCreateTutor({
  visible,
  setVisible,
  fetchData,
  payload,
  setPayload,
  setSearch,
  setTutorsReload = false,
  prevValues = false,
  prevPhone = false,
}) {
  const [data, setData] = useState();
  const [patientData, setPatientData] = useState({});
  const [patientSubmit, setPatientSubmit] = useState(true);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [allPatients, setAllPatients] = useState(false);
  const [tutorInfo, setTutorInfo] = useState([]);
  const [tutorInfoVisible, setTutorInfoVisible] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState({});

  const { uniqueOrigins } = useUniquetutorOrigins(selectedOrigin);

  const submitButton = useRef();

  const checkPhone = (phone) => {
    setLoading(true);
    petsService
      .checkPhone({ phone })
      .then((res) => {
        if (res?.data?.length > 0) {
          setTutorInfo(res.data);
          setTutorInfoVisible(true);
        }
      })
      .finally(() => setLoading(false));
  };

  const { tutorOrigins } = useTutorOrigins();
  const { races } = useRaces(
    { description: "" },
    reload,
    setReload,
    false,
    visible
  );
  

  

  sortItems(tutorOrigins, "description");

  const getAllPatients = useCallback(() => {
    setLoading(true);
    petsService
      .getPatients()
      .then((res) => {
        setAllPatients(res);
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao buscar os pacientes...",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (prevPhone) {
      setData((prv) => ({ ...prv, tutorPhone: masks?.phone(prevPhone) }));
    }
  }, [prevPhone]);

  useEffect(() => {
    getAllPatients();
  }, [getAllPatients]);

  useEffect(() => {
    prevValues &&
      setData((prv) => ({
        ...prv,
        tutorName: prevValues?.tutor,
      }));
  }, []);

  const vincPatientToTutor = (patientId, tutorId) => {
    petsService
      .assignPatientToTutor({ holder: tutorId, patient: patientId })
      .then((_res) => fetchData());
  };

  const fastCreate = useCallback(() => {
    if (!data?.tutorOriginId) {
      return notification.warning({
        message: "Informe como conheceu a clinica",
      });
    }

    setLoading(true);
    petsService
      .fastPatientRegister({
        ...data,
        ...patientData,
        tutorPhone: masks?.noPhone(data?.tutorPhone),
      })
      .then((res) => {
        setSearch(res?.data?.tutor?.name);
        setPayload({
          ...payload,
          tutor_id: res?.data?.tutor?.id,
          patient_id: res?.data?.patient?.id,
          tutorName: res?.data?.tutor?.name,
          contactId: res?.data?.tutor?.id,
          patientName: res?.data?.patient?.name,
          clientId: res?.data?.patient?.id,
          originId: data?.tutorOriginId,
        });
        setTutorsReload && setTutorsReload((prv) => !prv);
        res?.data?.patient?.id &&
          vincPatientToTutor(res?.data?.patient?.id, res?.data?.tutor?.id);
        setLoading(false);
        setVisible(false);
        setData({});
        setPatientData({});
        fetchData();
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Verifique os campos informados",
        });
      });
  }, [patientData, data]);

  const verifyTutorName = (name, phone) => {
    if (name === "" || !name) {
      return `Nao informado - ${phone}`;
    }
    return name;
  };

  const createOnlyTutor = useCallback(() => {
    let message = false;
    if (!data?.tutorOriginId) {
      message = "Informe como conheceu a clinica";
    }

    if (!data?.tutorPhone || data?.tutorPhone === "") {
      message = "Informe o telefone para contato";
    }

    if (data?.tutorPhone?.length < 15) {
      console.log("aoo potencia");
      message = "o telefone precisa ter 11 digitos";
    }

    if (message) {
      return notification.warning({ message });
    } else {
      setLoading(true);
      petsService
        .createTutor({
          name: verifyTutorName(data?.tutorName, data?.tutorPhone),
          cellphone: masks.noPhone(data?.tutorPhone),
          clientOriginId: data?.tutorOriginId,
          tutorOriginId: data?.tutorOriginId,
          clientOriginItemDescription: data?.clientOriginItemDescription,
        })
        .then((res) => {
          process.env.client === "sancla"
            ? setPayload({
                ...payload,
                tutor_id: res?.data?.id,
                contactId: res.data.id,
                tutorName: res.data?.name,
                contact: { cellphone: data?.tutorPhone },
                originDescription: data?.originDescription,
                originId: data?.tutorOriginId,
                clientOriginItemDescription: data?.clientOriginItemDescription,
              })
            : setPayload({
                ...payload,
                patientName: res?.data?.name,
                patient_id: res.data?.id,
                tutorName: res.data.name,
                contactId: res.data.id,
                contact: { cellphone: data?.tutorPhone },
                originDescription: data?.originDescription,
                originId: data?.tutorOriginId,
                clientOriginItemDescription: data?.clientOriginItemDescription,
              });
          process.env.client === "sancla" &&
            vincPatientToTutor(patientData?.id, res?.data?.id);
          setTutorsReload && setTutorsReload((prv) => !prv);
          // setSearch(res?.data?.name);
          setVisible(false);
        })
        .catch((err) => {
          setLoading(false);
          notification.error({ message: "Verifique os campos informados" });
        })
        .finally(() => {
          setLoading(false);
          // fetchData();
        });
    }
  }, [data, patientData]);

  return (
    <>
      <Modal
        visible={visible}
        confirmLoading={loading}
        onCancel={() => setVisible(false)}
        onOk={() => submitButton.current.click()}
        title={
          process.env.client === "liftone"
            ? "Cadastro rápido de Clientes"
            : "Cadastro rápido de tutor e paciente"
        }
        width={900}
      >
        <form
          className="uk-flex uk-flex-around"
          onSubmit={(e) => {
            e.preventDefault();
            !patientSubmit || process.env.client === "liftone"
              ? createOnlyTutor()
              : fastCreate();
          }}
        >
          <section className="uk-width-1-3">
            {process.env.client !== "liftone" && (
              <>
                Tutor
                <hr />
              </>
            )}
            <div className="uk-margin-small">
              <label>Nome</label>
              <input
                className="uk-input"
                type="text"
                placeholder="Digite o nome completo"
                value={data?.tutorName}
                onChange={(e) =>
                  setData({
                    ...data,
                    tutorName: e.target.value,
                  })
                }
              />
            </div>
            <div className="uk-margin-small">
              <label>Telefone</label>
              <input
                className="uk-input"
                type="text"
                required
                minLength="14"
                maxLength="15"
                value={data?.tutorPhone}
                onBlur={() => {
                  if (data?.tutorPhone?.length < 15) {
                    notification.warning({
                      message: "O telefone precisa ter 11 digitos",
                    });
                  }
                }}
                onChange={(e) => {
                  e.target.value.length >= 14 &&
                    checkPhone(masks?.noPhone(e.target.value));
                  setData({
                    ...data,
                    tutorPhone: masks.phone(e.target.value),
                  });
                }}
                placeholder="(00) 90000-0000"
              />
            </div>
            <div className="uk-margin-small">
              <label>Como conheceu a clinica</label>
              <AutoComplete
                className="uk-width-1-1"
                options={tutorOrigins?.map((origin) => ({
                  ...origin,
                  value: origin?.description,
                  key: origin?.id,
                }))}
                value={data?.originDescription}
                onChange={(val) => setData({ ...data, originDescription: val })}
                onSelect={(_, opt) => {
                  setData({
                    ...data,
                    tutorOriginId: opt?.id,
                    originDescription: opt?.value,
                  });
                  setSelectedOrigin(opt);
                }}
                filterOption={(val, opt) =>
                  normalizeStr(opt?.value.toUpperCase()).includes(
                    normalizeStr(val?.toUpperCase())
                  )
                }
              />
            </div>
            {selectedOrigin?.default && (
              <div>
                <label>Campanha mídia</label>
                <AutoComplete
                  className="uk-width-1-1"
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
              </div>
            )}
          </section>
          {process.env.client !== "liftone" && (
            <section className="uk-width-1-3">
              Paciente
              <hr />
              <div className="uk-margin-small">
                <label>Nome</label>
                <br />
                <AutoComplete
                  options={[
                    ...(!!allPatients
                      ? allPatients.map((item) => ({
                          value: item.id,
                          label: item.name,
                        }))
                      : []),
                  ]}
                  type="text"
                  placeholder="Selecione ou informe o nome do novo paciente"
                  className="uk-width-1-1"
                  value={
                    patientData?.patientName
                      ? patientData?.patientName
                      : patientData?.name
                  }
                  onSelect={(e) => {
                    setPatientSubmit(false);
                    setPatientData(allPatients.find((item) => item?.id === e));
                    setPayload({ ...payload, patient_id: e });
                  }}
                  onChange={(e) => {
                    setPatientSubmit(true);
                    setPatientData({
                      ...patientData,
                      patientName: e,
                    });
                    if (e === "") {
                      setPatientData({ ...payload, patientName: "" });
                    }
                  }}
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div className="uk-margin-small uk-width-1-1">
                <label>Raça</label>
                <select
                  disabled={!patientSubmit}
                  className="uk-select uk-width-1-1"
                  value={
                    patientData?.patientRaceId
                      ? patientData?.patientRaceId
                      : patientData?.patientAnimal?.race?.id
                  }
                  onChange={(e) =>
                    setPatientData({
                      ...patientData,
                      patientRaceId: e.target.value,
                    })
                  }
                >
                  <option value="">Selecione uma opção</option>
                  {(races || []).map((item, i) => (
                    <option value={item.id}>{item.description}</option>
                  ))}
                </select>
              </div>
              <div className="uk-margin-small">
                <label>Gênero</label>
                <select
                  id={"gender"}
                  className="uk-select uk-width-1-1"
                  disabled={!patientSubmit}
                  value={
                    patientData?.patientGender
                      ? patientData?.patientGender
                      : patientData?.gender
                  }
                  onChange={(e) =>
                    setPatientData({
                      ...patientData,
                      patientGender: e.target.value,
                    })
                  }
                >
                  <option>Selecione</option>
                  <option value="male">Macho</option>
                  <option value="female">Fêmea</option>
                </select>
              </div>
            </section>
          )}
          <button
            className="uk-hidden"
            type="submit"
            ref={submitButton}
          ></button>
        </form>
      </Modal>
      <Modal
        visible={tutorInfoVisible}
        onCancel={() => setTutorInfoVisible(false)}
        onOk={() => {
          setPayload((prv) => ({
            ...prv,
            tutor_id: selectedTutor?.id,
            tutorName: selectedTutor?.name,
            contactId: selectedTutor?.id,
            clientId: selectedTutor?.id,
            originDescription: selectedTutor?.clientOrigin?.description,
            originId: selectedTutor?.clientOrigin?.id,
          }));
          setTutorInfoVisible(false);
          setVisible(false);
        }}
        title="Selecionar paciente"
      >
        <section>
          <div>
            Cliente(s) vinculados ao telefone
            <AutoComplete
              className="uk-width-1-1"
              options={tutorInfo?.map((tutor) => ({
                ...tutor,
                value: tutor?.name,
                key: tutor?.id,
              }))}
              value={selectedTutor?.name}
              onChange={(val) =>
                setSelectedTutor((prv) => ({ ...prv, name: val }))
              }
              onSelect={(_, opt) => {
                setSelectedTutor(opt);
              }}
              filterOption={(val, opt) =>
                normalizeStr(opt?.value.toUpperCase()).includes(
                  normalizeStr(val?.toUpperCase())
                )
              }
            />
          </div>
          {process.env.client !== "liftone" && (
            <div className="uk-margin-small-top">
              <label>Selecionar Pet</label>
              <Select
                className="uk-width-1-1"
                onChange={(val) => {
                  const patient = selectedTutor?.dependents.find(
                    (dp) => dp?.id === val
                  );
                  setPayload({
                    ...payload,
                    patientName: patient?.name,
                    clientId: patient?.id,
                  });
                }}
              >
                {selectedTutor.dependents &&
                  selectedTutor?.dependents.map((pat) => (
                    <Option value={pat?.id} key={pat?.id}>
                      {pat?.name}
                    </Option>
                  ))}
              </Select>
            </div>
          )}
        </section>
      </Modal>
    </>
  );
}

FastCreateTutor.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};
