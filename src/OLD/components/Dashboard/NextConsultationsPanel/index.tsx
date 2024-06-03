// @ts-nocheck
import React, { useState } from "react";

import { useSchedules } from "@/OLD/hooks/useSchedules";
import { useUserHasPermission, useProfile } from "@/OLD/hooks/useProfile";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { PatientCard } from "@/OLD/components/mini-components/PatientCard";
import { Container } from "./styles";

import "swiper/css";
import "swiper/css/navigation";

function NextConsultationsPanel({
  title,
  confirmed
}) {
  const { schedules } = useSchedules({ confirmed: `${confirmed}` });
  const { user } = useProfile();

  const listAllSchedulesPermission = useUserHasPermission("AGE10");

  const colorsCard = {
    emergency: {
      dark: "#F5222D",
      light: "#FFF1F0"
    },
    veryUrgent: {
      dark: "#FA972B",
      light: "#FFF7E6"
    },
    urgent: {
      dark: "#FAD82B",
      light: "#FCFAF2"
    },
    littleUrgent: {
      dark: "#2496FF",
      light: "#E6F7FF"
    },
    notUrgent: {
      dark: "#D9D9D9",
      light: "#fff"
    }
  };

  return (
    <Container>
      <h4>{title}</h4>
      <Swiper
        navigation={true}
        modules={[Navigation]}
        slidesPerView={5}
        className="swiper"
      >
        {schedules?.data?.length > 0 &&
          schedules?.data
            ?.filter((schedule) =>
              listAllSchedulesPermission &&
              listAllSchedulesPermission !== "loading"
                ? schedule
                : schedule?.user?.id === user?.id
            )
            .map((schedule, i) => (
              <SwiperSlide className="swiper-slide" key={i}>
                <PatientCard
                  confirmed={confirmed}
                  color={
                    confirmed ? colorsCard?.littleUrgent : colorsCard?.notUrgent
                  }
                  data={schedule}
                  index={i}
                />
              </SwiperSlide>
            ))}
      </Swiper>
    </Container>
  );
};

export default NextConsultationsPanel;
