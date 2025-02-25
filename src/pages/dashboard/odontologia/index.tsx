import { useState } from "react";
import styled from "styled-components";

export default function Odontologia() {
  const [departament, setDepartament] = useState<any>(json[0]);
  const [itensSelected, setItensSelected] = useState<any>([]);
  const [itensOrcamento, setItensOrcamento] = useState<any>([]);

  const handleDepartamentSelect = (selectedDepartament) => {
    setDepartament(selectedDepartament);
    setItensSelected([]);
  };

  const handleItemSelection = (item) => {
    setItensSelected((prev) =>
      prev.some((i) => i.description === item.description)
        ? prev.filter((i) => i.description !== item.description)
        : [...prev, item]
    );
  };

  const handleServiceSelection = (service) => {
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
    });
  };

  const clearSelectedItems = () => {
    setItensSelected([]);
  };

  const clearOrcamentos = () => {
    setItensOrcamento([]);
  };

  const removeOrcamento = (index) => {
    setItensOrcamento((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Container>
      <div className="departament-selection">
        {json.map((dept) => (
          <button
            key={dept.departament}
            type="button"
            className="button-select-departament"
            onClick={() => handleDepartamentSelect(dept)}
          >
            <img src={dept.image} alt={dept.departament} />
          </button>
        ))}
      </div>

      {departament && (
        <div className="items-container">
          {departament.itens.map((item) => (
            <ItemCard
              key={item.description}
              onClick={() => handleItemSelection(item)}
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
      )}

      <div className="button-container">
        {itensSelected.length > 0 && (
          <button
            type="button"
            className="font-14-regular"
            onClick={clearSelectedItems}
          >
            Limpar Itens Selecionados
          </button>
        )}
        {itensOrcamento.length > 0 && (
          <button
            type="button"
            className="font-14-regular"
            onClick={clearOrcamentos}
          >
            Limpar Orçamentos
          </button>
        )}
      </div>

      {itensSelected.length > 0 && (
        <div className="services-container">
          {departament.services.map((service) => (
            <button
              key={service.description}
              type="button"
              className="service-button font-14-regular"
              onClick={() => handleServiceSelection(service)}
            >
              {service.description} - R$ {service.price}
            </button>
          ))}
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
                onClick={() => removeOrcamento(index)}
                style={{ background: "transparent", border: 0, color: "red" }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}

// Styled Components
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;

  .departament-selection {
    display: flex;
    gap: 15px;
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

  .button-select-departament:hover {
    transform: scale(1.1);
  }

  .items-container,
  .services-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
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
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #eef;
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
    image: "/images/odontologia/quadrante/departament.png",
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
        description: "18",
        image: "/images/odontologia/dentes/18.png",
        obs: true,
      },
      {
        description: "17",
        image: "/images/odontologia/dentes/17.png",
        obs: true,
      },
      {
        description: "16",
        image: "/images/odontologia/dentes/16.png",
        obs: true,
      },
      {
        description: "15",
        image: "/images/odontologia/dentes/15.png",
        obs: true,
      },
      {
        description: "14",
        image: "/images/odontologia/dentes/14.png",
        obs: true,
      },
      {
        description: "13",
        image: "/images/odontologia/dentes/13.png",
        obs: true,
      },
      {
        description: "12",
        image: "/images/odontologia/dentes/12.png",
        obs: true,
      },
      {
        description: "11",
        image: "/images/odontologia/dentes/11.png",
        obs: true,
      },
      {
        description: "21",
        image: "/images/odontologia/dentes/21.png",
        obs: true,
      },
      {
        description: "22",
        image: "/images/odontologia/dentes/22.png",
        obs: true,
      },
      {
        description: "23",
        image: "/images/odontologia/dentes/23.png",
        obs: true,
      },
      {
        description: "24",
        image: "/images/odontologia/dentes/24.png",
        obs: true,
      },
      {
        description: "25",
        image: "/images/odontologia/dentes/25.png",
        obs: true,
      },
      {
        description: "26",
        image: "/images/odontologia/dentes/26.png",
        obs: true,
      },
      {
        description: "27",
        image: "/images/odontologia/dentes/27.png",
        obs: true,
      },
      {
        description: "28",
        image: "/images/odontologia/dentes/28.png",
        obs: true,
      },
      {
        description: "48",
        image: "/images/odontologia/dentes/48.png",
        obs: true,
      },
      {
        description: "47",
        image: "/images/odontologia/dentes/47.png",
        obs: true,
      },
      {
        description: "46",
        image: "/images/odontologia/dentes/46.png",
        obs: true,
      },
      {
        description: "45",
        image: "/images/odontologia/dentes/45.png",
        obs: true,
      },
      {
        description: "44",
        image: "/images/odontologia/dentes/44.png",
        obs: true,
      },
      {
        description: "43",
        image: "/images/odontologia/dentes/43.png",
        obs: true,
      },
      {
        description: "42",
        image: "/images/odontologia/dentes/42.png",
        obs: true,
      },
      {
        description: "41",
        image: "/images/odontologia/dentes/41.png",
        obs: true,
      },
    ],
  },
];
