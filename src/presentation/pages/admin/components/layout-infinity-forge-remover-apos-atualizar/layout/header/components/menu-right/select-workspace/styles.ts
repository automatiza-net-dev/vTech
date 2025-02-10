import styled from 'styled-components'

export const SelectWorkSpace = styled('div')`
  width: 100%;
  box-shadow: 0px 0px 5px 0px #00000033;

  .input_control {
    margin-bottom: 0 !important;
  }

  [class*='-DummyInput'],
  [id*='-input'],
  #react-select-2-input {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
  }

  [class*='-indicatorContainer'] {
    padding: 0;
  }

  [class*='-control'] {
    * {
      color: #fff;
      font-weight: 700;
    }
  }

  [id*='-listbox'] {
    > div {
      padding: 2px 10px;
    }
  }

  .item {
    background: none;
    padding: 0;
    border: 0;
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    gap: 10px;
    cursor: pointer;

    > div {
      display: flex;
      flex-direction: column;
      text-align: start;

      .title_workspace {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        max-width: 100%;
      }

      .subtitle {
        color: #828282;
      }
    }

    .circle {
      width: 30px;
      height: 30px;
      min-width: 30px;
      min-height: 30px;
      border-radius: 100rem;
      background-color: #444444;
    }

    .avatar {
      width: 30px;
      height: 30px;
      min-width: 30px;
      min-height: 30px;

      img {
        object-fit: cover !important;
      }
    }
  }

  .item + .item {
    margin-top: 10px;
  }
`
export const Item = styled('div')<{ $isOption: boolean }>`
  align-items: center;
  display: flex;
  flex-direction: row !important;
  justify-content: space-between;
  margin-top: 0 !important;
  margin-bottom: -2px;
  padding: 5px 12px !important;

  .content_option {
    width: calc(100% - 10px);
    
    > div {
      display: flex;
      flex-direction: column;
      gap: 3px;

      span {
        line-height: 1;
        display: flex;
      }
    }
  }

  .active_workspace {
    min-height: 10px;
    min-width: 10px;
    max-width: 10px;
    max-width: 10px;
    border-radius: 100%;
    border: 1px solid #6d6b6b;
    overflow: hidden;
  }

  &:hover {
    transition: 0.2s;
    background-color: ${(props) => (props.$isOption ? 'rgb(245 245 245 / 29%) !important' : 'unset')};
  }

  &.active {
    background: rgb(239 236 236 / 50%) !important;

    .active_workspace {
      background-color: #6d6b6b;

      > div {
        height: 100%;
        width: 100%;
      }
    }
  }
`
