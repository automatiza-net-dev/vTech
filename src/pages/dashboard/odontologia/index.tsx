import { FormHandler, hexToRgbA, Input } from "infinity-forge";
import { useState } from "react";
import styled from "styled-components";

export default function Odontologia() {
  const [departament, setDepartament] = useState<any>(json[0]);
  const [itensSelected, setItensSelected] = useState<any>([]);
  const [itensOrcamento, setItensOrcamento] = useState<any>([]);
  const [query, setQuery] = useState("");

  return (
    <Container>
      <div className="departament-selection">
        {json.map((dept) => (
          <button
            key={dept.departament}
            type="button"
            className="button-select-departament"
            onClick={() => {
              setDepartament(dept);
              setItensSelected([]);
            }}
          >
            <img src={dept.image} alt={dept.departament} />
          </button>
        ))}
      </div>

      {departament && (
        <div style={{ width: "100%" }}>
          <div className={"items-container" + ` ${departament.departament}`}>
            {departament.itens.map((item) => (
              <ItemCard
                key={item.description}
                onClick={() =>
                  setItensSelected((prev) =>
                    prev.some((i) => i.description === item.description)
                      ? prev.filter((i) => i.description !== item.description)
                      : [...prev, item]
                  )
                }
                selected={itensSelected.some(
                  (i) => i.description === item.description
                )}
              >
                <img src={item.image} alt={item.description} />
                <Checkbox
                  type="checkbox"
                  checked={itensSelected.some(
                    (i) => i.description === item.description
                  )}
                  readOnly
                />
              </ItemCard>
            ))}
          </div>

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
        </div>
      )}

      {itensSelected.length > 0 ? (
        <div style={{ width: 300 }}>
          <div className="services-container">
            <FormHandler initialData={{ query }}>
              <Input
                name="query"
                placeholder="Buscar"
              />
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
      ) : (
        <div style={{ width: 300 }}></div>
      )}
    </Container>
  );
}

// Styled Components
export const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;

  .departament-selection {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 150px;

    button {
      width: 100%;
      box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 10px 0px;
      border: 1px solid transparent;
      transition: 0.3s;

      img {
        width: 100%;
      }

      &:hover {
        border: 1px solid ${(props) => props.theme.primaryColor};
      }
    }
  }

  .services-container {
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    padding: 10px;
    width: 300px;
  }

  .Arcada {
    transition: 0.3s;
  }

  .Quadrante {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    row-gap: 0 !important;

    > div {
      width: 100%;
      flex-direction: column;

      img {
        width: 100%;
      }
    }
  }

  .Dentes {
    display: grid !important;
    grid-template-columns: repeat(16, 1fr);
    row-gap: 0 !important;

    > div {
      flex-direction: column !important;
      padding: 0 !important;
      border: 0 !important;
      margin: 5px 0;

      img {
        width: 29px;
      }
    }
  }

  .button-select-departament {
    width: 120px;
    border: none;
    background: none;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .button-select-departament img {
    width: 100%;
    height: 80px;
    object-fit: contain;
  }

  .items-container,
  .services-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;
    justify-content: center;
  }

  .item-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #f9f9f9;
  }

  .service-button {
    padding: 10px 15px;
    border: none;
    background: #007bff;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .service-button:hover {
    background: #0056b3;
  }

  .orcamento-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    padding: 10px;
    border: 1px solid ${(props) => hexToRgbA(props.theme.primaryColor, 0.6)};
    border-radius: 8px;
    background: ${(props) => hexToRgbA(props.theme.primaryColor, 0.4)};
  }

  .orcamento-item {
    padding: 5px 10px;
    background: #fff;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center; /* Alinha verticalmente */
  }

  .button-container {
    display: flex;
    gap: 10px;
  }

  .button-container button {
    padding: 10px 15px;
    border: none;
    background: #dc3545;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .button-container button:hover {
    background: #c82333;
  }
`;

const ItemCard = styled.div<any>`
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? "#e0f7fa" : "#fff")};
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 5px 0;
`;

const Checkbox = styled.input`
  margin-left: 10px;
  cursor: pointer;
`;
const json = [
  {
    departament: "Boca",
    image: "/images/odontologia/boca/departament.png",
    itens: [
      {
        description: "Boca",
        image: "/images/odontologia/boca/image.png",
        obs: true,
      },
    ],
    services: [
      {
        description: "aparelho ortodontico",
        price: 2500,
      },
      {
        description: "limpeza",
        price: 300,
      },
      {
        description: "profilaxia",
        price: 300,
      },
    ],
  },
  {
    departament: "Arcada",
    image: "/images/odontologia/arcada/departament.png",
    itens: [
      {
        description: "Superior",
        image: "/images/odontologia/arcada/top.png",
        obs: true,
      },
      {
        description: "Inferior",
        image: "/images/odontologia/arcada/bottom.png",
        obs: true,
      },
    ],
    services: [
      {
        description: "enxerto",
        price: 1000,
      },
      {
        description: "profilaxia",
        price: 250,
      },
    ],
  },
  {
    departament: "Quadrante",
    image: "/images/odontologia/quadrante/quadrante.png",
    itens: [
      {
        description: "Quadrante 1",
        image: "/images/odontologia/quadrante/top-left.png",
        obs: true,
      },
      {
        description: "Quadrante 2",
        image: "/images/odontologia/quadrante/top-right.png",
        obs: true,
      },
      {
        description: "Quadrante 3",
        image: "/images/odontologia/quadrante/bottom-left.png",
        obs: true,
      },
      {
        description: "Quadrante 4",
        image: "/images/odontologia/quadrante/bottom-right.png",
        obs: true,
      },
    ],
    services: [
      {
        description: "enxerto",
        price: 750,
      },
      {
        description: "profilaxia",
        price: 200,
      },
    ],
  },
  {
    departament: "Dentes",
    image: "/images/odontologia/dentes/departament.png",
    services: [
      {
        description: "limpeza",
        price: 100,
      },
      {
        description: "obturação",
        price: 200,
      },
      {
        description: "implante",
        price: 800,
      },
    ],
    itens: [
      {
        description: "1",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "2",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "3",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "4",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "5",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "6",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "7",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "8",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "9",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "10",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "11",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "12",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "13",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "15",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "16",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "17",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "18",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "19",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "20",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "21",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "22",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "23",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "24",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "25",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "26",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "27",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "28",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "29",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "30",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "31",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "32",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "33",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
    ],
  },
];
