import styled from 'styled-components'

export const MenuRight = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  gap: clamp(1rem, 0.78vw, 1.5rem);


  @media only screen and (max-width: 1024px) {
    #messages-btn,
    #settings-btn,
    #profile-btn {
    }
  }
`
export const ActionBox = styled.div`
  position: relative;
  z-index: 22;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  border: 0;
  box-shadow: 0px 0px 5px 0px #00000033;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  padding: 10px;
  color: #fff;

  svg {
    fill: currentColor;
  }
`
