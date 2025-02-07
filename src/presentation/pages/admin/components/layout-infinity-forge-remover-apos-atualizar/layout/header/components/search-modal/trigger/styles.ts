import styled from 'styled-components'

export const SearchTrigger = styled('div')`
  width: 100%;
  max-width: 473px;
  height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.2);
  font-weight: 400;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0px 0px 5px 0px #00000033;

  .icon {
    width: 20px;
    height: 20px;
    display: flex;

    svg {
      width: 100%;
      height: auto;
      fill: currentColor;
    }
  }

  span {
    display: block;
    padding-top: 3px;
  }

  // Responsives

  @media only screen and (max-width: 1024px) {
    width: 40px;
    height: 40px;
    padding: 10px;

    span {
      display: none;
    }
  }
`
