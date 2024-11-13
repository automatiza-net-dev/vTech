import { useState } from "react";

import { useTheme } from "styled-components";

import * as components from "infinity-forge/dist/ui/icons/index";
import { Icon, IconsNames } from "infinity-forge/dist/ui/icons";

import styled from "styled-components";
import React from "react";

export const IconsBarStyles = styled.div`
  input {
    margin-bottom: 20px;
    width: 100%;
    height: 40px;
    padding-left: 10px;
    border-radius: 5px;
    border: 0;
    background-color: ${(props) => props.theme.secondaryBg};
    color: ${(props) => props.theme.highlight};
  }

  input::placeholder {
    color: ${(props) => props.theme.primaryColor};
  }

  .list-icons {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;

    .icon-box {
      background-color: ${(props) => props.theme.secondaryBg};
      padding: 20px;
      border-radius: 0.52vw;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 5px;

      span {
        color: ${(props) => props.theme.highlight};
      }

      svg {
        height: 24px;
        max-width: 24px;
        width: auto;
      }
    }
  }
`;

const defaultListIcons = Object.keys(components) as IconsNames[];

export function IconsBar() {
  const [listIcons, setListIcons] = useState<IconsNames[]>(defaultListIcons);

  const theme = useTheme();

  function handleChangeSearch(e) {
    const value = e.target.value;

    if (value) {
      const filterList = defaultListIcons.filter((icon) =>
        icon.toLowerCase().includes(value.toLowerCase())
      );

      setListIcons(filterList);
    } else {
      setListIcons(defaultListIcons);
    }
  }

  return (
    <IconsBarStyles>
      <input
        type="text"
        placeholder="Search icons"
        onChange={handleChangeSearch}
      />

      <div className="list-icons">
        {listIcons.map((component) => (
          <div className="icon-box" key={component}>
            <Icon name={component} color={theme?.primaryColor} />

            <span>{component}</span>
          </div>
        ))}
      </div>
    </IconsBarStyles>
  );
}

export default function DevelopPage() {
  return (
    <>
      <IconsBar />
    </>
  );
}
