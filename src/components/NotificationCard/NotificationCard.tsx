import React from "react";
import {
  NtfyNotification,
  NtfyNotificationAction,
  NtfyViewAction,
} from "../../types/ntfy";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import emojisMapped from "../../utils/emojis/emojisMapped";
import { i18n } from "webextension-polyfill";

export default function PopupContent({
  notification,
}: {
  notification: NtfyNotification;
}) {
  const getActions = () => {
    if (!notification.click && !notification.actions) return;
    if (!notification.click) return notification.actions;

    return [
      ...(notification.actions || []),
      {
        action: "view",
        label: i18n.getMessage("notificationActionOpenLink"),
        url: notification.click,
      } as NtfyViewAction,
    ];
  };

  const handleActionClick = async (action: NtfyNotificationAction) => {
    if (action.action == "view") {
      window.open(action.url, "__blank");
      return;
    }

    if (action.action == "http") {
      await window.fetch(action.url, {
        method: action.method,
        headers: action.headers,
        body: action.body,
      });
      return;
    }
  };

  const getEmojiTags = (tags: string[] | undefined) => {
    if (!tags) return [];
    return tags
      .filter((tag) => tag in emojisMapped)
      .map((tag) => emojisMapped[tag])
      .join("");
  };

  const getTextTags = (tags: string[] | undefined) => {
    if (!tags) return [];
    return tags.filter((tag) => !(tag in emojisMapped)).join(", ");
  };

  const actions = getActions();
  const textTags = getTextTags(notification.tags);
  const dateTime = new Date(0);
  dateTime.setUTCSeconds(notification.time);
  const formattedDateTime = Intl.DateTimeFormat([...navigator.languages], {
    dateStyle: "short",
    timeStyle: "short",
  }).format(dateTime);

  return (
    <Card>
      {notification.message && (
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary">
            {formattedDateTime}
            {notification.priority && notification.priority !== 3 && (
              <img
                style={{ verticalAlign: "middle" }}
                src={`icons/priority-${notification.priority}.svg`}
              />
            )}
          </Typography>
          {!!notification.title && (
            <Typography variant="h5">
              {getEmojiTags(notification.tags)} {notification.title}
            </Typography>
          )}
          <Typography>
            {!notification.title && getEmojiTags(notification.tags)}{" "}
            {notification.message}
          </Typography>
          {!!textTags.length && (
            <Typography sx={{ fontSize: 14 }} color="text.secondary">
              {i18n.getMessage("notificationTags")} {textTags}
            </Typography>
          )}
        </CardContent>
      )}
      {actions && (
        <CardActions>
          {notification.click && (
            <Button
              onClick={() =>
                navigator.clipboard.writeText(notification.click || "")
              }
            >
              {i18n.getMessage("notificationActionCopyLink")}
            </Button>
          )}
          {actions.map((action) => {
            return (
              <Button
                key={action.label}
                onClick={() => handleActionClick(action)}
              >
                {action.label}
              </Button>
            );
          })}
        </CardActions>
      )}
    </Card>
  );
}
