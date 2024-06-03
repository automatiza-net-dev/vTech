// @ts-nocheck
// Core
import React, { memo, useEffect, useCallback, useState } from "react";

// Components
import { Select, Input, notification, AutoComplete } from "antd";
const { Option } = Select;

// Services
import { unitsService } from "@/OLD/services/units.service";
import { drugsAdministrationsService } from "@/OLD/services/drugsAdministrations.service";

// Utils
import { sortItems } from "@/OLD/utils/sortItems";
import { normalizeStr } from "@/OLD/utils/normalizeString";

const MedicamentForm = memo(function MedicamentForm({ state, setState }) {
  const [allUnits, setAllUnits] = useState([]);
  const [allDrugsAdministrations, setAllDrugsAdministrations] = useState([]);

  const getAllUnits = useCallback(() => {
    unitsService
      .listUnits("MEDICINE")
      .then((res) => {
        sortItems(res.data, "name");
        setAllUnits(res.data);
      })
      .catch((_err) => {
        return notification.error({
          message:
            "Houve um erro ao buscar as unidades do medicamento disponíveis",
        });
      });
  }, []);

  const getAllDrugsAdministrations = useCallback(() => {
    drugsAdministrationsService
      .listDrugsAdministrations()
      .then((res) => {
        sortItems(res.data, "description");
        setAllDrugsAdministrations(res.data);
      })
      .catch((_err) => {
        return notification.error({
          message:
            "Houve um erro ao buscar as administrações de medicamentos disponíveis",
        });
      });
  }, []);

  useEffect(() => {
    getAllUnits();
    getAllDrugsAdministrations();
  }, [getAllUnits, getAllDrugsAdministrations]);

  return (
    <>
      <div className="uk-width-3-4 uk-margin-small-right uk-margin-top">
        <label>Medicamento</label>
        <Input
          required
          onChange={(e) => setState({ ...state, description: e.target.value })}
          value={state?.description}
        />
      </div>
      <section
        className="uk-flex uk-margin-top uk-width-1-1"
        style={{ gap: 10 }}
      >
        <div className="uk-width-1-1">
          <label>Dose</label>
          <Input
            required
            type="number"
            value={state?.dose}
            onChange={(e) => setState({ ...state, dose: e.target.value })}
          />
        </div>
        <div className="uk-width-1-1">
          <label>Unidade</label>
          <br />
          <AutoComplete
            required
            className="uk-width-1-1"
            options={allUnits.map((item) => ({
              ...item,
              value: item?.name,
            }))}
            value={state?.prescriptionUnitDescription}
            onChange={(val) => {
              setState({ ...state, prescriptionUnitDescription: val });
            }}
            onSelect={(_val, opt) => {
              setState({
                ...state,
                prescriptionUnitId: opt.id,
                prescriptionUnitDescription: opt.name,
              });
            }}
            filterOption={(val, opt) =>
              normalizeStr(opt?.name?.toUpperCase()).includes(
                normalizeStr(val?.toUpperCase())
              )
            }
          />
        </div>
        <div className="uk-width-1-1">
          <label>Via aplicação</label>
          <br />
          <AutoComplete
            required
            className="uk-width-1-1"
            options={allDrugsAdministrations.map((item) => ({
              ...item,
              value: item?.description,
            }))}
            value={state?.drugAdministrationDescription}
            onChange={(val) => {
              setState({ ...state, drugAdministrationDescription: val });
            }}
            onSelect={(val, opt) => {
              setState({
                ...state,
                drugAdministrationId: opt.id,
                drugAdministrationDescription: opt.description,
              });
            }}
            filterOption={(val, opt) =>
              normalizeStr(opt?.description?.toUpperCase()).includes(
                normalizeStr(val?.toUpperCase())
              )
            }
          />
        </div>
        <div className="uk-width-1-1">
          <label>Volume</label>
          <Input
            required
            value={state?.volume}
            onChange={(e) => setState({ ...state, volume: e.target.value })}
          />
        </div>
      </section>
    </>
  );
});

export default MedicamentForm;
