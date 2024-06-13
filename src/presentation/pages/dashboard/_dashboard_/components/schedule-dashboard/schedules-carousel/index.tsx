import { Error, Icon, useCarousel } from "infinity-forge";

import { Event } from "@/domain";

import { ScheduleCard } from "./card";

import * as S from "./styles";

function SampleNextArrow(props) {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <Icon name="NavRightIcon" />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <Icon name="NavLeftIcon" />
    </div>
  );
}

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
      slidesToShow: 5,
      infinite: false,
      centerMode: false,
      draggable: false,
      arrows: true,
      slidesToScroll: event.length > 5 ? 5 : 1,
      spacing: 0,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
      responsive: [
        {
          breakpoint: 1600,
          settings: {
            slidesToShow: 4,
            slidesToScroll: event.length > 4 ? 4 : 1,
          },
        },
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
