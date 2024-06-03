// @ts-nocheck
// Core
import React, { useState, useEffect, useCallback, memo } from "react";

// Services
import { timelineService } from "@/OLD/services/timeline.service";

// Components
import { Table } from "antd";

const VacineList = memo(function VacineList() {
  const [allVacines, setAllVacines] = useState([]);
  const [loading, setLoading] = useState(false);
});

export default VacineList;
