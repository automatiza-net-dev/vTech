// @ts-nocheck
import React from "react";
import { useRouter } from "next/router";

import { Container, Body } from "./styles";
import ExistentUser from "./ExistentUser";
import NewUser from "./NewUser";

function Invites({ type }: { type: "accept" | "new" }) {
  const router = useRouter();

  const verifyImage = () => {
    return {
      backgroundImage:
        process.env.client === "sancla"
          ? `/assets/pet-sancla.jpeg`
          : `/assets/invite-liftone.jpeg`,

      logo:
        process.env.client === "sancla"
          ? process.env.api + `/assets/logo-sancla.png`
          : "/images/logo/lo-logo-green.png",
    };
  };

  return (
    <Container>
      <section>
        <div className="img-container">
          <img src={process.env.api + verifyImage().backgroundImage} />
        </div>
      </section>
      <section>
        <img className="logo" src={verifyImage().logo} />
        {type === "accept" ? <ExistentUser /> : <NewUser />}
      </section>
    </Container>
  );
}

export default Invites;
