// @ts-nocheck
import { Form, Input, Modal, Select } from "antd";
import { Button, useToast } from "infinity-forge";
import { useSpecies } from "@/OLD/hooks/useSpecies";
import { memo, useCallback, useState } from "react";
import { useMutation, useQuery } from "infinity-forge";
import { useQueryClient } from "infinity-forge";
import { animalServices } from "@/OLD/services/animal.service";
import { Create as CreateSpecie } from "@/OLD/components/Species/Create";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

export const Create = ({
  visible,
  setVisible,
  button,
  reload,
  setReload,
  fetchRaces,
}) => {
  const queryClient = useQueryClient();
  const [payload, setPayload] = useState();
  const [createSpecieVisible, setCreateSpecieVisible] = useState(false);
  const { Option } = Select;
  const { species, loadingSpecies } = useSpecies("ALL", reload);
  const { createToast } = useToast();

  const { mutate, loading } = useMutation({
    queryKey: ["CreateAAA"],
    queryFn: (data) => animalServices.createRace(data),
    onSuccess: () => {
      createToast({ message: "Raça criada!", status: "success" });

      setVisible(false);
      setPayload(null);
      queryClient.invalidateQueries(["getRaces"]);
      if (fetchRaces) {
        fetchRaces();
      }
    },
    onError: (error) => {
      createToast({ message: "Erro ao criar Raça!", status: "error" });
    },
  });

  const handleSubmit = useCallback(() => {
    mutate(payload);
  }, [payload]);

  const canCreateRace = useUserHasPermission("RAC01");
  const canCreateSpecie = useUserHasPermission("ESP01");

  return (
    <div>
      {button && (
        <Button
          disabled={!canCreateRace}
          onClick={() => setVisible(true)}
          text="Criar nova raça"
        />
      )}
      <Modal
        loading={loading}
        title="Criar Raça"
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        footer={null}
      >
        <Form
          layout="vertical"
          onSubmitCapture={handleSubmit}
          id="form-create-race"
        >
          <Form.Item label="Descrição">
            <Input
              required
              max="14"
              value={payload?.description}
              onChange={(e) =>
                setPayload({ ...payload, description: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Espécie">
            <Select
              loading={loadingSpecies}
              value={payload?.specie_id}
              required
              onChange={(e) =>
                setPayload({
                  ...payload,
                  specie_id: e !== "nova-especie" ? e : "",
                })
              }
            >
              {(species || [])?.map((item) => (
                <Option value={item.id}>{item.description}</Option>
              ))}
              {canCreateSpecie && (
                <Option value="nova-especie">
                  <Button
                    onClick={() => {
                      setPayload({ ...payload, specie_id: "" });
                      setCreateSpecieVisible(true);
                    }}
                    text="Criar nova espécie"
                  />
                </Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item label="Tipo Pelagem">
            <Select
              onChange={(e) => setPayload({ ...payload, fur: e })}
              value={payload?.fur}
            >
              <Option value="PELO_LONGO">Pelo longo</Option>
              <Option value="PELO_CURTO">Pelo curto</Option>
            </Select>
          </Form.Item>
          <footer
            style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <Button
              type="button"
              text="Cancelar"
              onClick={() => setVisible(false)}
            />
            <Button type="submit" text="Salvar" />
          </footer>
        </Form>
      </Modal>
      <CreateSpecie
        visible={createSpecieVisible}
        setVisible={setCreateSpecieVisible}
        reload={reload}
        setReload={setReload}
        t
        button={false}
      />
    </div>
  );
};
