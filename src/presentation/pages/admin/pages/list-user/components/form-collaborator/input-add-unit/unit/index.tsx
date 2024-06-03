import { useQueryClient } from "react-query";

import StoreIcon from "@mui/icons-material/Store";

import { useFormikContext } from "formik";
import { ButtonDelete } from "@/presentation";
import { LoadAllBusinessUnits, LoadAllControllerRoles } from "@/domain";

import { UnitProps } from "./interfaces";

import * as S from "./styles";

export function Unit({ businessUnitId, remove }: UnitProps) {
  const { values } = useFormikContext<any>();

  const roles = useQueryClient().getQueryData<LoadAllControllerRoles.Model>("RemoteLoadAllControllerRoles");

  const businessUnits = useQueryClient().getQueryData<LoadAllBusinessUnits.Model>("RemoteLoadAllBusinessUnits");

  const  roleId  = values.roleId;

  const roleItem = roles?.find((role) => {
    return String(role.id) === String(roleId);
  });

  const companyName = businessUnits?.find(
    (u) => String(u.id) === businessUnitId
  )?.company_name;

  return (
    <>
      <S.Unit>
        <div className="unit-content">
          <div className="text">
            <p>
              <StoreIcon color="action" fontSize="small" /> {companyName} _{" "}
              {roleId ? roleItem?.name : "---------"}
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
