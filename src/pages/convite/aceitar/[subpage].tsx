import InvitesComponent from "@/OLD/components/Invite";
import { Invite } from "@/domain";
import { RemoteInvite } from "@/data";
import { container, TypesAutomatiza } from "@/container";

export default function InvitesPage(props: Invite) {
  return <InvitesComponent type="accept" {...props} />;
}

export async function getServerSideProps(ctx) {
  const result = await container
    .get<RemoteInvite>(TypesAutomatiza.RemoteInvite)
    .load({ id: ctx?.query?.subpage });

  return {
    props: result,
  };
}
