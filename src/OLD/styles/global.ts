// @ts-nocheck
import { createGlobalStyle } from "styled-components";
export const GlobalStyle = createGlobalStyle<any>`

label {
    font-size: 14px !important;
}

input, textarea {
    font-size: 13px !important;
}

.create-button {
    background-color: ${(props) => props.theme.primaryColor} !important;
}

.filters-accordion + form {
    button {
        background-color: ${(props) => props.theme.primaryColor} !important;
    }
}


.form-button.sticky {
    display: flex;
    justify-content: flex-end;
    gap: 20px; 
    border-top: 1px solid #ccc;
    padding-right: 0 !important;
    z-index: 9 !important;
    

    button:last-child {
        width: fit-content;
        height: 40px;
        padding: 0 40px !important;
        background-color: ${(props) => props.theme.primaryColor} !important;
        font-size: 14px;
        transition: 0.3s;

        &:hover {
            transition: 0.3s;
            opacity: 0.9;
        }

        &:disabled {
            
        }
    }
}

#__next {
    position: relative;
    z-index: 1;
}

.side_bar_infinity_forge {
    z-index: 99999999 !important;
}

    * {
        padding: 0;
        margin: 0;
        font-family: "Open Sans", sans-serif;
        &:focus {
            outline: 0px solid transparent !important
        }
    }

    

    html, body, #root {
        height: 100vh;
        scroll-behavior: smooth;
    }

    body {
        color: #707070;
        background-color: #ffff;
        overflow-x: hidden;
    }

    :root {
        --gray: #707070;
        --blue: #B5F5EC;
        --blue-lo: #01616f;
        --darkBlue: #13C2C2;
        --purple: #4765cc;
        --lightPurple: #6483ec;
        --green: #77c285;
        --red: #F5222D;
        --orange: #FA972B;
        --yellow: #FAD82B;
        --orange-dark-1: #78480E;
        --orange-1: #f7941d;
        --orange-light-1: #F9B868;
        --cyan: #85D3F2;
        --yellow-2: #ffb400;
        --blueTag: #2496FF;
        --grayTag: #D9D9D9;
        --cyan-light-1: #D0EAF4;
        --orange-light-2: #FBDBB5;
        --cyan-dark-2: #3F6473;
        --cyan-dark-1: #69A7BF;
        --lo-gray: #DCDCDC;
        --lo-blue: #005862;
        --lo-green-bg: #008080;
    }

    .pointer {
        cursor: pointer
    }

    .colorDarkBlue {
        color: var(--darkBlue)
    }

    .bgDarkBlue {
        background-color: ${
          process.env.client === "sancla"
            ? "var(--orange-light-1)"
            : "var(--lo-blue)"
        };
    }

    .bgBlueHover:hover {
        background-color: var(--blue)
    }

    ::-webkit-scrollbar {
        width: 5px;
        height: 8px;
        background-color: lightgray; /* ou que isso seja adicionado ao "caminho" da barra */
    }

    .ant-tabs-ink-bar {
        background-color: var(--cyan-dark-1);
    }

    .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
        color: var(--cyan-dark-1);
    }

    .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
        background-color: var(--orange-light-2);
    }

    .ant-menu-item-selected {
        color: var(--orange-dark-1);
    }

    .bgDarkCyan {
        background-color: var(--cyan);
    }

    .bgCyanHover:hover {
        background-color: var(--cyan-dark-1)
    }

    .ant-menu-item-active {
        background-color: var(--cyan-light-1) !important;
        color: var(--cyan-dark-2) !important;
    }
    
    .ant-menu-title-content:hover {
        color: var(--cyan-dark-2);
    }

    /* Adiciona a barra arrastável */
    ::-webkit-scrollbar-thumb {
        background-color: ${
          process.env.client === "sancla"
            ? "var(--orange-light-1)"
            : "var(--lo-blue)"
        };
    }

    /*
     !!! COLORS
     */

    .colorBlue {
        color: var(--blue) !important;
    }

    .colorDarkCyan {
       color: var(--cyan);
    }

    .colorButton{
        background-color: red;
        background-color: ${
          process.env.client === "sancla"
            ? "var(--orange-light-1)"
            : "var(--lo-blue)"
        } !important;
    }

    .colorButtonWhite{
        background-color: #fff !important;
    }

    .colorButtonLight{
        background-color: var(--blue) !important;
    }

    .custom-link {
        
        &:hover {
            text-decoration: underline;
            color: var(--cyan) !important;
            cursor: pointer;
        }
 }
    

    a {
        &:hover {
            text-decoration: underline;
            color: var(--cyan) !important;
        }

    }

    .uk-button-primary {
        background-color: ${
          process.env.client === "sancla"
            ? "var(--orange-light-1)"
            : "var(--lo-blue)"
        };
        
        &:hover {
            text-decoration: none;
            background-color: var(--orange-dark-1) !important;
        }

    }

    *:focus {
        outline: 0px !important
    }

    .ant-menu.ant-menu-inline-collapsed > .ant-menu-item {
        padding: 0 calc(50% - 22px / 2) !important
    }

    .ant-layout-sider  {
        z-index:100;
        max-height: 100vh;
    }

    .ant-layout-content {
        /* max-height: 100vh !important; */
        overflow: auto;
        margin: 0 !important;
        padding: 0 30px;
    }
    
    .ant-layout {
        max-height: 100vh;
    }

    .ant-affix {
        z-index: 100
    }

    .print-screen {
        margin: 500cm
    }

    .row {
        > div {
            width: 100%;
        }
    }


    .react-date-picker {
  height: 100%;
}

.date_picker_container {
  background-color: transparent;
  border: 1px solid #ccc;

  > svg {
    fill: #979797;
  }

  .react-datepicker-wrapper {
    input {
      color: #111;
    }
  }
}

.react-datepicker__current-month,
.react-datepicker-time__header,
.react-datepicker-year-header {
  font-size: 1.2rem !important;
}

.react-datepicker__day-name,
.react-datepicker__day,
.react-datepicker__time-name {
    color: #000;
    width: 2.5rem !important;
    text-align: center;
    margin: 0.2rem !important;
    display: inline-block;
    line-height: 2rem !important;
    font-size: 12px !important;
}
.date_picker_container {
    background-color: #f9f9f9 !important;
}

.date_picker_container .react-datepicker-wrapper input {
    color: #000 !important;
}
 .date_picker_container >svg {
    fill: #6e6e6e !important;
}

.error-form {
    margin-bottom: 10px;
    font-size: 13px;
}

`;
export default GlobalStyle;
