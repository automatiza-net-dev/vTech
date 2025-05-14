import { useFormikContext } from "formik";
import { Input, InputSwitch } from "infinity-forge";

import { LoadRolePermissions, LoadRolesControllerSearch } from "@/domain";

import * as S from "./styles";

export function Permissions() {
  const { values } = useFormikContext<LoadRolesControllerSearch.Model>();

  return (
    <S.Permissions>
      {values.screens?.map((field, index) => {
        const fieldTyped = field as LoadRolePermissions.RolePermission;

        return (
          <div key={field?.id}>
            <details>
              <summary>{fieldTyped?.name}</summary>
              <div style={{ display: "none" }}>
                <Input name={`screens.${index}.id`} value={fieldTyped?.id} />
              </div>

              <div className="permissions">
                {fieldTyped?.permissions?.map((permission, indexPermission) => {
                  return (
                    <div key={String(permission?.id) + String(indexPermission)}>
                      <div style={{ display: "none" }}>
                        <Input
                          style={{ display: "none" }}
                          name={`screens.${index}.permissions.${indexPermission}.id`}
                          value={permission?.id}
                        />
                      </div>

                      <InputSwitch
                        name={`screens.${index}.permissions.${indexPermission}.status`}
                        label={permission?.description}
                      />
                    </div>
                  );
                })}
              </div>
            </details>
          </div>
        );
      })}
    </S.Permissions>
  );
}
