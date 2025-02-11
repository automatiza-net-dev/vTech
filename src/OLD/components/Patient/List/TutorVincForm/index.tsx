// @ts-nocheck
// Core
import React, { memo, useState, useEffect, useCallback } from "react";

// Services
import { petsService } from "@/OLD/services/patient.service";

// Hooks
import { useTutor } from "@/OLD/hooks/useTutor";

// Components
import { AutoComplete, Button, Popconfirm, Modal } from "antd";
import { CreateTutor } from "@/OLD/components/Tutor/Create";

// Utils
import Masks from "@/OLD/utils/masks";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { useToast } from "infinity-forge";

const TutorVincForm = memo(function TutorVincForm({
  patient,
  setVisible,
  setReload,
  reload,
  isButtonCreateTutor,
  querySchedule,
}) {
  const [tutor, setTutor] = useState({});
  const [loading, setLoading] = useState(false);
  const [formatedTutors, setFormatedTutors] = useState([]);
  const [createTutorVisible, setCreateTutorVisible] = useState(false);
  const { tutors } = useTutor();

  const canCreateTutor = useUserHasPermission("TUT01");

  const {createToast} = useToast()

  const formatTutors = () => {
    setFormatedTutors(
      tutors.map((tutor) => {
        return {
          ...tutor,
          key: tutor?.id,
          value: `${tutor?.name} / ${
            tutor?.document ? tutor?.document + "/ " : ""
          } ${Masks.phone(tutor?.cellphone || "")}`,
        };
      })
    );
  };

  useEffect(() => {
    tutors?.length > 0 && formatTutors();
  }, [tutors]);

  const submitVinc = useCallback(() => {
    setLoading(true);
    petsService
      .assignPatientToTutor({
        holder: tutor?.tutorId,
        patient: patient?.id,
      })
      .then((_res) => {
        setLoading(false);
        createToast({ status: "success", message: "Tutor vinculado com sucesso!" })
      })
      .catch((_err) => {
        setLoading(false);

        return   createToast({ status: "error", message: "Houve um erro ao vincular o tutor..." })
    
      });
  }, [tutor, patient]);

  const submitActiveTutor = useCallback(() => {
    setLoading(true);

    petsService
      .setMainTutor(patient?.id, tutor?.tutorId)
      .then(() => {
        setLoading(false);
        setTutor({});
        setReload(!reload);
        setVisible(false);
      })
      .catch((_err) => setLoading(false));
  }, [tutor, patient]);

  return (
    <div>
      <label>Selecione o tutor a ser vinculado</label>
      <AutoComplete
        className="uk-width-1-1"
        required
        options={formatedTutors}
        value={tutor?.tutorName}
        onChange={(e) => setTutor({ ...tutor, tutorName: e })}
        onSelect={(inputValue, option) =>
          setTutor({
            ...tutor,
            tutorName: inputValue,
            tutorId: option?.id,
          })
        }
        filterOption={(inputValue, option) => {
          if (
            normalizeStr(option?.name.toUpperCase()).includes(
              normalizeStr(inputValue.toUpperCase())
            )
          ) {
            return option;
          }
        }}
      />
      <hr />
      <footer className="uk-flex uk-flex-right">
        <Popconfirm
          title="Deseja tornar esse tutor como ativo?"
          onCancel={() => {
            setReload(!reload)
            setVisible(false);
          }}
          onConfirm={() => submitActiveTutor()}
        >
          <Button
            type="primary"
            className="uk-margin-right"
            onClick={() => submitVinc()}
            loading={loading}
          >
            Vincular
          </Button>
        </Popconfirm>
        {isButtonCreateTutor && canCreateTutor && (
          <Button
            className="uk-margin-right"
            onClick={() => setCreateTutorVisible(true)}
          >
            Novo Tutor
          </Button>
        )}
        <Button onClick={() => (setVisible(false), setTutor({}))}>
          {" "}
          Cancelar{" "}
        </Button>
      </footer>

      <Modal
        visible={createTutorVisible}
        width={1200}
        onCancel={() => setCreateTutorVisible(false)}
        footer={null}
      >
        <CreateTutor setVisible={setCreateTutorVisible} />
      </Modal>
    </div>
  );
});

export default TutorVincForm;
