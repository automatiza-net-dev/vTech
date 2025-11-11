import { Input, Switch } from "antd";
import { Button, useToast } from "infinity-forge";
import { useRouter } from "next/router";
import { type Dispatch, memo, type SetStateAction } from "react";
import { Container } from "./styles";

const FormChild = memo(
  (props: {
    data: Record<string, string | boolean>;
    setData: Dispatch<SetStateAction<Record<string, string | boolean>>>;
    submit: () => void;
    showActive?: boolean;
  }) => {
    const router = useRouter();

    return (
      <form
        className="uk-margin-top"
        onSubmit={(e) => {
          e.preventDefault();
          props.submit();
        }}
      >
        <Container className="uk-padding">
          <div className="uk-heading-line">
            <span>Dados</span>
          </div>
          <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
            <div className="uk-width-1-3 uk-margin-right">
              <label htmlFor="whatsappPhone">Telefone</label>
              <Input
                id={"whatsappPhone"}
                value={props.data?.whatsappPhone as string}
                onChange={(e) =>
                  props.setData({
                    ...props.data,
                    whatsappPhone: e.target.value,
                  })
                }
              />
            </div>

            <div className="uk-width-1-3 uk-margin-right">
              <label htmlFor="whatsappPhone">Plataforma</label>
              <Input
                id={"platformIntegration"}
                value={props.data?.platformIntegration as string}
                onChange={(e) =>
                  props.setData({
                    ...props.data,
                    platformIntegration: e.target.value,
                  })
                }
              />
            </div>

            {props.showActive && (
              <div className="uk-width-1-3 uk-margin-right">
                <label htmlFor="active">Ativo</label>
                <Switch
                  id={"active"}
                  checked={
                    props.data.active ? (props.data.active as boolean) : false
                  }
                  onChange={(e) =>
                    props.setData({
                      ...props.data,
                      active: e,
                    })
                  }
                />
              </div>
            )}
          </div>
        </Container>
        <footer style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={() => router.back()}
            text="Voltar"
            style={{ marginRight: "10px" }}
          />

          <Button type="submit" text="Salvar" />
        </footer>
      </form>
    );
  },
);

export default FormChild;
