import { useState, useEffect } from "react";

import Router from "next/router";
import styled from "styled-components";

const StylesRoute = styled("div")`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  height: 5px;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: placeHolderShimmer;
  animation-timing-function: linear;
  background: ${(props) => props.theme.primaryColor};
  background: ${(props) => `linear-gradient(
  to right,
  ${props.theme.primaryColor} 8%,
  #fff 25%,
  ${props.theme.primaryColor} 33%
  )`};
  position: fixed;
  top: 0;
  right: 0;
  z-index: 99;

  @keyframes placeHolderShimmer {
    0% {
      background-position: 0px 0;
    }
    100% {
      background-position: 100vw 0;
    }
  }
`;

export function LoaderOnRouteChange({ children }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => {
      setLoading(true);
    };

    const end = () => {
      setLoading(false);
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return (
    <>
      {loading && <StylesRoute />}

      {children}
    </>
  );
}
