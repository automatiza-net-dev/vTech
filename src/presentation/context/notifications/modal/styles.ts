import styled from 'styled-components'

export const Modal = styled('div')`
  .overlay {
    position: fixed;
    z-index: 1;
    min-width: 100%;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(1px);
    left: 0;
    top: 0;
  }

  .modal_content {
    position: fixed;
    z-index: 2;
    width: fit-content;
    max-width: 95vw;
    max-height: 94vh;
    background: #fff;
    top: 50%;
    left: 0;
    right: 0;
    margin: 0 auto;
    transform: translateY(-50%);
    padding: 35px 0 0;

    .content_modal_infinity_forge {
      padding: 0 20px;
      overflow: auto;
      max-height: calc(94vh - 30px);
      background: #fff;
      border-radius: 10px;

      .actions_modal_infinity_forge {
        position: sticky;
        bottom: 0;
        background-color: #fff;
        padding: 15px 0;
      }
    }

    .close_modal_infinity_forge {
      position: absolute;
      top: 10px;
      right: 15px;
      display: flex;
      background-color: transparent;
      border: 0;

      svg {
        width: 15px;
        height: auto;
      }
    }
  }
`
