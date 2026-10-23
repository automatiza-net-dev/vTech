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

export const ProfileWrapper = styled.div`
  position: relative;
`

export const VersionBadge = styled.span<{ $bg: string }>`
  position: absolute;
  left: 50%;
  bottom: -8px;
  transform: translateX(-50%);
  z-index: 23;
  padding: 1px 5px;
  border-radius: 4px;
  background: ${(props) => props.$bg};
  color: #fff;
  font-size: 9px;
  font-weight: 600;
  line-height: 13px;
  white-space: nowrap;
  pointer-events: none;
`
