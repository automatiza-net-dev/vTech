// @ts-nocheck
import React, { useCallback, useEffect, useState } from "react";

import { usePatientAnimalHairTypes } from "@/OLD/hooks/usePatientAnimal";

import {
  AutoComplete,
  Button,
  Form,
  Input,
  notification,
  Select,
  Upload,
  Switch,
} from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import { petsService } from "@/OLD/services/patient.service";
import { animalServices } from "@/OLD/services/animal.service";
import { ModalCreateTutor } from "./Modal";
import dynamic from "next/dynamic";

const ImgCrop = dynamic(() => import("antd-img-crop"), { ssr: false });
const { Option } = Select;

// Components
import { Create as CreateRace } from "../../Races/Create";

import { normalizeStr } from "@/OLD/utils/normalizeString";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

export const FormChild = React.memo(function FormChild({
  data,
  setData,
  setPhoto,
  tutors,
  setTutors,
  selectedTutors,
  setSelectedTutors,
  setRefreshTutors,
  tutorToVinc,
}) {
  const [fileList, setFileList] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshAutoComplete, setRefreshAutoComplete] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [races, setRaces] = useState([]);
  const [newRaceOpen, setNewRaceOpen] = useState(false);
  const [formatedTutors, setFormatedTutors] = useState([]);
  const [reload, setReload] = useState(false);

  const { Option } = AutoComplete;

  const { hairTypes } = usePatientAnimalHairTypes();

  const canCreateTutor = useUserHasPermission("TUT01");

  const getAllRaces = useCallback(() => {
    setLoading(true);
    animalServices
      .getRaces({ description: "" })
      .then((res) => {
        res.sort((a, b) => {
          const valueA =
            `${a.specie.description} > ${a.description}`.toUpperCase();
          const valueB =
            `${b.specie.description} > ${b.description}`.toUpperCase();
          return valueA.localeCompare(valueB);
        });
        setRaces(
          res.map((race) => {
            return {
              value: `${race.specie.description} > ${race.description}`,
              id: race.id,
            };
          })
        );
      })
      .catch((err) => {
        notification.error({
          message: "Houve um erro ao obter as raças disponíveis",
        });
      });
  }, [refreshAutoComplete]);

  const handleCreateOptions = useCallback(() => {
    setLoading(true);
    petsService
      .getTutors()
      .then((res) => {
        setOptions(
          res.data.map((tutor) => {
            return { value: tutor.name, id: tutor.id };
          })
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refreshAutoComplete]);

  useEffect(() => {
    handleCreateOptions();
    getAllRaces();
    if (tutorToVinc) {
      setData({
        ...data,
        holderId: tutorToVinc,
      });
    }
  }, [refreshAutoComplete, tutorToVinc]);

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
          <span>Dados do paciente</span>
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
                {fileList.length === 0 && "+ Imagem"}
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
                  loading={loading}
                  onChange={(e) => {
                    const choosed = races.find((option) => option.value === e);
                    setData({ ...data, raceId: choosed?.id });
                  }}
                  placeholder="Digite o nome da raça"
                  filterOption={(inputValue, option) =>
                    option.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                >
                  {races.map((option, key) => {
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
              <Form.Item label="Gênero" className="uk-width-1-2">
                <Select
                  id={"gender"}
                  value={data?.gender}
                  onChange={(e) => setData({ ...data, gender: e })}
                >
                  <option value="male">Macho</option>
                  <option value="female">Fêmea</option>
                </Select>
              </Form.Item>
              <Form.Item label="Data de nascimento" className="uk-width-1-2">
                <DatePicker
                  slotProps={{ textField: { variant: "standard" } }}
                  id={"birthDate"}
                  type="date"
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
            </div>
            <div className="uk-flex">
              <Form.Item label="Tag" className="uk-width-1-2 uk-margin-right">
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
            <div className="uk-flex">
              <Form.Item
                label="O paciente é castrado?"
                className="uk-flex uk-width-1-2 uk-margin-right"
              >
                <Select
                  className="uk-width-1-1"
                  onChange={(val) => setData({ ...data, castrated: val })}
                >
                  <Option value="true">Sim</Option>
                  <Option value="false">Não</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Microchip" className="uk-width-1-2">
                <Input
                  onChange={(e) =>
                    setData({ ...data, microchip: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item
                label="Tipo de pelagem do paciente"
                className="uk-flex uk-width-1-2 uk-margin-left"
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
          </div>
        </div>
      </div>
      <div>
        {!tutorToVinc ? (
          <>
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
                    option.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
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
                <Button
                  className="uk-margin-small-right"
                  type="primary"
                  onClick={() => {
                    if (data?.holder?.id) {
                      const checkTutor = selectedTutors?.find(
                        (tutor) => tutor?.id === data?.holder?.id
                      );
                      if (!checkTutor) {
                        return setSelectedTutors([
                          ...selectedTutors,
                          data?.holder,
                        ]);
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
                {canCreateTutor && (
                  <Button onClick={() => setIsOpen(true)}>Novo tutor</Button>
                )}
              </div>
            </Form.Item>
          </>
        ) : (
          <div className="uk-text-muted uk-text-center">
            Tutor já selecionado
          </div>
        )}
      </div>
      <ModalCreateTutor
        setRefreshAutoComplete={setRefreshAutoComplete}
        refreshAutoComplete={refreshAutoComplete}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setCreatedTutor={setData}
        setRefreshTutors={setRefreshTutors}
      />
      <CreateRace
        visible={newRaceOpen}
        fetchRaces={getAllRaces}
        refreshAutoComplete={refreshAutoComplete}
        setVisible={setNewRaceOpen}
        button={false}
      />
    </div>
  );
});
