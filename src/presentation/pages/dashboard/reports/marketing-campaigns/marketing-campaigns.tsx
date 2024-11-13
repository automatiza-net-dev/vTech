import { useRef } from "react";

import { useRouter } from "next/router";

import moment from "moment";
import { useReactToPrint } from "react-to-print";
import {
  Select,
  PageWrapper,
  FormHandler,
  updateRoute,
  RangeDatePicker,
} from "infinity-forge";

import {
  useLoadMarketing,
  useLoadCampaingsReports,
  useLoadAllAvailableUnits,
} from "@/presentation";
import { PrintScreen } from "./components";

import * as S from "./styles";

export function MarketingCampaignsReports() {
  const campaigns = useLoadMarketing({ allCampaigns: true });
  const businessUnits = useLoadAllAvailableUnits();
  const componentRef = useRef<HTMLDivElement>(null);
  const campaingsReports = useLoadCampaingsReports();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const router = useRouter();

  const initialData = {
    units: [],
    campaign: "",
    period: "",
    active: "",
  };

  return (
    <S.MarketingCampaignsReports>
      <PageWrapper title="Relatórios de campanha de marketing">
        <FormHandler
          cleanFieldsOnSubmit={false}
          initialData={initialData}
          customSubmit={[
            {
              action: (payload) => {
                const fromDate = moment(payload?.period?.startDate).format(
                  "YYYY-MM-DD"
                );

                const toDate = moment(payload?.period?.endDate).format(
                  "YYYY-MM-DD"
                );

                updateRoute({
                  params: {
                    ...payload,
                    fromDate,
                    toDate,
                  },
                  router,
                });

                handlePrint();
              },
              active: true,
              props: {
                text: "Imprimir",
              },
            },
          ]}
        >
          <div className="filter-container">
            {businessUnits?.data && (
              <Select
                label="Unidades"
                menuPlacement="bottom"
                name="units"
                isMultiple={true}
                options={businessUnits?.data?.map((unit) => ({
                  value: unit?.id,
                  label: unit?.identification,
                }))}
              />
            )}

            {campaigns?.data && (
              <Select
                label="Campanha"
                menuPlacement="bottom"
                name="campaign"
                onlyOneValue
                options={campaigns?.data?.map((campaign) => ({
                  value: campaign?.id,
                  label: campaign?.description,
                }))}
              />
            )}

            <Select
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

            <RangeDatePicker name="period" mode="date" label="Período" />
          </div>
        </FormHandler>
        <div style={{ display: "none" }}>
          <div ref={componentRef}>
            {campaingsReports?.data && campaingsReports?.data && (
              <PrintScreen reports={campaingsReports.data} />
            )}
          </div>
        </div>
      </PageWrapper>
    </S.MarketingCampaignsReports>
  );
}
