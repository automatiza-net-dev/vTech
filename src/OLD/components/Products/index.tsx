// @ts-nocheck
// Core
import { useState, useEffect } from "react";

// Services
import { productService } from "@/OLD/services/product.service";

// Hooks
import { useSubgroups } from "@/OLD/hooks/useSubgroup";
import { useTaxationGroups } from "@/OLD/hooks/useTaxationGroups";

// Utils
import { currencyFormatter } from "@/OLD/components/Budget";
import moment from "moment";
import "moment/locale/pt-br";
import { normalizeStr } from "@/OLD/utils/normalizeString";

// Icons
import { CheckOutlined, EditTwoTone } from "@ant-design/icons";
import { VscTasklist } from "react-icons/vsc";

// Components
import { AutoComplete, Select, Table, Modal } from "antd";
import { Button, PageWrapper } from "infinity-forge";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "react-query";
import columns from "./Columns";
import DeleteProduct from "./Delete";
import EditProduct from "./Edit";
import { Container, Input } from "./styles";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
const { Option } = Select;
import AccessDenied from "@/OLD/components/AccessDenied";
import ProductivityItems from "@/OLD/components/mini-components/ProductivityItems";
import CreateProduct from "./Create";
import DetailsProduct from "./Show";

// Utils
import { sortItems } from "@/OLD/utils/sortItems";

const mapper = ({ data }) => ({
  id: data.id,
  courtesy: data?.courtesy ? "Sim" : "Não",
  description: data.description,
  type: data.type === "product" ? "Produto" : "Serviço",
  status: data.active ? "Ativo" : "Inativo",
  code: data.referenceCode ?? "",
  subgroup: data.subgroup?.description ?? "",
  createdAt: moment(data?.created_at).format("DD/MM/YYYY - HH:mm"),
  referenceCode: data.reference_code,
  collectionYear: data.collection_year,
  ncm: data.ncm,
  cest: data.cest,
  features: data.features,
  sid: data.subgroup?.id,
  active: data.active,
  unit: data.unit,
  icmsOrigin: data.icms_origin,
  taxGroup: data.taxationGroup?.id,
  price: currencyFormatter(data?.price?.value),
});

