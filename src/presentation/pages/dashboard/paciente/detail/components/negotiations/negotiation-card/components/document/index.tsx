import { RemoteBills } from "@/data";
import { Print } from "@/presentation";
import { Document as IDocument } from "@/domain";
import { container, TypesAutomatiza } from "@/container";
import { useQueryClient } from "@/presentation/use-query";
import { Button, Icon } from "infinity-forge";

import * as S from "./styles";
import { useRouter } from "next/router";
import moment from "moment";

export function Document(props: IDocument) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return (
    <S.Document className="document">
      <div>{props?.documentTemplate?.description}</div>
      <div>
        {props?.generationUser?.name} -{" "}
        {moment(props?.created_at).format("DD/MM/YYYY - HH:mm")}h
      </div>
      <div style={{ justifyContent: "right" }}>
        <span>
          {props?.printed_at ? (
            <>
              Impresso por {props.printUser?.name} em <br />
              {moment(props?.printed_at)
                .locale("pt-br")
                .format("DD/MM/YYYY HH:mm")}
            </>
          ) : (
            "Documento não impresso"
          )}
        </span>

        <Print
          onBeforePrint={async () => {
            await container
              .get<RemoteBills>(TypesAutomatiza.RemoteBills)
              .printDocument({ billDocumentId: props?.id });

            await queryClient.invalidateQueries({
              queryKey: ["openNegotiations", router?.query?.id as string],
            });
          }}
          PdfContent={
            <div
              style={{ fontSize: 12.5 }}
              dangerouslySetInnerHTML={{
                __html: props.documentTemplate.template,
              }}
            ></div>
          }
        >
          <div className={"imprimir " + (props?.printed_at ? "printed" : "")}>
            <Icon name="IconPrint" />

            Imprimir
          </div>
        </Print>
      </div>
    </S.Document>
  );
}
