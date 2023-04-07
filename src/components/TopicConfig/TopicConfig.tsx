import {
  Card,
  CardContent,
  TextField,
  CardActions,
  Button,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import React from "react";
import { UseFormRegister, FormState } from "react-hook-form";
import { i18n } from "webextension-polyfill";
import { BrowserStorage } from "../../types/extension";
import { BROWSER_TOPIC_CONFIGS_STORAGE_KEY } from "../../utils/constants";

export default function TopicConfig({
  onRemoveTopicConfig,
  register,
  index,
  errors,
}: {
  onRemoveTopicConfig: () => void;
  register: UseFormRegister<BrowserStorage>;
  index: number;
  errors: FormState<BrowserStorage>["errors"];
}) {
  const baseFieldKey = `${BROWSER_TOPIC_CONFIGS_STORAGE_KEY}.${index}` as const;
  const topicErrors = errors?.[BROWSER_TOPIC_CONFIGS_STORAGE_KEY]?.[index];

  return (
    <Grid2 xs={12}>
      <Card>
        <CardContent>
          <TextField
            fullWidth
            margin="normal"
            label={i18n.getMessage("optionsTopicLabel")}
            {...register(`${baseFieldKey}.name`, {
              required: i18n.getMessage("optionsFieldRequired"),
              minLength: {
                value: 1,
                message: i18n.getMessage("optionsFieldTooShort", ["1"]),
              },
              maxLength: {
                value: 64,
                message: i18n.getMessage("optionsFieldTooLong", ["64"]),
              },
              pattern: {
                value: /^[-_a-zA-Z0-9]+$/,
                message: i18n.getMessage("optionsFieldInvalidCharacters"),
              },
            })}
            error={!!topicErrors?.name}
            helperText={topicErrors?.name?.message}
          />
          <TextField
            fullWidth
            margin="normal"
            type="url"
            label={i18n.getMessage("optionsHostnameLabel")}
            {...register(`${baseFieldKey}.hostname`, {
              required: i18n.getMessage("optionsFieldRequired"),
              pattern: {
                value: /^https?:\/\/.+/,
                message: i18n.getMessage("optionsFieldInvalidUrl"),
              },
            })}
            error={!!topicErrors?.hostname}
            helperText={topicErrors?.hostname?.message}
          />
          <TextField
            fullWidth
            margin="normal"
            label={i18n.getMessage("optionsTokenLabel")}
            helperText={i18n.getMessage("optionsTokenHint")}
            {...register(`${baseFieldKey}.token`)}
          />
        </CardContent>
        <CardActions sx={{ justifyContent: "right" }}>
          <Button onClick={onRemoveTopicConfig} color="warning">
            {i18n.getMessage("optionsRemoveTopic")}
          </Button>
        </CardActions>
      </Card>
    </Grid2>
  );
}
