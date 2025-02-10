import { StylesConfig } from 'react-select'

export const customStyles: StylesConfig = {
  control: (provided) => ({
    ...provided,
    minHeight: '40px',
    maxHeight: '40px',
    width: '255px',
    background: 'rgba(255,255,255, 0.2)',
    border: 0,
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: '9999',

  }),

  placeholder: (provided) => ({
    ...provided,
    fontSize: '13px',
    color: '#fff',
  }),

  valueContainer: (provided) => ({
    ...provided,
    minHeight: '40px',
    padding: '0 10px',
  }),

  input: (provided) => ({
    ...provided,
    margin: '0px',
    padding: '0px',
    height: '40px',
    minHeight: '40px',

  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    minHeight: '40px',
    paddingRight: '10px',
  }),
  option: (provided) => ({
    ...provided,
      padding: '3px 10px'
  }),
}
