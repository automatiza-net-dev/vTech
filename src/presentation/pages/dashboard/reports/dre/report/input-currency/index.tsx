import { useEffect } from 'react'

import { useField } from 'formik'

import { InputControl, InputProps } from 'infinity-forge'


import { CurrencyInput } from './components'

export type InputCurrencyProps = {
  decimalLimit?: number
  errorMessageMin?: (value: string) => string
  errorMessageMax?: (value: string) => string
}

export function InputCurrency(props: InputProps & InputCurrencyProps) {
  const [field, _, handlers] = useField({ name: props.name })

  function handleChange(value: string) {
    const valueToString = typeof value === 'number' ? String(value) : value


    if (valueToString) {
      const numericValue = parseFloat(
        valueToString?.includes(',') ? valueToString?.replace(/\./g, '').replace(',', '.') : valueToString,
      )

      if (props.min && numericValue < Number(props.min)) {
        if (props.errorMessageMin) {
          handlers.setError(props.errorMessageMin(valueToString))
        }

        handlers.setValue(Number(props.min))

        return;
      }

      if (props.max && numericValue > Number(props.max || 0)) {
        if (props.errorMessageMax) {
          handlers.setError(props.errorMessageMax(valueToString))
        }
      } else {
     
        handlers.setError(undefined)
        props.onChangeInput && props.onChangeInput(valueToString, () =>    handlers.setValue(valueToString))
      }
      return
    }

    handlers.setValue('')
    handlers.setError(undefined)
    props.onChangeInput && props.onChangeInput('0')
  }

  const value = props.controlledInitialValue ? props.controlledInitialValue?.value : field.value

  useEffect(() => {
    if (props?.controlledInitialValue) {
      setTimeout(() => {
        handleChange((props as any).controlledInitialValue?.value)

        return
      }, 500)
    }
  }, [])

  return (
    <InputControl {...props}>
      <CurrencyInput
        {...props}
        prefix={typeof props?.prefix !== 'string' ? 'R$ ' : props.prefix}
        decimalsLimit={props?.decimalLimit || 2}
        decimalSeparator=','
        groupSeparator='.'
        value={value}
        onValueChange={handleChange}
        readOnly={props.readOnly}
        max={props.max}
      />
    </InputControl>
  )
}
