// @ts-nocheck
import React, { useCallback, useContext } from "react";

import { Layout, Menu } from "antd";

import { useRouter } from "next/router";
import { Container } from "./styles";

import { useAuth } from "@/OLD/hooks/useAuth";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Calendar2WeekFill } from "@styled-icons/bootstrap/Calendar2WeekFill";
import { CalendarCheckFill } from "@styled-icons/bootstrap/CalendarCheckFill";
import { HouseFill } from "@styled-icons/bootstrap/HouseFill";
import { User } from "@styled-icons/boxicons-solid/User";
import { Database } from "@styled-icons/fa-solid/Database";
import { HandHoldingMedical } from "@styled-icons/fa-solid/HandHoldingMedical";
import { Hospital } from "@styled-icons/fa-solid/Hospital";
import { NotesMedical } from "@styled-icons/fa-solid/NotesMedical";
import { AnimalCat } from "@styled-icons/fluentui-system-filled/AnimalCat";
import { AnimalRabbit } from "@styled-icons/fluentui-system-filled/AnimalRabbit";
import { CalendarAssistant } from "@styled-icons/fluentui-system-filled/CalendarAssistant";
import { CalendarSettings } from "@styled-icons/fluentui-system-filled/CalendarSettings";
import { CalendarSync } from "@styled-icons/fluentui-system-filled/CalendarSync";
import { DocumentBulletList } from "@styled-icons/fluentui-system-filled/DocumentBulletList";
import { Medication } from "@styled-icons/material-rounded/Medication";
import { Pets } from "@styled-icons/material/Pets";
import { AppContext } from "@/OLD/context/appContext";
import { AiFillLock, AiOutlineGroup, AiTwotoneBank } from "react-icons/ai";
import {
  BsBoxArrowInRight,
  BsBoxArrowLeft,
  BsCashCoin,
  BsFillPeopleFill,
  BsListNested,
  BsBoxes,
  BsCashStack,
} from "react-icons/bs";
import {
  FaAmbulance,
  FaCashRegister,
  FaClinicMedical,
  FaLayerGroup,
  FaProductHunt,
  FaRegObjectGroup,
  FaTruckLoading,
  FaBoxes,
} from "react-icons/fa";
import { FcProcess } from "react-icons/fc";
import {
  GiCash,
  GiMedicalDrip,
  GiMoneyStack,
  GiNightSleep,
  GiPiggyBank,
  GiAmbulance,
  GiBuyCard,
} from "react-icons/gi";
import { GrFormSchedule, GrMoney, GrSchedule } from "react-icons/gr";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IoIosBed } from "react-icons/io";
import {
  MdAttachMoney,
  MdCleaningServices,
  MdOutlineCompareArrows,
  MdOutlineSell,
  MdPayment,
  MdPayments,
  MdOutlineCalendarViewMonth,
  MdOutlineReceiptLong,
} from "react-icons/md";
import { RiProductHuntLine } from "react-icons/ri";
import {
  TbArrowsShuffle2,
  TbFileReport,
  TbLayoutKanban,
  TbReceiptTax,
  TbZoomMoney,
  TbArrowsLeftRight,
  TbBrandGoogleAnalytics,
} from "react-icons/tb";
import { VscGraph, VscGraphLine } from "react-icons/vsc";

