import styled from 'styled-components'

export const Content = styled.div`
  padding: 20px;

  .cards-box {
    max-height: 438px;
    overflow-y: auto;
    width: 100%;

    &::-webkit-scrollbar {
      width: 6px;
    }
  }
`
