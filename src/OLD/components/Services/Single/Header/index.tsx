// @ts-nocheck
import { memo } from "react";

import { useSubgroups } from "@/OLD/hooks/useSubgroup";
import { useTaxationGroups } from "@/OLD/hooks/useTaxationGroups";

import { Input, Switch, AutoComplete, Select } from "antd";
const { Option } = Select;

import moment from "moment";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { sortItems } from "@/OLD/utils/sortItems";

const Header = memo(function Header({ service, setService }) {
  const { subgroups } = useSubgroups();
  const { taxationGroups } = useTaxationGroups();

  sortItems(subgroups, "description");
  sortItems(taxationGroups, "name");

  return (
    <section>
      <div className="uk-flex uk-width-1-1">
        <div className="uk-margin-small-right uk-width-2-3">
          <label>Descrição</label>
          <Input
            value={service?.description}
            onChange={(e) =>
              setService((prv) => ({ ...prv, description: e.target.value }))
            }
          />
        </div>
        <div className="uk-width-1-4 uk-margin-small-right">
          <label>Código de referência</label>
          <Input
            value={service?.referenceCode}
            onChange={(e) =>
              setService((prv) => ({ ...prv, referenceCode: e.target.value }))
            }
          />
        </div>
        <div className="uk-width-1-4 uk-margin-small-right">
          <label>Data de criação</label>
          <Input
            disabled
            value={moment(service?.created_at).format("DD/MM/YYYY")}
          />
        </div>
        <div className="uk-margin-small-right uk-width-1-4">
          <label>Ativo</label>
          <br />
          <Switch
            checked={service?.active}
            onChange={(val) => setService((prv) => ({ ...prv, active: val }))}
          />
        </div>
      </div>
      <div className="uk-margin-top uk-flex uk-width-1-1">
        <div className="uk-width-1-4 uk-margin-small-right">
          <label>Subgrupo</label>
          <AutoComplete
            className="uk-width-1-1"
            options={subgroups?.map((sub) => ({
              ...sub,
              value: sub?.description,
            }))}
            value={service?.subgroupDescription}
            onChange={(val) =>
              setService((prv) => ({ ...prv, subgroupDescription: val }))
            }
            onSelect={(_, opt) =>
              setService((prv) => ({
                ...prv,
                subgroupDescription: opt?.value,
                subgroupId: opt?.id,
              }))
            }
            filterOption={(val, opt) =>
              normalizeStr(opt?.value?.toUpperCase()).includes(
                normalizeStr(val?.toUpperCase())
              )
            }
          />
        </div>
        <div className="uk-width-1-4 uk-margin-small-right">
          <label>Grupo de Tributação</label>
          <AutoComplete
            className="uk-width-1-1"
            value={service?.taxationGroupDescription}
            options={taxationGroups?.map((tax) => ({
              ...tax,
              value: tax?.name,
            }))}
            onChange={(val) =>
              setService((prv) => ({ ...prv, taxationGroupDescription: val }))
            }
            onSelect={(_, opt) =>
              setService((prv) => ({
                ...prv,
                taxationGroupDescription: opt?.value,
                taxationGroupId: opt?.id,
              }))
            }
            filterOption={(val, opt) => {
              normalizeStr(opt?.value?.toUpperCase()).includes(
                normalizeStr(val?.toUpperCase())
              );
            }}
          />
        </div>
        <div className="uk-width-1-4 uk-margin-small-right">
          <label>Tipo Serviço</label>

          <Select
            className="uk-width-1-1"
            placeholder="Selecione"
            value={service?.type}
            onChange={(val) => setService((prv) => ({ ...prv, type: val }))}
          >
            <Option value="service">Serviço</Option>
            <Option value="exam">Exame</Option>
          </Select>
        </div>
        <div>
          <label>Código do serviço</label>
          <Input
            value={service?.serviceCode}
            onChange={(e) =>
              setService((prv) => ({ ...prv, serviceCode: e.target.value }))
            }
          />
        </div>
      </div>
      <div className="uk-margin-small-right uk-width-1-1 uk-margin-top">
        <label>Características</label>
        <Input
          value={service?.features}
          onChange={(e) =>
            setService((prv) => ({ ...prv, features: e.target.value }))
          }
        />
      </div>
    </section>
  );
});

export default Header;