function Products() {
  const { push, query } = useRouter();
  const [filters, setFilters] = useState({ noSearch: true });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [subgroupSearch, setSubgroupSearch] = useState("");
  const [taxationgroupSearch, setTaxationgroupSearch] = useState("");
  const [productivityVisible, setProductivityVisible] = useState(false);
  const [reload, setReload] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(false);
  const [editProductVisible, setEditProductVisible] = useState(false);

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(
    ["products", filters, reload],
    () => {
      if (filters?.noSearch) {
        return [];
      }
      return productService.listProducts(filters).then((res) => res.data);
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );
  const { subgroups } = useSubgroups();
  const { taxationGroups } = useTaxationGroups();

  sortItems(subgroups, "description");
  sortItems(taxationGroups, "name");

  const listProductsPermission = useUserHasPermission("PRD00");
  const canCreateProduct = useUserHasPermission("PRD01");
  const canEditProduct = useUserHasPermission("PRD02");
  const canDeleteProduct = useUserHasPermission("PRD03");

  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        setFilters((prv) => ({ ...prv, noSearch: false }));
        setReload((prv) => !prv);
      }
    });
  }, []);

  return !listProductsPermission || listProductsPermission === "loading" ? (
    <AccessDenied loading={listProductsPermission} />
  ) : (
    <PageWrapper title="Controle de produtos">
      <Container>
        <div className="uk-margin-right uk-flex uk-flex-between uk-margin-top">
          <Input>
            <input
              type="search"
              placeholder="Nome"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  description: normalizeStr(e.target.value),
                })
              }
            />
          </Input>
          <div className="uk-width-1-5 uk-margin-small-right">
            <label>Subgrupo</label>
            <AutoComplete
              allowClear
              onClear={() => {
                const newObj = { ...filters };
                delete newObj?.subgroup;
                setSubgroupSearch("");
                setFilters(newObj);
              }}
              className="uk-width-1-1"
              options={subgroups.map((subgroup) => ({
                ...subgroup,
                value: subgroup?.description,
                key: subgroup?.id,
              }))}
              value={subgroupSearch}
              onChange={(val) => setSubgroupSearch(val)}
              onSelect={(_, option) =>
                setFilters({ ...filters, subgroup: option?.id })
              }
              filterOption={(value, option) =>
                normalizeStr(option?.description).includes(normalizeStr(value))
              }
            />
          </div>
          <div className="uk-width-1-5 uk-margin-small-right">
            <label>Grupo imposto</label>
            <AutoComplete
              className="uk-width-1-1"
              allowClear
              onClear={() => {
                const newObj = { ...filters };
                delete newObj?.taxation;
                setTaxationgroupSearch("");
                setFilters(newObj);
              }}
              options={taxationGroups?.map((group) => ({
                ...group,
                value: group?.name,
              }))}
              value={taxationgroupSearch}
              onChange={(val) => setTaxationgroupSearch(val)}
              onSelect={(_, option) =>
                setFilters({ ...filters, taxation: option?.id })
              }
              filterOption={(value, option) =>
                normalizeStr(option?.name).includes(normalizeStr(value))
              }
            />
          </div>
          <div className="uk-width-1-5 uk-margin-small-right">
            <label>Status</label>
            <Select
              onChange={(val) => {
                if (val === "all") {
                  const newObj = { ...filters };
                  delete newObj?.active;
                  return setFilters(newObj);
                }
                setFilters({ ...filters, active: val });
              }}
              className="uk-width-1-1"
            >
              <Option value={true}>Ativo</Option>
              <Option value={false}>Inativo</Option>
              <Option value="all">Todos</Option>
            </Select>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "5px",
          }}
        >
          <Button
            onClick={() => {
              setFilters({ ...filters, noSearch: false });
              setReload((prv) => !prv);
            }}
            text="Filtrar"
          />

          <Button
            disabled={!canCreateProduct}
            onClick={() => setCreateVisible(true)}
            text="Cadastrar"
          />
        </div>
        <hr />
        <Table
          className="uk-margin-top"
          dataSource={
            isLoading || Object.keys(filters).length === 0
              ? []
              : data
                  ?.map((d) =>
                    mapper({
                      data: d,
                    })
                  )
                  .map((d) => ({
                    ...d,
                    actions: (
                      <div className="uk-flex uk-flex-around">
                          <CheckOutlined
                            size={15}
                            onClick={() => {
                              setSelectedId(d?.id);
                              setDetailsVisible(true);
                            }}
                          />
                          <VscTasklist
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSelectedProduct(d);
                              setProductivityVisible(true);
                            }}
                          />
                        {/*canEditProduct && (
                        <EditTwoTone
                          size={15}
                          onClick={() => {
                            setSelectedProduct(d);
                          }}
                        />
                        )*/}

                        {canDeleteProduct && (
                          <DeleteProduct
                            id={d.id}
                            hide={() => {
                              queryClient.invalidateQueries("products");
                            }}
                          />
                        )}
                      </div>
                    ),
                  }))
          }
          columns={columns}
          locale={{
            emptyText:
              Object.keys(filters).length === 0 ? (
                <>Pesquise acima para exibir o resultado</>
              ) : (
                <>Nenhum resultado encontrado</>
              ),
          }}
        />
        {editProductVisible && (
          <EditProduct
            visible={editProductVisible}
            selectedProduct={selectedProduct}
            close={() => {
              setEditProductVisible(false);
              queryClient.invalidateQueries(["products"]);
            }}
          />
        )}
        <Modal
          title={`Items de produtividade: ${selectedProduct?.description}`}
          visible={productivityVisible}
          onCancel={() => setProductivityVisible(false)}
          footer={null}
          width={900}
        >
          <ProductivityItems productId={selectedProduct?.id} />
        </Modal>
        {createVisible && (
          <Modal
            footer={null}
            visible={createVisible}
            width={1200}
            onCancel={() => setCreateVisible(false)}
          >
            <CreateProduct setVisible={setCreateVisible} />
          </Modal>
        )}
        {detailsVisible && (
          <Modal
            width={1300}
            visible={detailsVisible}
            onCancel={() => setDetailsVisible(false)}
            footer={null}
          >
            <DetailsProduct
              setVisible={setDetailsVisible}
              id={selectedId}
              setReload={setReload}
            />
          </Modal>
        )}
      </Container>
    </PageWrapper>
  );
}

export default Products;
