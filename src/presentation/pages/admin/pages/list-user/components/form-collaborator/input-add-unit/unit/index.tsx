import { useQueryClient } from "react-query";

import { useFormikContext } from "formik";

import { LoadAllControllerRoles } from "@/domain";
import { ButtonDelete, useLoadAllBusinessUnits } from "@/presentation";

import { UnitProps } from "./interfaces";

import * as S from "./styles";

export function Unit({ businessUnitId, remove }: UnitProps) {
  const { values } = useFormikContext<any>();

  const roles = useQueryClient().getQueryData<LoadAllControllerRoles.Model>(
    "RemoteLoadAllControllerRoles"
  );

  const businessUnits = useLoadAllBusinessUnits();

  const roleId = values.roleId;

  const roleItem = roles?.find((role) => {
    return String(role.id) === String(roleId);
  });

  const companyName = businessUnits?.data?.find(
    (u) => String(u.id) === businessUnitId
  )?.company_name;

  return (
    <>
      <S.Unit>
        <div className="unit-content">
          <div className="text">
            <p className="font-16-regular">
              {companyName} _ {roleId ? roleItem?.name : "---------"}
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
