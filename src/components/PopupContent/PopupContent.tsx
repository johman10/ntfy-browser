import NotificationCard from "../NotificationCard";
import React from "react";
import { Stack } from "@mui/material";
import { NtfyNotification } from "../../types/ntfy";

export default function PopupContent({
  notifications,
}: {
  notifications: NtfyNotification[];
}) {
  return (
    <Stack spacing={2}>
      {notifications.map((ntfyNotification) => (
        <NotificationCard
          key={ntfyNotification.id}
          notification={ntfyNotification}
        />
      ))}
    </Stack>
  );
}
