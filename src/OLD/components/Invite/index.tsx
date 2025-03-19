// @ts-nocheck
import React from "react";
import { useRouter } from "next/router";

import { Container, Body } from "./styles";
import ExistentUser from "./ExistentUser";
import NewUser from "./NewUser";
import { Invite } from "@/domain";
import { useConfigurationsSystem } from "@/presentation";

interface IInvitesProps extends Invite {
  type: "accept" | "new";
}

function Invites({ type, ...rest }: IInvitesProps) {
  const router = useRouter();

  const { logo_url } = useConfigurationsSystem()

  const verifyImage = () => {
    return {
      backgroundImage:
        process.env.client === "sancla"
          ? `/assets/pet-sancla.jpeg`
          : `/assets/invite-liftone.jpeg`,
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
        <img className="logo" src={logo_url} />
        {type === "accept" ? <ExistentUser {...rest} /> : <NewUser {...rest} />}
      </section>
    </Container>
  );
}

export default Invites;
