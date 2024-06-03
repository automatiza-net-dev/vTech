import Slider, { Settings } from "react-slick";

import * as S from "./styles";

export function useCarousel<T = any>(props: {
  data: T[];
  title?: string;
  settings: Settings & { spacing?: number };
  Component: (props: T) => JSX.Element;
}) {
  return {
    Carousel: () => {
      return !props.data || props.data.length === 0 ? (
        <></>
      ) : (
        <S.SlickStyles $spacing={props.settings.spacing}>
          {props.title && <h2>{props.title}</h2>}

          <Slider {...props.settings}>
            {props.data.map((element, index) => (
              <div key={index}>
                <props.Component {...(element as any)} />
              </div>
            ))}
          </Slider>
        </S.SlickStyles>
      );
    },
  };
}
