import { getIn, useFormikContext } from "formik";
import { Input, InputCurrency, InputSwitch } from "infinity-forge";

import { Product } from "@/domain";

import * as S from "./styles"

export function Cancel(item: Product & { index: number }) {
    const { values, setFieldValue } = useFormikContext();
  
    const isActive = getIn(values, `billItems[${item.index}].active`);
  
    return (
      <S.Cancel>
        <InputSwitch
          name={`billItems[${item.index}].active`}
          onChangeInput={() => {
            setFieldValue(`billItems[${item.index}].quantity`, item.quantity);
          }}
        />
  
        <div style={{ display: "none" }}>
          <Input
            name={`billItems[${item.index}].id`}
            controlledInitialValue={{ value: String(item.id) }}
          />
        </div>
  
        <div className="quantity">
          {isActive && (
            <InputCurrency
              prefix=" "
              name={`billItems[${item.index}].quantity`}
              max={item.quantity}
              decimalLimit={0}
            />
          )}
        </div>
      </S.Cancel>
    );
  }
  