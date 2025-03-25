export function ServicesSelected() {
  return (
    <>
      {itensSelected.length > 0 && (
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
            onClick={() => setItensSelected([])}
          >
            Limpar Itens Selecionados
          </button>
        </div>
      )}

      {itensOrcamento.length > 0 && (
        <div className="orcamento-container">
          {itensOrcamento.map((orc, index) => (
            <div key={index} className="orcamento-item" style={{ gap: 20 }}>
              <span className="font-14-regular">
                {orc.item.description} - {orc.service.description} - R${" "}
                {orc.service.price}
              </span>
              <button
                type="button"
                onClick={() =>
                  setItensOrcamento((prev) =>
                    prev.filter((_, i) => i !== index)
                  )
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

      {itensOrcamento.length > 0 && (
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
            onClick={() => setItensOrcamento([])}
          >
            Limpar Orçamentos
          </button>
        </div>
      )}
    </>
  );
}
