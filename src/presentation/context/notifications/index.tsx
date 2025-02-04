import { useEffect, useState } from "react";

import { api, Button, useAuthAdmin, useQuery } from "infinity-forge";

import { Modal } from "./modal";

import * as S from "./styles";

type Notification = {
  "id": number;
  "is_required": boolean,
  "type": string,
  "message":  string,
  "image":  string,
  title: string;
}

export function NotificationsModal() {
  const [open, setOpen] = useState(false);

  const { user } = useAuthAdmin()

  const { data, mutate } = useQuery({
    queryKey: [user?.unit?.id, "notifications"],
    queryFn: async () => {
      const response = await api({ url: "Notifications/list-notifications", method: "get" })

      return response as Notification[]
    },
    enabled: !!user,
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
              {!notification.is_required && (
                <Button
                  type="button"
                  text="Sair"
                  onClick={() => setOpen(false)}
                />
              )}

              <Button
                type="button"
                text="Marcar como lida"
                onClick={async () => {
                  await api({ url: "Notifications/read-notifications", method: "put", body: { notificationId: notification.id } })

                  await mutate()
                }}
              />
            </div>
          </div>
        </S.Notifications>
      </Modal>
    </>
  );
}
