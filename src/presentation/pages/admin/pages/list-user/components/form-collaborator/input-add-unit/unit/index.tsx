import { useFormikContext } from "formik";

import { ButtonDelete, useLoadAllBusinessUnitsSystem } from "@/presentation";
import { useRolesControllers } from "../../../../../../../../hooks/access-controls/use-roles-controllers";

import { UnitProps } from "./interfaces";

import * as S from "./styles";

export function Unit({ businessUnitId, remove }: UnitProps) {
  const { values } = useFormikContext<any>();

  const roles = useRolesControllers()

  const businessUnits = useLoadAllBusinessUnitsSystem();

  const roleId = values.roleId;

  const roleItem = roles?.data?.find((role) => {
    return String(role.id) === String(roleId);
  });

  const unit = businessUnits?.data?.find(
    (u) => String(u.id) === businessUnitId
  );

  return (
    <>
      <S.Unit>
        <div className="unit-content">
          <div className="text">
            <p className="font-16-regular">
              {unit?.economicGroup?.company_name + " - " + (unit?.identification || "Sem identificação")}
            </p>
          </div>

          <ButtonDelete onClick={() => remove(businessUnitId)} />
        </div>

        <div className="error">
          {/* <div>
            {formState?.errors?.units?.[index] && (
              <span style={{ color: "red" }}>
                {formState?.errors?.units?.[index]?.message}
              </span>
            )}
          </div> */}
        </div>
      </S.Unit>
    </>
  );
}
