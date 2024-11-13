import { Invite } from "@/domain";
import { RemoteInvite } from "@/data";
import { container, TypesAutomatiza } from "@/container";
import InvitesComponent from "@/OLD/components/Invite";

export default function InvitesPage(props: Invite) {
  if (!props) {
    return <></>;
  }

  return <InvitesComponent {...props} type="new" />;
}

export async function getServerSideProps(ctx) {
  const result = await container
    .get<RemoteInvite>(TypesAutomatiza.RemoteInvite)
    .load({ id: ctx?.query?.subpage });

  return {
    props: result,
  };
}
