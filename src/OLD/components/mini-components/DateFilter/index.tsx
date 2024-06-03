// @ts-nocheck
import React, { memo, useState } from "react";

import { Dropdown, Menu } from "antd";
import { FaFilter, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { Container } from "./styles";

import moment from "moment";

export const DateFilter = memo(function DateFilter({
  state,
  setState,
  from = false,
  to = false,
}) {
  const [typeFilter, setTypeFilter] = useState("day");

  return (
    <Container className="uk-margin-left">
      <Dropdown
        trigger="click"
        overlay={
          <Menu
            items={[
              {
                key: "1",
                label: <div>Hoje</div>,
                onClick: () => {
                  setTypeFilter("day");
                  setState({
                    ...state,
                    [from]: moment(new Date()).startOf("day"),
                    [to]: moment(new Date()).endOf("day"),
                  });
                },
              },
              {
                key: "2",
                label: <div>Este Mês</div>,
                onClick: () => {
                  setTypeFilter("month");
                  setState({
                    ...state,
                    [from]: moment(new Date()).startOf("month"),
                    [to]: moment(new Date()).endOf("month"),
                  });
                },
              },
            ]}
          />
        }
      >
        <FaFilter className="icon uk-margin-right" />
      </Dropdown>
      <FaChevronLeft
        className="icon uk-margin-small-right"
        onClick={() =>
          setState({
            ...state,
            [to]: moment(state[from]).subtract(1, typeFilter).endOf(typeFilter),
            [from]: moment(state[from])
              .subtract(1, typeFilter)
              .startOf(typeFilter),
          })
        }
      />
      <FaChevronRight
        className="icon"
        onClick={() =>
          setState({
            ...state,
            [to]: moment(state[to]).add(1, typeFilter).endOf(typeFilter),
            [from]: moment(state[from]).add(1, typeFilter).startOf(typeFilter),
          })
        }
      />
    </Container>
  );
});
