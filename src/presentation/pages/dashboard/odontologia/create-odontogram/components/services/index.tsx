import { FormHandler, Input } from "infinity-forge";

export function Services() {
  return (
    <>
      <div style={{ width: 300 }}>
        <div className="services-container">
          <FormHandler initialData={{ query: "" }}>
            <Input name="query" placeholder="Buscar" />
          </FormHandler>

          {departament.services.map((service) => (
            <button
              key={service.description}
              type="button"
              className="service-button font-14-regular"
              onClick={() =>
                setItensOrcamento((prev) => {
                  const newOrcamento = [...prev];
                  itensSelected.forEach((item) => {
                    if (
                      !newOrcamento.some(
                        (o) =>
                          o.item.description === item.description &&
                          o.service.description === service.description
                      )
                    ) {
                      newOrcamento.push({ item, service });
                    }
                  });
                  return newOrcamento;
                })
              }
            >
              {service.description}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
