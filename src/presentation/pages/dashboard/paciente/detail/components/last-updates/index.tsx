import { useEffect, useState } from "react";
import {
  FormHandler,
  LoaderCircle,
  Select,
  TabContentProps,
} from "infinity-forge";

import { useQuery } from "infinity-forge";

import { RemotePatient } from "@/data";
import { TypesAutomatiza, container } from "@/container";
import { Patient, TimeLine, TimelineType, TimeLineEvent } from "@/domain";

import { CardTimeLine } from "./card-time-line";
import { useActionsPatient } from "../actions/actions/options";

import * as S from "./styles";

export function LastUpdates({ id, changeTab }: Patient & TabContentProps) {
  const [timeLineType, setTimeLineType] = useState<
    TimelineType[] & TimeLineEvent[]
  >([]);
  const [timeLineSelected, setTimeLineSelected] = useState<TimeLine | null>(
    null
  );

  const actionsPatient = useActionsPatient();

  const { data, isFetching } = useQuery({
    queryKey: ["LastUpdates", id],
    queryFn: async () => {
      const response = await container
        .get<RemotePatient>(TypesAutomatiza.RemotePatient)
        .loadLastUpdates({ id });

      return response;
    },
  });

  const listTimeLine = data?.filter((item) => {
    if (timeLineType.length > 0) {
      return (
        timeLineType.includes(item.timeline_type.description) ||
        timeLineType.includes(item.timeline_info.event)
      );
    }

    return true;
  });

  const timeLine = listTimeLine?.find(
    (item) => item._id === timeLineSelected?._id
  );

  const ComponentSelected =
    timeLine &&
    timeLineSelected &&
    timeLine?.updatedAt === timeLineSelected?.updatedAt &&
    actionsPatient.list?.find(
      (action) =>
        action.value === timeLineSelected.timeline_type.description ||
        action.value === timeLineSelected.timeline_info.event
    )?.SingleComponent;

  useEffect(() => {
    if (listTimeLine && listTimeLine.length > 0 && timeLineSelected) {
      if (timeLineSelected.updatedAt !== timeLine?.updatedAt) {
        setTimeLineSelected(
          listTimeLine.find(
            (timeline) => timeline._id === timeLineSelected._id
          ) || null
        );
      }
    }
  }, [listTimeLine]);

  return (
    <S.LastUpdates>
      {isFetching && (
        <div className="loading">
          <LoaderCircle size={30} color="#000" />
        </div>
      )}

      {!isFetching && (
        <>
          <div className="box-left">
            <FormHandler>
              <Select
                onChangeInput={(data: any) => {
                  setTimeLineType(data);
                }}
                name="timeLineType"
                isMultiple
                options={actionsPatient.list}
              />
            </FormHandler>

            <div className="time_line_container">
              {listTimeLine?.map((timeline) => {
                return (
                  <CardTimeLine
                    key={timeline.timeline_id + timeline._id}
                    timeline={timeline}
                    timeLineSelected={timeLineSelected}
                    setTimeLineSelected={setTimeLineSelected}
                  />
                );
              })}
            </div>
          </div>

          <div className="content_timeline">
            {ComponentSelected && (
              <ComponentSelected
                key={
                  timeLineSelected.timeline_id +
                  timeLineSelected._id +
                  timeLineSelected?.updatedAt
                }
                changeTab={changeTab}
                {...timeLineSelected}
              />
            )}
          </div>
        </>
      )}
    </S.LastUpdates>
  );
}
