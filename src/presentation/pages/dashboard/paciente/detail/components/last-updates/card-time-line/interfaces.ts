import { Dispatch, SetStateAction } from "react";

import { TimeLine } from "@/domain";

export type CardTimeLineProps = {
    timeline: TimeLine;
    timeLineSelected: TimeLine | null
    setTimeLineSelected: Dispatch<SetStateAction<TimeLine | null>>;
  };
  