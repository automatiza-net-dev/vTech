import { useState } from "react";

import { MenuItem, TextField } from "@mui/material";
import { FormHandler, Input } from "infinity-forge";

import { BusinessUnit } from "@/domain";
import { LayoutAdmin } from "../../layout";
import { ResumeInformations } from "./resume-informations";
import { useAuthFranchisor, useLoadUsersController } from "@/presentation";

import * as S from "./styles";

export function DashboardAdmin() {
  const [value, setValue] = useState<BusinessUnit[]>([]);

  const { user } = useAuthFranchisor();

  const handleChangeMultiple = (event) => {
    setValue(event.target.value);
  };

  const dataAtual = new Date();

  const primeiroDiaDoMes = new Date(
    dataAtual.getFullYear(),
    dataAtual.getMonth(),
    1
  );

  const formatoData = primeiroDiaDoMes.toISOString().split("T")[0];

  const ultimoDiaDoMes = new Date(
    dataAtual.getFullYear(),
    dataAtual.getMonth() + 1,
    0
  );

  const formatoDataFinal = ultimoDiaDoMes.toISOString().split("T")[0];

  const { data } = useLoadUsersController();

  const userClinicas =
    data && data.length > 0
      ? data?.find((u) => {
          return u.id === user?.user?.id;
        })?.units
      : [];

  return (
    <S.DashboardAdmin>
      <LayoutAdmin disableBreadcrumb>
        <div className="top">
          <div className="form">
            <FormHandler
              initialData={{ de: formatoData, ate: formatoDataFinal }}
            >
              <div>
                <h5>Clinicas</h5>

                <div className="row">
                  <div className="clinicas">
                    <TextField
                      classes={{ root: "" }}
                      select
                      name="userRoles"
                      id="userRoles"
                      variant="outlined"
                      SelectProps={{
                        multiple: true,
                        value,
                        onChange: handleChangeMultiple,
                      }}
                    >
                      {userClinicas?.map((buisness, index) => (
                        <MenuItem key={buisness.id + index} value={buisness.id}>
                          {buisness.identification}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                </div>
              </div>

              <div>
                <h5>Periodo</h5>

                <div className="row">
                  <Input type="date" name="de" />
                  á
                  <Input type="date" name="ate" />
                </div>
              </div>
            </FormHandler>

            <div className="charts-box"></div>
          </div>

          <ResumeInformations />
        </div>
      </LayoutAdmin>
    </S.DashboardAdmin>
  );
}
