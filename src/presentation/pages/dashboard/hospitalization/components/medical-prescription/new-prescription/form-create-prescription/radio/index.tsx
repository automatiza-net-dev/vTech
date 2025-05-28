import { useField } from 'formik'

import * as S from './styles'
import { InputControl, InputProps } from 'infinity-forge'

export type OptionInputRadio = {
  label: string
  value: string
  readOnly?: boolean;
  CustomOption?: (props: { isActive: boolean; name: string } & OptionInputRadio) => React.ReactNode
}

interface InputRadioProps {
  name: string
  label?: string
  value?: string
  options: OptionInputRadio[]
}

export function InputRadioComponent(props: { name: string } & OptionInputRadio) {
  const [field, , helpers] = useField({ name: props.name })
  const isActive = field.value === props.value

  const handleClick = () => {
    if (!props.readOnly) {
      helpers.setValue(props.value)
    }
  }

  return (
    <label onClick={handleClick} style={{ display: "flex", gap: 15 }}>
      <input
        type='radio'
        name={props.name}
        checked={isActive}
        onChange={() => helpers.setValue(props.value)}
        value={props.value}
        style={{ display: props.CustomOption ? 'none' : 'block' }}
        readOnly={props.readOnly}
      />

      {props.CustomOption ? (
        <props.CustomOption {...props} isActive={isActive} />
      ) : (
        <>{props.label}</>
      )}
    </label>
  )
}


export function InputRadio({ name, options, ...props }: InputRadioProps &  InputProps) {
  return (
    <InputControl {...props} name={name}>
      <S.InputRadio>
        <div className='list-radios'>
          {options.map((option) => (
            <InputRadioComponent key={option.value} readOnly={props.readOnly} {...option} name={name} />
          ))}
        </div>
      </S.InputRadio>
    </InputControl>
  )
}
