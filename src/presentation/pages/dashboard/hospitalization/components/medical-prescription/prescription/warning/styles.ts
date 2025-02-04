import styled from 'styled-components'

export const Warning = styled('div')`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0 30px;

  .warning_icon {
    svg {
      height: 40px;
      width: auto;
      margin-bottom: 15px;
    }
  }

  h3 {
    margin-bottom: 20px;
  }

  p {
    margin-bottom: 40px;
  }

  .actions_warning {
    display: flex;
    gap: 30px;
    align-items: center;
    width: 100%;

    .cancel,
    .confirm {
      border-radius: 5px;
      height: 40px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.3s;
    }

    .confirm {
      background-color: #d5182e;
      border: 1px solid #d5182e;
      color: #fff;

      &:hover {
        background-color: #bd061b;
        border: 1px solid #bd061b;
      }
    }

    .cancel {
      background-color: #fff;
      color: #08102b;
      border: 1px solid #e0e4e9;

      &:hover {
        background-color: #e0e4e9;
      }
    }
  }
`
