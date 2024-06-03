import styled from "styled-components";

interface SearchBarStyleProps {
  $error: boolean;
}

export const SearchBar = styled("div")<SearchBarStyleProps>`
  display: flex;
  align-items: flex-end;

  .active-indicator {
    top: 6px;
    right: 23px;
    z-index: 3;
  }

  .MuiSelect-select {
    width: 100px;
  }

  .search {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 370px;
    position: relative;
    transition: 0.3;

    input {
      padding: 8px 12px;
      z-index: 1;
      position: relative;
      transition: 0.3;
      font-size: 14px;
    }

    input::placeholder {
      color: ${(props) => (props.$error ? "#d32f2f" : "rgba(0, 0, 0, 0.87)")};
      opacity: 1;
    }

    button {
      position: absolute;
      right: 0;
      z-index: 2;
      border-radius: 100%;
    }
  }
`;
