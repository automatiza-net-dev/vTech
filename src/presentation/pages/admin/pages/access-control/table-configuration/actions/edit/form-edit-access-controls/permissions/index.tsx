import { Input, InputSwitch } from "infinity-forge";

import { LoadRolePermissions } from "@/domain";

import * as S from "./styles";
import { useFormikContext } from "formik";

export function Permissions() {
  const { values } = useFormikContext<any>();

  return (
    <S.Permissions>
      {values.data?.map((field: any, index) => {
        const fieldTyped = field as LoadRolePermissions.RolePermission;

        return (
          <div key={field?.uid}>
            <details>
              <summary>{fieldTyped?.name}</summary>
              <div style={{ display: "none" }}>
                <Input name={`data.${index}.role`} value={fieldTyped?.id} />
              </div>

              <div className="permissions">
                {fieldTyped?.permissions?.map((permission, indexPermission) => {
                  return (
                    <div key={permission?.id + indexPermission}>
                      <div style={{ display: "none" }}>
                        <Input
                          style={{ display: "none" }}
                          name={`data.${index}.permissions.${indexPermission}.id`}
                          value={permission?.id}
                        />
                      </div>

                      <InputSwitch
                        name={`data.${index}.permissions.${indexPermission}.active`}
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
