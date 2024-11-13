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
    id: confirmed ? "ConfirmedScheduleDashboard" : "ScheduleDashboard",
    config: {
      slidesPerView: "auto",
      spaceBetween: 20,
      breakpoints: {
        1600: {
          slidesPerView: 5,
        },
        1200: {
          slidesPerView: 4,
        },
        1024: {
          slidesPerView: 3,
        },
        768: {
          slidesPerView: 2,
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
            <Icon name="IconLeftNavigation" />
          </Prev>

          <Next>
            <Icon name="IconRightNavigation" />
          </Next>
        </div>
      </S.SchedulesCarousel>
    </Error>
  );
}
