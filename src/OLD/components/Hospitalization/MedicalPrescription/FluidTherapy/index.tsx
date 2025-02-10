
// @ts-nocheck
// Core
import React, { memo, useState, useEffect, useCallback } from "react";

// Components
import { AutoComplete, Input, Select } from "antd";
const { Option } = Select;

// Services
import { unitsService } from "@/OLD/services/units.service";
import { drugsAdministrationsService } from "@/OLD/services/drugsAdministrations.service";

// Utils
import { sortItems } from "@/OLD/utils/sortItems";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { useToast } from "infinity-forge";

const FluidTherapy = memo(function FluidTherapy({ state, setState }) {
  const [allDrugsAdministrations, setAllDrugsAdministrations] = useState([]);
  const [allMedicamentUnits, setAllMedicamentUnits] = useState([]);
  const [allSpeedFluidUnits, setAllSpeedFluidUnits] = useState([]);

  const {createToast} = useToast()

  const getAllMedicamentUnits = useCallback(() => {
    unitsService
      .listUnits("MEDICINE")
      .then((res) => {
        sortItems(res.data, "tag");
        setAllMedicamentUnits(res.data);
      })
      .catch((_err) => {
        return  createToast({ status: "error", message:  "Houve um erro ao buscar as unidades do medicamento disponíveis" })
      });
  }, []);

  const getAllSpeedFluidUnits = useCallback(() => {
    unitsService
      .listUnits("FLUID_VELOCITY")
      .then((res) => {
        sortItems(res.data, "tag");
        setAllSpeedFluidUnits(res.data);
      })
      .catch((_err) => {
        return createToast({ status: "error", message:  "Houve um erro ao buscar as unidades do medicamento disponíveis" })
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

        return createToast({ status: "error", message: "Houve um erro ao buscar as administrações de medicamentos disponíveis"  })
      });
  }, []);

  useEffect(() => {
    getAllMedicamentUnits();
    getAllSpeedFluidUnits();
    getAllDrugsAdministrations();
  }, [getAllMedicamentUnits, getAllSpeedFluidUnits, getAllDrugsAdministrations]);

  return (
    <>
      <div className="uk-width-5-6 uk-margin-small-right uk-margin-top">
        <label>Fluido</label>
        <Input
          required
          value={state?.description}
          onChange={(e) => setState({ ...state, description: e.target.value })}
        />
      </div>
      <section className="uk-margin-top">
        <div className="uk-flex">
          <div className="uk-width-1-6 uk-margin-small-right">
            <label>Dose</label>
            <Input
              required
              value={state?.dose}
              type="number"
              onChange={(e) => setState({ ...state, dose: e.target.value })}
            />
          </div>
          <div className="uk-width-1-5 uk-margin-small-right">
            <label>Unidade</label>
            <br />
            <AutoComplete
              required
              className="uk-width-1-1"
              options={allMedicamentUnits.map((item) => ({
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
          <div className="uk-width-1-6 uk-margin-small-right">
            <label>Via de aplicação</label>
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
          <div className="uk-width-1-6">
            <label>Volume</label>
            <Input
              required
              value={state?.volume}
              onChange={(e) =>
                setState({
                  ...state,
                  volume: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="uk-flex uk-margin-top">
          <div className="uk-width-1-5 uk-margin-small-right">
            <label>Equipo</label>
            <br />
            <Select
              required
              value={state?.fluidSet}
              className="uk-width-1-1"
              onChange={(e) => setState({ ...state, fluidSet: e })}
            >
              <Option value="MACRODROPS">Macro gotas</Option>
              <Option value="MICRODROPS">Micro gotas</Option>
            </Select>
          </div>
          <div className="uk-width-1-6 uk-margin-small-right">
            <label>Velocidade</label>
            <Input
              required
              type="number"
              onChange={(e) =>
                setState({ ...state, fluidSpeed: e.target.value })
              }
              value={state?.fluidSpeed}
            />
          </div>
          <div className="uk-width-1-6 uk-margin-small-right">
            <label>Unidade Velocidade</label>
            <br />
            <AutoComplete
              required
              className="uk-width-1-1"
              options={allSpeedFluidUnits.map((item) => ({
                ...item,
                value: item?.tag,
              }))}
              value={state?.fluidUnitDescription}
              onChange={(val) => {
                setState({ ...state, fluidUnitDescription: val });
              }}
              onSelect={(_val, opt) => {
                setState({
                  ...state,
                  fluidUnitId: opt.id,
                  fluidUnitDescription: opt.value,
                });
              }}
              filterOption={(val, opt) =>
                normalizeStr(opt?.tag?.toUpperCase()).includes(
                  normalizeStr(val?.toUpperCase())
                )
              }
            />
          </div>
          <div>
            <label>Suplemento</label>
            <Input
              required
              value={state?.supplement}
              onChange={(e) =>
                setState({ ...state, supplement: e.target.value })
              }
            />
          </div>
        </div>
      </section>
    </>
  );
});

export default FluidTherapy;
