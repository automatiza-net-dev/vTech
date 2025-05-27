// @ts-nocheck
import { Form, Input, Modal, Select, Button as ButtonA } from "antd";
import { memo, useCallback, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "infinity-forge";
import { animalServices } from "@/OLD/services/animal.service";
import { FiEdit2 } from "react-icons/fi";
import { useSpecies } from "@/OLD/hooks/useSpecies";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useToast } from "infinity-forge";

export const Edit = memo(({ item, reload, setReload }) => {
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(false);
  const { Option } = Select;
  const [payload, setPayload] = useState({});

  const { createToast } = useToast();

  useEffect(() => {
    setPayload({
      description: item.description,
      specie_id: item.specie.id,
      fur: item?.fur,
    });
  }, [item]);

  const { species, loadingSpecies } = useSpecies("ALL");

  const { mutate, loading } = useMutation({
    queryKey: ["EditAAA"],
    queryFn: (data) => animalServices.editRace(item.id, data),
    onSuccess: () => {
      createToast({ message: "Espécie editada!", status: "success" });

      setIsVisible(false);
      setPayload(null);
      setReload(!reload);
      queryClient.invalidateQueries(["getSpecies"]);
    },
    onError: () => {
      createToast({ message: "Erro ao editar espécie!", status: "error" });
    },
  });

  const handleSubmit = useCallback(() => {
    mutate(payload);
  }, [payload, item.id]);

  const canEditRace = useUserHasPermission("RAC02");
  const canCreateSpecie = useUserHasPermission("ESP01");

  return (
    <div>
      {canEditRace && (
        <FiEdit2
          onClick={() => {
            setPayload(item);
            setIsVisible(true);
          }}
          style={{ cursor: 'pointer', fontSize: '1.2rem' }}
        />
      )}

      <Modal
        loading={loading}
        title="Editar espécie"
        visible={isVisible}
        onOk={() => document.getElementById(`edit-specie-${item.id}`).click()}
        onCancel={() => {
          setIsVisible(false);
        }}
      >
        <Form layout="vertical" onSubmitCapture={handleSubmit}>
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
              required
              value={payload?.specie_id}
              onChange={(e) => setPayload({ ...payload, specie_id: e })}
            >
              {(species || [])?.map((item) => (
                <Option value={item.id}>{item.description}</Option>
              ))}
              {canCreateSpecie && (
                <Option>
                  <ButtonA
                    className="uk-width-1-1"
                    onClick={() =>
                      document.getElementById("create-new-specie-modal").click()
                    }
                  >
                    Criar nova espécie
                  </ButtonA>
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
          <input
            type={"submit"}
            id={`edit-specie-${item.id}`}
            style={{ display: "none" }}
          />
        </Form>
      </Modal>
    </div>
  );
});
