//@ts-nocheck
import { useState, useEffect } from "react";

import { useMe } from "@/presentation";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useShowActivities } from "@/OLD/hooks/useOpportunities";

import { Table } from "antd";
import { Container } from "./styles";
import Filters from "./Filters";
import Actions from "../Actions";

import { BsFillClockFill } from "react-icons/bs";

import {
  liftOneOpportunitiesActivitiesColumnsComplete,
  opportunitiesActivitiesColumnsComplete,
} from "../Columns";
import moment from "moment";

const detectClockColor = (date, duration) => {
  if (moment(date) > moment()) {
    return "blue";
  }

  if (
    moment(date) < moment() &&
    moment(date).add(duration, "minutes") > moment()
  ) {
    return "yellow";
  }

  return "red";
};

function Activities({
  colaborators,
  actTypes,
  tutors,
  currentKanbanTab,
  patients,
}) {
  const [filters, setFilters] = useState({
    status: "Aberta",
    fromDate: moment(),
    toDate: moment(),
    noSearch: true,
  });
  const [reload, setReload] = useState(false);
  const [formattedActivities, setFormattedActivities] = useState(false);

  const user = useMe();

  const { allActivities } = useShowActivities(
    filters,
    reload,
    currentKanbanTab === "3"
  );

  const viewAllActivitiesPermission = useUserHasPermission("CRM09");

  const formatActivities = () => {
    setFormattedActivities(
      allActivities.map((act) => ({
        contactName: act?.contact?.name,
        phone: act?.contact?.cellphone,
        patientName: act?.client?.name,
        user: act?.user?.name,
        activity: act?.activity?.description,
        duration: act?.duration,
        description: act?.description ? act?.description : "-",
        status: act?.status,
        duration: act?.duration,
        executionDate: (
          <>
            <span className="uk-margin-small-right">
              {act?.executionDate
                ? moment(act?.executionDate).format("DD/MM/YYYY - HH:mm")
                : "-"}
            </span>
            {act?.status === "Aberta" ? (
              <BsFillClockFill
                color={detectClockColor(act?.executionDate, act?.duration)}
              />
            ) : (
              <BsFillClockFill color="green" />
            )}
          </>
        ),
        executedDate: act?.executedDate
          ? moment(act?.executedDate).format("DD/MM/YYYY")
          : "-",
        actions: (
          <Actions
            colaborators={colaborators}
            actTypes={actTypes}
            activity={act}
            setReload={setReload}
            op={{ ...act?.opportunity, contact: act?.contact }}
          />
        ),
      }))
    );
  };

  useEffect(() => {
    allActivities?.length > 0 ? formatActivities() : setFormattedActivities([]);
  }, [allActivities]);

  useEffect(() => {
    !viewAllActivitiesPermission &&
      setFilters({ ...filters, technicianName: user?.data?.firstName });
    setReload((prv) => !prv);
  }, [viewAllActivitiesPermission]);

  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        setFilters((prv) => ({ ...prv, noSearch: false }));
        setReload((prv) => !prv);
      }
    });
  }, []);

  return (
    <Container>
      <Filters
        filters={filters}
        setFilters={setFilters}
        setReload={setReload}
        actTypes={actTypes}
        colaborators={colaborators}
      />
      <Table
        className="uk-margin-small-top"
        columns={
          user?.data?.unit?.system?.type === "Vet"
            ? opportunitiesActivitiesColumnsComplete
            : liftOneOpportunitiesActivitiesColumnsComplete
        }
        dataSource={formattedActivities}
      />
    </Container>
  );
}

export default Activities;
