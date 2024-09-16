// @ts-nocheck
import { memo, useState } from "react";
import { Create } from "./Create";
import { List } from "./List";

// Components
import { Input } from "./styles";
import { PageWrapper } from "infinity-forge";
import AccessDenied from "@/OLD/components/AccessDenied";

// Hooks
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

//Utils
import { normalizeStr } from "@/OLD/utils/normalizeString";

export const ScheduleStatus = memo(() => {
  const [searchText, setSearchText] = useState("");

  const listScheduleStatusPermission = useUserHasPermission("AST00");

  return !listScheduleStatusPermission ||
    listScheduleStatusPermission === "loading" ? (
    <AccessDenied loading={listScheduleStatusPermission} />
  ) : (
    <PageWrapper title="Status de agendamento">
      <div>
        <Input className="uk-margin-top uk-width-1-1">
          <input
            className="uk-width-1-1"
            type="search"
            placeholder="Digite detalhes sobre o status"
            onChange={(e) => setSearchText(normalizeStr(e.target.value))}
          />
        </Input>
        <hr />
        <List searchText={searchText} />
      </div>
    </PageWrapper>
  );
});
