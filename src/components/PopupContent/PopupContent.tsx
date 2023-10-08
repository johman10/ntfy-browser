import { useState, useEffect } from "react";
import NtfyNotificationManager from "../../utils/NtfyNotificationManager";
import BadgeNumberManager from "../../utils/BadgeNumberManager";
import NotificationCard from "../NotificationCard";
import React from "react";
import { Stack } from "@mui/material";
import Loader from "../Loader";

export default function PopupContent({
  badgeNumberManager,
}: {
  badgeNumberManager: BadgeNumberManager;
}) {
  const [ntfyNotificationManager, setNtfyNotificationManager] =
    useState<NtfyNotificationManager>();

  useEffect(() => {
    NtfyNotificationManager.init(badgeNumberManager).then((manager) => {
      setNtfyNotificationManager(manager);
    });
  }, []);

  if (!ntfyNotificationManager) return <Loader />;

  return (
    <Stack spacing={2}>
      {ntfyNotificationManager.getAll().map((ntfyNotification) => (
        <NotificationCard
          key={ntfyNotification.id}
          notification={ntfyNotification}
        />
      ))}
    </Stack>
  );
}
