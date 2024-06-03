// @ts-nocheck
// Core
import React, { memo } from "react";

// Utils
import moment from "moment";

// Components
import { List } from "antd";

const HourItem = memo(function HourItem({ index, item = false }) {
  const hourData = moment(new Date())
    .startOf("day")
    .add(index, "hour")
    .format("HH:mm");

  return (
    <List.Item className="item" id={`time-${hourData}`}>
      <span className="uk-width-1-1">{item ? hourData : ""}</span>
    </List.Item>
  );
});

export default HourItem;