const Sider = React.memo(function Sider() {
  const [collapsed, setCollapsed] = React.useState(true);
  const router = useRouter();
  const { user } = useContext(AppContext);
  

  

  const changeRoute = useCallback(
    ({ key }) => {
      if (key === "logout") {
        user.dispatch({ type: "LOGOUT_USER" });
        router.push("/");
      } else {
        router.push(key);
      }
    },
    [user]
  );

  return (
    <Container host={process.env.clientName}>
      <Layout.Sider
        width={300}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Menu
          defaultSelectedKeys={["dashboard"]}
          selectedKeys={[router.asPath]}
          mode="inline"
          onSelect={changeRoute}
        >
          <Menu.Item
            key="/dashboard"
            icon={
              <HouseFill
                color={
                  router.asPath === "/dashboard"
                    ? "var(--darkBlue)"
                    : process.env.client === "liftone"
                    ? "#ffffff"
                    : "var(--gray)"
                }
                size={25}
              />
            }
          >
            Dashboard
          </Menu.Item>

          <Menu.SubMenu
            title="Clínica"
            icon={
              <Hospital
                color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                size={22}
              />
            }
          >
            {useUserHasPermission("CLI00") && (
              <Menu.Item
                key="/dashboard/clinicas"
                icon={
                  <FaClinicMedical
                    color={
                      router.asPath === "/dashboard"
                        ? "var(--darkBlue)"
                        : process.env.client === "liftone"
                        ? "#ffffff"
                        : "var(--gray)"
                    }
                    size={25}
                  />
                }
              >
                Clinica
              </Menu.Item>
            )}
            {useUserHasPermission("COL00") && (
              <Menu.Item
                key="/dashboard/colaboradores"
                icon={
                  <HandHoldingMedical
                    color={
                      router.asPath === "/dashboard"
                        ? "var(--darkBlue)"
                        : process.env.client === "liftone"
                        ? "#ffffff"
                        : "var(--gray)"
                    }
                    size={25}
                  />
                }
              >
                Colaboradores
              </Menu.Item>
            )}
            {useUserHasPermission("ACE00") && (
              <Menu.Item
                key="/dashboard/controle-acesso"
                icon={
                  <AiFillLock
                    color={
                      router.asPath === "/dashboard"
                        ? "var(--darkBlue)"
                        : process.env.client === "liftone"
                        ? "#ffffff"
                        : "var(--gray)"
                    }
                    size={25}
                  />
                }
              >
                Controle de Acesso
              </Menu.Item>
            )}
            {useUserHasPermission("CIP00") && (
              <Menu.Item
                key="/dashboard/controle-ips"
                icon={
                  <AiFillLock
                    color={
                      router.asPath === "/dashboard"
                        ? "var(--darkBlue)"
                        : process.env.client === "liftone"
                        ? "#ffffff"
                        : "var(--gray)"
                    }
                    size={25}
                  />
                }
              >
                Controle de IPs
              </Menu.Item>
            )}

            {useUserHasPermission("MET00") && (
              <Menu.Item
                key="/dashboard/metas"
                icon={
                  <TbLayoutKanban
                    size={22}
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                  />
                }
              >
                Metas
              </Menu.Item>
            )}
          </Menu.SubMenu>

          <Menu.SubMenu
            title="Pessoas"
            icon={
              <BsFillPeopleFill
                color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                size={22}
              />
            }
          >
            {useUserHasPermission("FOR00") && (
              <Menu.Item
                key="/dashboard/fornecedores"
                icon={
                  <FaTruckLoading
                    color={
                      router.asPath === "/dashboard"
                        ? "var(--darkBlue)"
                        : process.env.client === "liftone"
                        ? "#ffffff"
                        : "var(--gray)"
                    }
                    size={25}
                  />
                }
              >
                Fornecedores
              </Menu.Item>
            )}
            {useUserHasPermission("TUT00") && (
              <Menu.Item
                key="/dashboard/tutor"
                icon={
                  <User
                    color={
                      router.asPath === "/dashboard"
                        ? "var(--darkBlue)"
                        : process.env.client === "liftone"
                        ? "#ffffff"
                        : "var(--gray)"
                    }
                    size={25}
                  />
                }
              >
                {process.env.client === "liftone" ? "Clientes" : "Tutores"}
              </Menu.Item>
            )}
            {process.env.client !== "liftone" && (
              <>
                {useUserHasPermission("PET00") && (
                  <Menu.Item
                    key="/dashboard/paciente"
                    icon={
                      <Pets
                        color={
                          router.asPath === "/dashboard"
                            ? "var(--darkBlue)"
                            : process.env.client === "liftone"
                            ? "#ffffff"
                            : "var(--gray)"
                        }
                        size={25}
                      />
                    }
                  >
                    Pets
                  </Menu.Item>
                )}
                {useUserHasPermission("RAC00") && (
                  <Menu.Item
                    key="/dashboard/racas"
                    icon={
                      <AnimalCat
                        color={
                          router.asPath === "/dashboard"
                            ? "var(--darkBlue)"
                            : process.env.client === "liftone"
                            ? "#ffffff"
                            : "var(--gray)"
                        }
                        size={22}
                      />
                    }
                  >
                    Raças
                  </Menu.Item>
                )}
                {useUserHasPermission("ESP00") && (
                  <Menu.Item
                    key="/dashboard/especies"
                    icon={
                      <AnimalRabbit
                        color={
                          router.asPath === "/dashboard"
                            ? "var(--darkBlue)"
                            : process.env.client === "liftone"
                            ? "#ffffff"
                            : "var(--gray)"
                        }
                        size={22}
                      />
                    }
                  >
                    Espécies
                  </Menu.Item>
                )}
              </>
            )}
          </Menu.SubMenu>
          <Menu.SubMenu
            title="Agendamentos"
            icon={
              <CalendarAssistant
                color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                size={22}
              />
            }
          >
            {useUserHasPermission("AGE00") && (
              <Menu.Item
                key="/dashboard/agenda"
                icon={
                  <Calendar2WeekFill
                    color={
                      router.asPath === "/dashboard"
                        ? "var(--darkBlue)"
                        : process.env.client === "liftone"
                        ? "#ffffff"
                        : "var(--gray)"
                    }
                    size={25}
                  />
                }
              >
                Agenda
              </Menu.Item>
            )}
            {useUserHasPermission("AST00") && (
              <Menu.Item
                key="/dashboard/status-agendamento"
                icon={
                  <CalendarSync
                    color={
                      router.asPath === "/dashboard"
                        ? "var(--darkBlue)"
                        : process.env.client === "liftone"
                        ? "#ffffff"
                        : "var(--gray)"
                    }
                    size={22}
                  />
                }
              >
                Status de agendamentos
              </Menu.Item>
            )}
            {useUserHasPermission("ASV00") && (
              <Menu.Item
                key="/dashboard/categorias-agendamento"
                icon={
                  <CalendarCheckFill
                    color={
                      router.asPath === "/dashboard"
                        ? "var(--darkBlue)"
                        : process.env.client === "liftone"
                        ? "#ffffff"
                        : "var(--gray)"
                    }
                    size={21}
                  />
                }
              >
                Serviços de agendamentos
              </Menu.Item>
            )}
            {useUserHasPermission("ATS00") && (
              <Menu.Item
                key="/dashboard/tipos-agendamento"
                icon={
                  <CalendarSettings
                    color={
                      router.asPath === "/dashboard"
                        ? "var(--darkBlue)"
                        : process.env.client === "liftone"
                        ? "#ffffff"
                        : "var(--gray)"
                    }
                    size={22}
                  />
                }
              >
                Tipos de serviço de agendamentos
              </Menu.Item>
            )}
          </Menu.SubMenu>
          {process.env.client !== "liftone" && (
            <Menu.SubMenu
              title="Internação"
              icon={
                <FaAmbulance
                  color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                  size={22}
                />
              }
            >
              {useUserHasPermission("INT00") && (
                <Menu.Item
                  key="/dashboard/internacao"
                  icon={
                    <GiNightSleep
                      size={22}
                      color={
                        process.env.client === "liftone" ? "#ffffff" : "var(--gray)"
                      }
                    />
                  }
                >
                  Internação
                </Menu.Item>
              )}
              <Menu.Item
                key="/dashboard/consulta-internacoes"
                icon={
                  <GiAmbulance
                    size={22}
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                  />
                }
              >
                consulta internações
              </Menu.Item>
              {useUserHasPermission("LEI00") && (
                <Menu.Item
                  key="/dashboard/leitos"
                  icon={
                    <IoIosBed
                      size={22}
                      color={
                        process.env.client === "liftone" ? "#ffffff" : "var(--gray)"
                      }
                    />
                  }
                >
                  Gerenciamento de leitos
                </Menu.Item>
              )}
            </Menu.SubMenu>
          )}
          <Menu.SubMenu
            title="Modelos"
            icon={
              <Database
                color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                size={22}
              />
            }
          >
            {useUserHasPermission("DOC00") && (
              <Menu.Item
                key="/dashboard/documentos"
                icon={
                  <DocumentBulletList
                    color={
                      router.asPath === "/dashboard/documentos"
                        ? "var(--darkBlue)"
                        : process.env.client === "liftone"
                        ? "#ffffff"
                        : "var(--gray)"
                    }
                    size={22}
                  />
                }
              >
                Documentos
              </Menu.Item>
            )}
            {useUserHasPermission("EXA00") && (
              <Menu.Item
                key="/dashboard/exames"
                icon={
                  <GiMedicalDrip
                    color={
                      router.asPath === "/dashboard/exames"
                        ? "var(--darkBlue)"
                        : process.env.client === "liftone"
                        ? "#ffffff"
                        : "var(--gray)"
                    }
                    size={22}
                  />
                }
              >
                Exames
              </Menu.Item>
            )}
            {process.env.client !== "liftone" && useUserHasPermission("PAT00") && (
              <Menu.Item
                key="/dashboard/patologias"
                icon={
                  <Medication
                    color={
                      router.asPath === "/dashboard"
                        ? "var(--darkBlue)"
                        : process.env.client === "liftone"
                        ? "#ffffff"
                        : "var(--gray)"
                    }
                    size={22}
                  />
                }
              >
                Patologias
              </Menu.Item>
            )}
            {useUserHasPermission("REC00") && (
              <Menu.Item
                key="/dashboard/receitas"
                icon={
                  <NotesMedical
                    color={
                      router.asPath === "/dashboard/receitas"
                        ? "var(--darkBlue)"
                        : process.env.client === "liftone"
                        ? "#ffffff"
                        : "var(--gray)"
                    }
                    size={22}
                  />
                }
              >
                Receitas médicas
              </Menu.Item>
            )}
          </Menu.SubMenu>
          <Menu.SubMenu
            title="Produtos/Serviços"
            icon={
              <RiProductHuntLine
                color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                size={22}
              />
            }
          >
            {useUserHasPermission("PRD00") && (
              <Menu.Item
                key="/dashboard/produtos"
                icon={
                  <FaProductHunt
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                    size={22}
                  />
                }
              >
                Produtos
              </Menu.Item>
            )}
            {useUserHasPermission("KIT00") && (
              <Menu.Item
                key="/dashboard/kits"
                icon={
                  <FaRegObjectGroup
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                    size={22}
                  />
                }
              >
                Kits de produtos/serviços
              </Menu.Item>
            )}
            {useUserHasPermission("SRV00") && (
              <Menu.Item
                key="/dashboard/servicos"
                icon={
                  <MdCleaningServices
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                    size={22}
                  />
                }
              >
                Serviços
              </Menu.Item>
            )}
            {process.env.client !== "liftone" && useUserHasPermission("VAC00") && (
              <Menu.Item
                key="/dashboard/vacinas"
                icon={
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2212/2212190.png"
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                    width={22}
                  />
                }
              >
                Vacinas
              </Menu.Item>
            )}
            {useUserHasPermission("GVA00") && (
              <Menu.Item
                key="/dashboard/grupos-variacao"
                icon={
                  <FaLayerGroup
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                    size={22}
                  />
                }
              >
                Grupos de Variação
              </Menu.Item>
            )}
            {useUserHasPermission("VAR00") && (
              <Menu.Item
                key="/dashboard/variacoes"
                icon={
                  <FaLayerGroup
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                    size={22}
                  />
                }
              >
                Variações
              </Menu.Item>
            )}
            {useUserHasPermission("SBG00") && (
              <Menu.Item
                key="/dashboard/subgrupos"
                icon={
                  <FaLayerGroup
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                    size={22}
                  />
                }
              >
                Subgrupos
              </Menu.Item>
            )}
          </Menu.SubMenu>
          <Menu.SubMenu
            title="Depósitos"
            icon={
              <BsBoxes
                color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                size={22}
              />
            }
          >
            {useUserHasPermission("DEP00") && (
              <Menu.Item
                key="/dashboard/depositos"
                icon={
                  <FaBoxes
                    color={
                      router.asPath === "/dashboard"
                        ? "var(--darkBlue)"
                        : process.env.client === "liftone"
                        ? "#ffffff"
                        : "var(--gray)"
                    }
                    size={25}
                  />
                }
              >
                Depositos
              </Menu.Item>
            )}
            {useUserHasPermission("MDE00") && (
              <Menu.Item
                key="/dashboard/movimentacao-depositos"
                icon={
                  <TbArrowsLeftRight
                    color={
                      router.asPath === "/dashboard"
                        ? "var(--darkBlue)"
                        : process.env.client === "liftone"
                        ? "#ffffff"
                        : "var(--gray)"
                    }
                    size={25}
                  />
                }
              >
                Mov. Depositos
              </Menu.Item>
            )}
          </Menu.SubMenu>

          <Menu.SubMenu
            title="Impostos"
            icon={
              <TbReceiptTax
                color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                size={22}
              />
            }
          >
            {useUserHasPermission("GIP00") && (
              <Menu.Item
                key="/dashboard/regras-grupo-impostos"
                icon={
                  <FaLayerGroup
                    size={22}
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                  />
                }
              >
                Grupos de Impostos
              </Menu.Item>
            )}
            {useUserHasPermission("OPF00") && (
              <Menu.Item
                key="/dashboard/operacoes-fiscais"
                icon={
                  <FaLayerGroup
                    size={22}
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                  />
                }
              >
                Operações Fiscais
              </Menu.Item>
            )}
          </Menu.SubMenu>
          <Menu.SubMenu
            title="Movimentações"
            icon={
              <TbArrowsShuffle2
                color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                size={22}
              />
            }
          >
            {useUserHasPermission("VEN00") && (
              <Menu.Item
                key="/dashboard/vendas"
                icon={
                  <TbZoomMoney
                    size={22}
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                  />
                }
              >
                Vendas
              </Menu.Item>
            )}
            {useUserHasPermission("ORC00") && (
              <Menu.Item
                key="/dashboard/orcamentos"
                icon={
                  <TbZoomMoney
                    size={22}
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                  />
                }
              >
                Orçamentos
              </Menu.Item>
            )}
            {useUserHasPermission("TRA00") && (
              <Menu.Item
                key="/dashboard/tratamentos"
                icon={
                  <FcProcess
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                    size={22}
                  />
                }
              >
                Tratamentos
              </Menu.Item>
            )}
            {useUserHasPermission("ENT00") && (
              <Menu.Item
                key="/dashboard/notas-entrada"
                icon={<MdOutlineSell size={22} />}
              >
                Notas de entrada
              </Menu.Item>
            )}
          </Menu.SubMenu>
          <Menu.SubMenu
            title="Financeiro"
            icon={
              <MdAttachMoney
                color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                size={22}
              />
            }
          >
            {useUserHasPermission("MOV00") && (
              <Menu.Item
                key="/dashboard/movimentacao-diaria"
                icon={
                  <GrMoney
                    size={22}
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                  />
                }
              >
                Movimento diário
              </Menu.Item>
            )}
            {useUserHasPermission("CAI00") && (
              <Menu.Item
                key="/dashboard/caixa-diario"
                icon={
                  <FaCashRegister
                    size={22}
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                  />
                }
              >
                Caixa Diário
              </Menu.Item>
            )}
            {useUserHasPermission("TPG00") && (
              <Menu.Item
                key="/dashboard/titulos-pagar"
                icon={
                  <BsBoxArrowLeft
                    size={22}
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                  />
                }
              >
                Títulos a pagar
              </Menu.Item>
            )}
            {useUserHasPermission("TRC00") && (
              <Menu.Item
                key="/dashboard/titulos-receber"
                icon={
                  <BsBoxArrowInRight
                    size={22}
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                  />
                }
              >
                Títulos a receber
              </Menu.Item>
            )}
            <Menu.Item
              key="/dashboard/controle-financeiro"
              icon={
                <BsCashStack
                  size={22}
                  color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                />
              }
            >
              Controle financeiro
            </Menu.Item>
            {useUserHasPermission("FPG00") && (
              <Menu.Item
                key="/dashboard/metodos-pagamento"
                icon={
                  <MdPayments
                    size={22}
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                  />
                }
              >
                Formas de pagamento
              </Menu.Item>
            )}
            {useUserHasPermission("GPC00") && (
              <Menu.Item
                key="/dashboard/grupo-tributacao"
                icon={
                  <AiOutlineGroup
                    size={22}
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                  />
                }
              >
                Grupos de Plano de contas
              </Menu.Item>
            )}
            {useUserHasPermission("PCT00") && (
              <Menu.Item
                key="/dashboard/plano-contas"
                icon={
                  <MdPayment
                    size={22}
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                  />
                }
              >
                Planos de contas
              </Menu.Item>
            )}
          </Menu.SubMenu>
          <Menu.SubMenu
            title="Bancário"
            icon={
              <GiMoneyStack
                color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                size={22}
              />
            }
          >
            {useUserHasPermission("BAN00") && (
              <Menu.Item
                key="/dashboard/controle-bancario"
                icon={
                  <AiTwotoneBank
                    size={22}
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                  />
                }
              >
                Extrato bancário
              </Menu.Item>
            )}
            {useUserHasPermission("CCO00") && (
              <Menu.Item
                key="/dashboard/contas-bancarias"
                icon={
                  <GiPiggyBank
                    size={22}
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                  />
                }
              >
                Contas Correntes
              </Menu.Item>
            )}
          </Menu.SubMenu>

          <Menu.SubMenu
            title="CRM"
            icon={
              <MdOutlineSell
                color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                size={22}
              />
            }
          >
            {/*
            <Menu.Item
              key="/crm/oportunidades"
              icon={
                <HiOutlineLightBulb
                  size={22}
                  color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                />
              }
            >
              Oportunidades
            </Menu.Item>
              */}
            {useUserHasPermission("CRM00") && (
              <Menu.Item
                key="/crm/kanban"
                icon={
                  <TbLayoutKanban
                    size={22}
                    color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                  />
                }
              >
                Kanban
              </Menu.Item>
            )}
          </Menu.SubMenu>
          <Menu.SubMenu
            title="Relatórios"
            icon={
              <HiOutlineDocumentReport
                size={22}
                color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
              />
            }
          >
            <Menu.SubMenu
              title="Financeiro"
              size={22}
              color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
              icon={
                <GiCash
                  size={22}
                  color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                />
              }
            >
              {useUserHasPermission("REL02") && (
                <Menu.Item
                  key="/dashboard/relatorios/fluxo-caixa"
                  icon={
                    <BsCashCoin
                      size={22}
                      color={
                        process.env.client === "liftone" ? "#ffffff" : "var(--gray)"
                      }
                    />
                  }
                >
                  Fluxo caixa
                </Menu.Item>
              )}
              {useUserHasPermission("REL01") && (
                <Menu.Item
                  key="/dashboard/relatorios/titulos"
                  icon={
                    <BsCashCoin
                      size={22}
                      color={
                        process.env.client === "liftone" ? "#ffffff" : "var(--gray)"
                      }
                    />
                  }
                >
                  Titulos
                </Menu.Item>
              )}
              {useUserHasPermission("REL09") && (
                <Menu.Item
                  key="/dashboard/relatorios/regime-competencia"
                  icon={
                    <MdOutlineCalendarViewMonth
                      size={22}
                      color={
                        process.env.client === "liftone" ? "#ffffff" : "var(--gray)"
                      }
                    />
                  }
                >
                  Regime competência
                </Menu.Item>
              )}
              {useUserHasPermission("REL10") && (
                <Menu.Item
                  key="/dashboard/relatorios/regime-caixa"
                  icon={
                    <FaCashRegister
                      size={22}
                      color={
                        process.env.client === "liftone" ? "#ffffff" : "var(--gray)"
                      }
                    />
                  }
                >
                  Regime de caixa
                </Menu.Item>
              )}
              <Menu.Item
                key="/dashboard/relatorios/notas-entrada"
                icon={<MdOutlineReceiptLong size={22} color={"var(--gray)"} />}
              >
                Notas de entrada
              </Menu.Item>
              <Menu.Item
                key="/dashboard/relatorios/notas-entrada-analitico"
                icon={
                  <TbBrandGoogleAnalytics size={22} color={"var(--gray)"} />
                }
              >
                Notas de entrada analitico
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu
              title="Vendas"
              size={22}
              color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
              icon={
                <GiCash
                  size={22}
                  color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                />
              }
            >
              {useUserHasPermission("REL03") && (
                <Menu.Item
                  key="/dashboard/relatorios/vendas"
                  icon={
                    <BsCashCoin
                      size={22}
                      color={
                        process.env.client === "liftone" ? "#ffffff" : "var(--gray)"
                      }
                    />
                  }
                >
                  Listagem de vendas
                </Menu.Item>
              )}
              {useUserHasPermission("REL05") && (
                <Menu.Item
                  key="/dashboard/relatorios/orcamentos"
                  icon={
                    <TbFileReport
                      size={22}
                      color={
                        process.env.client === "liftone" ? "#ffffff" : "var(--gray)"
                      }
                    />
                  }
                >
                  Listagem de orçamentos
                </Menu.Item>
              )}
              {useUserHasPermission("REL06") && (
                <Menu.Item
                  key="/dashboard/relatorios/vendas-analitico"
                  icon={
                    <VscGraphLine
                      size={22}
                      color={
                        process.env.client === "liftone" ? "#ffffff" : "var(--gray)"
                      }
                    />
                  }
                >
                  Vendas analítico
                </Menu.Item>
              )}
              {useUserHasPermission("REL07") && (
                <Menu.Item
                  key="/dashboard/relatorios/ranking-produtos-servicos"
                  icon={
                    <VscGraph
                      size={22}
                      color={
                        process.env.client === "liftone" ? "#ffffff" : "var(--gray)"
                      }
                    />
                  }
                >
                  Ranking produtos/serviços
                </Menu.Item>
              )}
              {useUserHasPermission("REL04") && (
                <Menu.Item
                  key="/dashboard/relatorios/vendas-detalhado"
                  icon={
                    <BsListNested
                      size={22}
                      color={
                        process.env.client === "liftone" ? "#ffffff" : "var(--gray)"
                      }
                    />
                  }
                >
                  Vendas detalhadas
                </Menu.Item>
              )}
              <Menu.Item
                key="/dashboard/relatorios/sugestao-compra"
                icon={<GiBuyCard size={22} color={"var(--gray)"} />}
              >
                Sugestão de compra
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu
              title="Agendamentos"
              size={22}
              color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
              icon={
                <GrFormSchedule
                  size={22}
                  color={process.env.client === "liftone" ? "#ffffff" : "var(--gray)"}
                />
              }
            >
              {useUserHasPermission("REL08") && (
                <Menu.Item
                  key="/dashboard/relatorios/agendamentos"
                  icon={
                    <GrSchedule
                      size={22}
                      color={
                        process.env.client === "liftone" ? "#ffffff" : "var(--gray)"
                      }
                    />
                  }
                >
                  Relatório Agendamentos
                </Menu.Item>
              )}
            </Menu.SubMenu>
          </Menu.SubMenu>
        </Menu>
      </Layout.Sider>
    </Container>
  );
});

export default Sider;
