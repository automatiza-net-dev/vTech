import styled from 'styled-components'

export const MessageCard = styled('a')`
  width: 100%;
  color: #828282;
  padding: 10px;
  display: block;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    color: #828282;
  }

  & + & {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  > .top {
    display: flex;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 10px;

    .title {
      margin: 0;
      margin-right: 10px;
      color: ${(props) => props.theme.darkColor};
    }

    #highlight-text {
      height: 20px;
      padding: 4px 6px;
    }

    .days {
      width: fit-content;
      margin: 0 0 0 auto;
    }
  }

  > .description {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`
