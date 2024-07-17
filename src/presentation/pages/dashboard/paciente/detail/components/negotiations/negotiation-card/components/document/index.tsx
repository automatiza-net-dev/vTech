import { RemoteBills } from "@/data";
import { Print } from "@/presentation";
import { Document as IDocument } from "@/domain";
import { container, TypesAutomatiza } from "@/container";
import { useQueryClient } from "react-query";
import { Button } from "infinity-forge";

import * as S from "./styles";
import { useRouter } from "next/router";
import moment from "moment";

export function Document(props: IDocument) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return (
    <S.Document className="document">
      {props?.documentTemplate?.description}

      <div>
        {props.printUser?.name && <h4>{props.printUser?.name}</h4>}
        <span>
          {moment(props?.printed_at).locale("pt-br").format("DD/MM/YYYY HH:mm")}
        </span>

        <Print
          onBeforePrint={() => {
            container
              .get<RemoteBills>(TypesAutomatiza.RemoteBills)
              .printDocument({ billDocumentId: props?.id });

            queryClient.invalidateQueries({
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
          <Button
            className={props?.printed_at ? "printed" : ""}
            type="button"
            svg={
              props?.printUser || props.printUser?.name
                ? "IconPrint"
                : undefined
            }
            text="Imprimir"
          />
        </Print>
      </div>
    </S.Document>
  );
}
