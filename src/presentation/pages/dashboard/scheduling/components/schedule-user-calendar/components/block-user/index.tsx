import { ScheduleUser } from "@/domain";

import * as S from "./styles";
import { BlockUserButton } from "@/OLD/components/Colaborators/Collaborators/Absence/Create";
import { Icon, Tooltip, useQueryClient } from "infinity-forge";

export function BlockUser({ scheduleUser }: { scheduleUser: ScheduleUser }) {
  const refetch = useQueryClient((state) => state.refetch);

  return (
    <S.BlockUser>
      <BlockUserButton
        userId={scheduleUser.id}
        onSucess={() => {
          refetch(["RemoteLoadAllSchedulesUser"], { mode: "include" });
        }}
        Component={({ onClick }) => (
          <Tooltip
            idTooltip="blockschedule"
            content={"Bloquear agenda"}
            enableHover
            position="bottom-center"
            trigger={
              <button type="button" onClick={onClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <line x1="8" y1="4" x2="8" y2="2" />
                  <line x1="16" y1="4" x2="16" y2="2" />

                  <line x1="7" y1="14" x2="11" y2="14" />
                  <line x1="7" y1="18" x2="11" y2="18" />

                  <rect x="13" y="15" width="6" height="6" rx="1.5" />
                  <path d="M15 15 V13 a2 2 0 0 1 4 0 V15" />
                </svg>
              </button>
            }
          />
        )}
      />
    </S.BlockUser>
  );
}
