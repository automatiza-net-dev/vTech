// @ts-nocheck
import React, { useState, useCallback, useEffect } from "react";
import { useTutor } from "@/OLD/hooks/useTutor";

import { usePatientAnimalHairTypes } from "@/OLD/hooks/usePatientAnimal";

import {
  Form,
  Input,
  Select,
  Switch,
  Upload,
  AutoComplete,
  Button,
  notification,
  Popconfirm,
} from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import { ModalCreateTutor } from "../Create/Modal";

import dynamic from "next/dynamic";

import { animalServices } from "@/OLD/services/animal.service";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
const ImgCrop = dynamic(() => import("antd-img-crop"), { ssr: false });

export const FormChild = React.memo(function FormChild({
  data,
  setData,
  setPhoto,
  selectedTutors,
  setSelectedTutors,
  setActiveTutor,
}) {
  const [fileList, setFileList] = React.useState([]);
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previousRace, setPreviousRace] = useState();
  const [formatedTutors, setFormatedTutors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [reload, setReload] = useState(false);

  const { tutors } = useTutor(false, reload);
  const { Option } = AutoComplete;

  const { hairTypes } = usePatientAnimalHairTypes();

  const canCreateTutor = useUserHasPermission("TUT01");

  const getAllRaces = useCallback(() => {
    setLoading(true);
    animalServices
      .getRaces({ description: "" })
      .then((res) => {
        res.sort((a, b) =>
          `${a?.specie?.description} > ${a?.description}`.localeCompare(
            `${b?.specie?.description} > ${b?.description}`
          )
        );
        setRaces(
          res.map((race) => {
            return {
              value: `${race?.specie?.description} > ${race?.description}`,
              id: race.id,
            };
          })
        );
        let previous = res.find(
          (item) => item?.id === data?.patientAnimal?.race?.id
        );
        setPreviousRace(
          `${previous?.specie.description} > ${previous?.description}`
        );
      })
      .catch((_err) => {
        notification.error({
          message: "Houve um erro ao obter as raças disponíveis",
        });
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, [data?.patientAnimal?.race?.id]);

  const formatTutors = () => {
    setFormatedTutors(
      tutors.map((tutor) => {
        return {
          ...tutor,
          value: tutor?.name,
        };
      })
    );
  };

  useEffect(() => {
    tutors?.length > 0 && formatTutors();
  }, [tutors, reload]);

  useEffect(() => {
    getAllRaces();
  }, [getAllRaces]);

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
          <span>Dados</span>
        </h5>
        <div className="uk-flex uk-flex-between">
          <Form.Item label="Perfil">
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
                {data?.photo ? (
                  <img src={`${process.env.NEXT_PUBLIC_API}${data?.photo}`} />
                ) : (
                  fileList.length === 0 && "+ Imagem"
                )}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <div className="uk-width-5-6">
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

              <Form.Item
                label="Espécie > Raça do paciente"
                className="uk-width-1-2"
              >
                <AutoComplete
                  required
                  className="uk-width-1-1"
                  loading={loading}
                  value={previousRace ? previousRace : data?.raceId?.value}
                  onChange={(e) => {
                    setPreviousRace(false);
                    const choosed = races.find((option) => option.value === e);

                    choosed
                      ? setData({ ...data, raceId: choosed })
                      : setData({ ...data, raceId: e });
                  }}
                  placeholder="Digite o nome da raça"
                  filterOption={(inputValue, option) =>
                    option.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                >
                  {races.length > 0 &&
                    races.map((option, key) => {
                      return (
                        <Option key={key} value={option.value}>
                          {option.value}
                        </Option>
                      );
                    })}
                  <Option value="">
                    <Button
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      onClick={() => setNewRaceOpen(true)}
                    >
                      Cadastrar nova raça +
                    </Button>
                  </Option>
                </AutoComplete>
              </Form.Item>
            </div>
            <div
              className="uk-flex"
              style={{
                gap: "30px",
              }}
            >
              <Form.Item
                label="Gênero"
                className="uk-width-1-2 uk-margin-small-right"
              >
                <Select
                  id={"gender"}
                  value={data?.gender}
                  required
                  onChange={(e) => setData({ ...data, gender: e })}
                >
                  <option value="male">Macho</option>
                  <option value="female">Fêmea</option>
                </Select>
              </Form.Item>
              <Form.Item label="Data de nascimento" className="uk-width-2-5">
                <DatePicker
                  className="uk-width-1-1"
                  slotProps={{ textField: { variant: "standard" } }}
                  id={"birthDate"}
                  value={data?.birthDate}
                  onChange={(val) => setData({ ...data, birthDate: val })}
                />
              </Form.Item>
              <Form.Item label="Comunidade Sanclá">
                <Switch
                  checked={data?.community}
                  onChange={(val) => setData({ ...data, community: val })}
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
            </div>
            <div className="uk-flex" style={{ gap: "30px" }}>
              <Form.Item label="Tag" className="uk-width-1-2">
                <Input
                  id={"tag"}
                  type="text"
                  value={data?.tags}
                  onChange={(e) => setData({ ...data, tags: e.target.value })}
                />
              </Form.Item>
              <Form.Item
                label="O paciente é vacinado?"
                className="uk-width-1-2"
              >
                <Select
                  value={data?.vaccineOrigin}
                  className="uk-width-1-1"
                  onChange={(e) => setData({ ...data, vaccineOrigin: e })}
                >
                  <Option value="PROPRIA_CLINICA">
                    Vacinado na própria clinica
                  </Option>
                  <Option value="FORA_DA_CLINICA">
                    Vacinado fora da clinica
                  </Option>
                  <Option value="NAO_VACINADO">
                    Não vacinado / sem conhecimento
                  </Option>
                </Select>
              </Form.Item>
            </div>
            <div className="uk-flex" style={{ gap: "30px" }}>
              <Form.Item
                label="O paciente é castrado?"
                className="uk-width-1-3"
              >
                <Select
                  className="uk-width-1-1"
                  value={data?.castrated}
                  onChange={(val) => setData({ ...data, castrated: val })}
                >
                  <Option value="true">Sim</Option>
                  <Option value="false">Não</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Microchip" className="uk-width-1-3">
                <Input
                  value={data?.microchip}
                  onChange={(e) =>
                    setData({ ...data, microchip: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item
                label="Tipo de pelagem do paciente"
                className="uk-width-1-3"
              >
                <AutoComplete
                  value={
                    hairTypes.find((hair) => hair.id === data?.hairId)
                      ?.description
                  }
                  className="uk-width-1-1"
                  onChange={(val) => setData({ ...data, hairId: val })}
                  onSelect={(_, opt) =>
                    setData({
                      ...data,
                      hairId: opt?.id,
                    })
                  }
                  options={hairTypes.map((hair) => ({
                    ...hair,
                    value: hair?.description,
                  }))}
                  filterOption={(value, option) =>
                    normalizeStr(option.value.toUpperCase()).includes(
                      normalizeStr(value.toUpperCase())
                    )
                  }
                />
              </Form.Item>
            </div>
            <div className="uk-flex" style={{ gap: "30px" }}>
              <Form.Item
                label="O paciente veio a óbito?"
                className="uk-width-1-4"
              >
                <Select
                  value={data?.death}
                  className="uk-width-1-1"
                  onChange={(val) => setData({ ...data, death: val })}
                >
                  <Option value="true">Sim</Option>
                  <Option value="false">Não</Option>
                </Select>
              </Form.Item>
              {data?.death === "true" && (
                <Form.Item label="Data do óbito" className="uk-width-1-4">
                  <DatePicker
                    slotProps={{ textField: { variant: "standard" } }}
                    className="uk-width-1-1"
                    value={data?.deathDate}
                    onChange={(val) => setData({ ...data, deathDate: val })}
                  />
                </Form.Item>
              )}
            </div>
          </div>
        </div>
      </div>
      <h5 className="uk-heading-line uk-margin-remove">
        <span>Tutores</span>
      </h5>
      <p className="uk-text-muted">
        {data?.tutors?.length > 0 &&
          data?.tutors.map((tutor) => `${tutor?.name} |`)}
        {selectedTutors?.length > 0 &&
          selectedTutors?.map((tutor) => ` ${tutor?.name} |`)}
      </p>
      <Form.Item label="Tutor" className="uk-width-1-2">
        <div className="uk-flex">
          <AutoComplete
            loading={loading}
            className="uk-margin-small-right"
            onChange={(e) => {
              const choosed = formatedTutors.find(
                (option) => option.value === e
              );
              setData({
                ...data,
                holder: { id: choosed?.id, name: choosed?.value },
              });
            }}
            placeholder="Digite o nome do tutor"
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          >
            {formatedTutors.map((option, key) => {
              return (
                <Option key={key} value={option.value}>
                  {option.value}
                </Option>
              );
            })}
          </AutoComplete>
          <Popconfirm
            title={`Deseja definir ${data?.holder?.name} como o tutor ativo?`}
            onConfirm={() => setActiveTutor(data?.holder)}
            okText="Sim"
            cancelText="Não"
          >
            <Button
              className="uk-margin-small-right"
              type="primary"
              onClick={() => {
                if (data?.holder?.id) {
                  const checkTutor = selectedTutors?.find(
                    (tutor) => tutor?.id === data?.holder?.id
                  );
                  if (!checkTutor) {
                    return setSelectedTutors([...selectedTutors, data?.holder]);
                  }
                  return notification.error({
                    message: "Tutor já adicionado",
                  });
                }
              }}
            >
              {" "}
              Vincular{" "}
            </Button>
          </Popconfirm>
          {canCreateTutor && (
            <Button onClick={() => setIsOpen(true)}>Novo tutor</Button>
          )}
        </div>
      </Form.Item>
      <ModalCreateTutor
        setRefreshAutoComplete={setReload}
        refreshAutoComplete={reload}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setCreatedTutor={setData}
      />
    </div>
  );
});
