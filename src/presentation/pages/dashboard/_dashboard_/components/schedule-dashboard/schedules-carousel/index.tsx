import { Error, Icon, useCarousel } from "infinity-forge";

import { Event } from "@/domain";

import { ScheduleCard } from "./card";

import * as S from "./styles";

export function SchedulesCarousel({
  event,
  confirmed,
}: {
  event: Event[];
  confirmed: boolean;
}) {
  const { Carousel, Next, Prev } = useCarousel<Event>({
    items: event,
    Component: ScheduleCard,
    id: "ScheduleDashboard",
    config: {
      slidesPerView: 5,
      loop: false,
      spaceBetween: 20,
      breakpoints: {
        1600: {
          slidesPerView: 4,
        },
        1200: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 1,
        },
      },
    },
  });

  if (!event || event.length === 0) {
    return <></>;
  }

  return (
    <Error name="ConfirmedSchedules">
      <S.SchedulesCarousel>
        <h3 className="font-20-bold">
          {confirmed ? "Consultas a confirmar" : "Consultas já confirmadas"}
        </h3>

          <Carousel />

          <div className="navigation">
            <Prev>
              <Icon name="NavLeftIcon" />
            </Prev>

            <Next>
              <Icon name="NavRightIcon" />
            </Next>
        </div>
      </S.SchedulesCarousel>
    </Error>
  );
}
