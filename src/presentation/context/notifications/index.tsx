import { useEffect, useState } from "react";

import { api, Button, useAuthAdmin, useQuery } from "infinity-forge";

import { Modal } from "./modal";

import * as S from "./styles";
import { useConfigurationsSystem } from "../configurations";
import { useSystem } from "@/presentation/hooks";

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

  const {unit} = useSystem()
  const { user } = useAuthAdmin()
  const {logo_url} = useConfigurationsSystem()

  const { data, isFetching, mutate } = useQuery({
    queryKey: [unit?.id, "notifications"],
    queryFn: async () => {
      const response = await api({ url: "Notifications/list-notifications", method: "get" })

      return response as Notification[]
    },
    enabled: !!user,
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
      <Modal isNotPossibleClose hideCloseButton open={open} onClose={() => {}} styles={{ maxWidth: "700px", width: "100%" }}>
        <S.Notifications>
          <div>
            <img className="logo" src={logo_url}  />

            {notification.image && <img className="image" src={notification.image} />}

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
                loading={isFetching}
                onClick={async () => {
                  await api({ url: "Notifications/read-notifications", method: "post", body: { notificationIds: [notification.id] } })

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
