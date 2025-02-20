import { useRef } from "react";
import { useRouter } from "next/router";

import {
  Select,
  PageWrapper,
  FormHandler,
  updateRoute,
  InputDateRange,
} from "infinity-forge";
import moment from "moment";

import { PrintScreen } from "./components";

import { RemoteMarketing } from "@/data";
import { usePrint } from "./hooks/use-print";
import { container, MarketingTypes } from "@/container";
import { useLoadMarketing, useLoadAllAvailableUnits } from "@/presentation";

import * as S from "./styles";

export function MarketingCampaignsReports() {
  const campaigns = useLoadMarketing({ allCampaigns: true });
  const businessUnits = useLoadAllAvailableUnits();

  const componentRef = useRef<HTMLDivElement>(null);
  const { campaingsReports, setCampaingsReports } = usePrint({ componentRef });
  const router = useRouter();

  const initialData = {
    ...router?.query,
    marketingCampaign: Number(router?.query?.marketingCampaign) || "",
    units: Array.isArray(router?.query.units)
      ? router?.query.units
      : [router?.query?.units ?? []],
    period: {
      startDate: router?.query?.startDate,
      endDate: router?.query?.endDate,
    },
  };

  async function handleSubmit(payload) {
    const { period, ...rest } = payload;

    const fromDate = period?.startDate
      ? moment(period?.startDate).format("YYYY-MM-DD")
      : null;
    const toDate = period?.endDate
      ? moment(period?.endDate).format("YYYY-MM-DD")
      : null;

    const data = {
      ...rest,
      fromDate,
      toDate,
    };

    const response = await container
      .get<RemoteMarketing>(MarketingTypes.RemoteMarketing)
      .loadCampaingsReports(data);

    updateRoute({
      router: router,
      params: data,
    });

    setCampaingsReports(response);
  }

  return (
    <S.MarketingCampaignsReports>
      <PageWrapper title="Relatórios de campanha de marketing">
        <FormHandler
          isStickyButtons
          initialData={initialData}
          cleanFieldsOnSubmit={false}
          button={{ text: "Imprimir" }}
          onSucess={handleSubmit}
        >
          <div className="filter-container">
            <Select
              label="Unidades"
              menuPlacement="bottom"
              name="units"
              isMultiple={true}
              options={
                businessUnits?.data?.map((unit) => ({
                  value: unit?.id,
                  label: unit?.identification,
                })) || []
              }
            />

            {campaigns?.data && (
              <Select
                isClearable
                label="Campanha"
                menuPlacement="bottom"
                name="marketingCampaign"
                onlyOneValue
                options={campaigns?.data?.map((campaign) => ({
                  value: campaign?.id,
                  label: campaign?.description,
                }))}
              />
            )}

            <Select
              isClearable
              label="Ativo"
              menuPlacement="bottom"
              name="active"
              onlyOneValue
              options={[
                {
                  value: "true",
                  label: "Sim",
                },
                {
                  value: "false",
                  label: "Não",
                },
              ]}
            />
            <div style={{ paddingBottom: 10 }}>
              <InputDateRange
                names={["period.startDate", "period.endDate"]}
                mode="date"
                label="Período"
              />
            </div>
          </div>
        </FormHandler>

        <div style={{ display: "none" }}>
          <div ref={componentRef}>
            {campaingsReports && <PrintScreen reports={campaingsReports} />}
          </div>
        </div>
      </PageWrapper>
    </S.MarketingCampaignsReports>
  );
}
