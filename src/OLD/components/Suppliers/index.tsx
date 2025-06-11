// @ts-nocheck
import React, { memo, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useSuppliers } from "@/OLD/hooks/useSuppliers";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Container } from "./styles";
import { Table } from "antd";
import Filters from "./Filters";

import { suppliersColumns } from "./Columns";

import { Button, PageWrapper } from "infinity-forge";

import { FiEdit2, FiTrash2 } from "react-icons/fi";
import AccessDenied from "@/OLD/components/AccessDenied";

import masks from "@/OLD/utils/masks";
import Link from "next/link";

const Suppliers = memo(function Suppliers() {
  const [filters, setFilters] = useState({});
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formattedSuppliers, setFormattedSuppliers] = useState([]);

  const listSuppliersPermission = useUserHasPermission("FOR00");
  const canCreateSuppliers = useUserHasPermission("FOR01");
  const canEditSuppliers = useUserHasPermission("FOR02");
  // const canDeleteSuppliers = useUserHasPermission("FOR03"); /// Botao nao existe

  const { suppliers, loadingSuppliers, fetchSuppliers } = useSuppliers(filters);

  const router = useRouter();

  const suppliersMapper = () => {
    setLoading(true);
    setFormattedSuppliers(
      suppliers?.map((item) => {
        return {
          corporateName: item?.corporateName,
          name: (
            <span
              className="uk-link"
              onClick={() =>
                router.push(`/dashboard/fornecedores/detalhes/${item?.id}`)
              }
            >
              {item?.name}
            </span>
          ),
          email: item?.email,
          document: item?.document
            ? masks?.cnpj(item?.document)
            : item?.document,
          tag: item?.tag,
          telephone: item?.telephone
            ? masks?.phone(item?.telephone)
            : item?.telephone,
          cellphone: item?.cellphone
            ? masks?.phone(item?.cellphone)
            : item?.cellphone,
          actions: (
            <section>
              {canEditSuppliers && (
                <FiEdit2
                  onClick={() => {
                    router.push(`/dashboard/fornecedores/editar/${item.id}`);
                  }}
                  style={{ cursor: "pointer", fontSize: "1.2rem" }}
                />
              )}
            </section>
          ),
        };
      }),
    );
  };

  useEffect(() => {
    suppliers?.length > 0 ? suppliersMapper() : setFormattedSuppliers([]);
  }, [suppliers, canCreateSuppliers, canEditSuppliers]);

  return !listSuppliersPermission || listSuppliersPermission === "loading" ? (
    <AccessDenied loading={listSuppliersPermission} />
  ) : (
    <PageWrapper title="Fornecedores">
      <Container>
        <Filters
          filters={filters}
          setFilters={setFilters}
          shouldRefetch={() => fetchSuppliers()}
        />
        <div className="uk-flex uk-flex-right" style={{ gap: 20 }}>
          <Button
            disabled={!canCreateSuppliers}
            onClick={() => router.push("/dashboard/fornecedores/novo")}
            text="Cadastrar"
          />
          <Button
            loading={loadingSuppliers}
            onClick={() => fetchSuppliers()}
            text="Filtrar"
          />
        </div>
        <hr />
        <Table columns={suppliersColumns} dataSource={formattedSuppliers} />
      </Container>
    </PageWrapper>
  );
});

export default Suppliers;
