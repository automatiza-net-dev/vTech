import { useEffect, useState } from "react";

import { Button, useAuthAdmin, useQuery } from "infinity-forge";

import { Modal } from "./modal";

import * as S from "./styles";

export function NotificationsModal() {
  const [open, setOpen] = useState(false);

  const { user } = useAuthAdmin()

  const { data } = useQuery({
    queryKey: [user?.id, "notifications"],
    queryFn: () => [
      {
        id: 1,
        title: "Orçamentos Pendentes",
        status: "",
        message:
          "Existem <strong>orçamentos</strong> <br /> que estão pendentes de liberação de Cortesia / Desconto Máximo. Clique Aqui para ir para a tela de Orçamentos",
        createdAt: null,
        createdAtText: null,
        isRead: false,
        link: "/dashboard/orcamentos?pending=true",
        required: true,
        image: "",
      },
      
    ],
    enableCache: true
  });

  useEffect(() => {
    if (data?.length > 0 && user) {
      setOpen(true);
    }
  }, [data, user]);

  const notification = data?.[0];

  if (!notification) {
    return <></>;
  }

  return (
    <>
      <Modal isNotPossibleClose hideCloseButton open={open} onClose={() => {}}>
        <S.Notifications>
          <div>
            {notification.image && <img src={notification.image} />}

            {notification.title && <h2>{notification.title}</h2>}

            {notification.message && (
              <div
                className="font-16-regular message"
                dangerouslySetInnerHTML={{ __html: notification.message }}
              />
            )}

            <div className="actions">
              {!notification.required && (
                <Button
                  type="button"
                  text="Sair"
                  onClick={() => setOpen(false)}
                />
              )}

              <Button
                type="button"
                text="Marcar como lida"
                onClick={() => setOpen(false)}
              />
            </div>
          </div>
        </S.Notifications>
      </Modal>
    </>
  );
}
