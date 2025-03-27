import { useFormikContext } from "formik";
import { ItemDepartament, ProductDepartament } from "../../hooks";

export function ServicesSelected() {

 const {setFieldValue, values} = useFormikContext<{
  departamentItems: ItemDepartament[];
  services: { departamentItem: ItemDepartament, service: ProductDepartament  }[]
}>();

  return (
    <>
      {values?.services && values?.services?.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            marginTop: 10,
          }}
        >
          <button
            style={{
              border: 0,
              background: "transparent",
              backgroundColor: "transparent",
              color: "red",
              marginBottom: 10,
            }}
            type="button"
            className="font-12-bold"
            onClick={() => setFieldValue("departamentItems", [])}
          >
            Limpar Itens Selecionados
          </button>
        </div>
      )}

      {values?.services && values?.services?.length > 0 && (
        <div className="orcamento-container">
          {values?.services.map((orc, index) => (
            <div key={index} className="orcamento-item" style={{ gap: 20 }}>
              <span className="font-14-regular">
                {orc?.departamentItem?.description} - {orc?.service?.description} - R${" "}
                {orc?.service?.price}
              </span>
              <button
                type="button"
                onClick={() => {
                  setFieldValue("services", values.services.filter((_, i) => i !== index))
                }
                }
                style={{
                  background: "transparent",
                  border: 0,
                  color: "red",
                }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      {values?.services && values?.services?.length > 0 && (
        <div
          className="button-container"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 10,
          }}
        >
          <button
            type="button"
            className="font-14-regular"
            onClick={() => setFieldValue("services", [])}
          >
            Limpar Orçamentos
          </button>
        </div>
      )}
    </>
  );
}
