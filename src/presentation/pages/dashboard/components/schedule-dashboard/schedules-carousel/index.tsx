import { Error } from "infinity-forge";

import { Event } from "@/domain";
import { useCarousel } from "@/presentation";

import { ScheduleCard } from "./card";

import * as S from "./styles";

export function SchedulesCarousel({
  event,
  confirmed,
}: {
  event: Event[];
  confirmed: boolean;
}) {
  const { Carousel } = useCarousel<Event>({
    title: confirmed ? "Consultas a confirmar" : "Consultas já confirmadas",
    data: event,
    Component: ScheduleCard,
    settings: {
      slidesToShow: 4,
      infinite: false,
      centerMode: false,
      draggable: false,
      arrows: false,
      slidesToScroll: event.length > 4 ? 4 : 1,
      spacing: 20,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 3,
            slidesToScroll: event.length > 3 ? 3 : 1,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: event.length > 2 ? 2 : 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    },
  });

  return (
    <Error name="ConfirmedSchedules">
      <S.SchedulesCarousel>
        <Carousel />
      </S.SchedulesCarousel>
    </Error>
  );
}
