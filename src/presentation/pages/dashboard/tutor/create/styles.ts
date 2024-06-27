import styled from "styled-components";

export const Create = styled("div")`
  h2 {
    text-align: center;
    color: #2b2b2b;
    margin-bottom: 40px;
  }

  label {
    margin-bottom: 8px;
    color: #2b2b2b;
  }

  .row-1, .row-3 {
    display: grid;
    gap: 18px;
    grid-template-columns: 2.5fr 1.5fr 1.5fr 1.5fr 1.5fr;
    margin-bottom: 10px;
  }

  .row-2 {
    display: grid;
    gap: 18px;
    margin-bottom: 10px;
    grid-template-columns: 2.5fr 1.5fr 1.5fr 1.5fr 1.5fr;
  }

  .file {
    display: flex;

    .input-wrapper {
      > div {
        display: grid;
        gap: 18px;
        grid-template-columns: 2.5fr 2.2fr 0.8fr 1.5fr 1.5fr;
      }

      .initial_value_input_file {
        > div {
          display: flex;
          flex-direction: row;
          margin-top: 0;
          max-width: 100%;

          .icon {
            margin-right: 10px;
            height: 54px;
            min-width: 54px;
          }

          .file_name {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            -webkit-box-orient: vertical;
            max-width: 150px;
            text-align: left;
          }
        }
      }
    }
  }
`