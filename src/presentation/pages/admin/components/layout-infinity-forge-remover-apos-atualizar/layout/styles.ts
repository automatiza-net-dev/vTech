import styled from 'styled-components'

export const Layout = styled('div')<{$zIndex: number}>`
  width: 100%;
  --spacing: 30px;
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-template-rows: max-content 1fr;
  grid-template-areas:
    'header header'
    'aside main';
  position: relative;
  z-index: ${props => props?.$zIndex};

  header,
  main {
    padding-left: var(--spacing);
    padding-right: var(--spacing);
  }

  header {
    grid-area: header;
  }

  aside {
    grid-area: aside;
  }

  main {
    min-width: 0;
    grid-area: main;
    margin: var(--spacing) 0;
    position: relative;
    z-index: 1;
    height: 100%;
  }
`
