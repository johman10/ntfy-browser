import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Snackbar,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { i18n, storage, runtime } from "webextension-polyfill";
import {
  BrowserStorage,
  EventResponse,
  EventResponseType,
  TopicConfig,
} from "./types/extension";
import { BROWSER_TOPIC_CONFIGS_STORAGE_KEY } from "./utils/constants";
import theme from "./utils/theme";
import ErrorBoundary from "./components/ErrorBoundary";
import AppBar from "./components/AppBar";
import {
  FormState,
  useFieldArray,
  useForm,
  UseFormRegister,
} from "react-hook-form";

const topicConfigFactory = (): TopicConfig => {
  return {
    id: crypto.randomUUID(),
    name: "",
    hostname: "https://ntfy.sh",
  };
};

const TopicConfig = ({
  onRemoveTopicConfig,
  register,
  index,
  errors,
}: {
  onRemoveTopicConfig: () => void;
  register: UseFormRegister<BrowserStorage>;
  index: number;
  errors: FormState<BrowserStorage>["errors"];
}) => {
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
};

const Options = () => {
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    reset,
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<BrowserStorage>({
    defaultValues: {
      [BROWSER_TOPIC_CONFIGS_STORAGE_KEY]: [topicConfigFactory()],
    },
  });
  const {
    fields: topicConfigs,
    append: appendTopicConfig,
    remove: removeTopicConfig,
  } = useFieldArray({
    control,
    name: BROWSER_TOPIC_CONFIGS_STORAGE_KEY,
  });

  useEffect(() => {
    storage.sync
      .get({
        [BROWSER_TOPIC_CONFIGS_STORAGE_KEY]: topicConfigFactory(),
      })
      .then((browserStorage) => {
        reset({
          [BROWSER_TOPIC_CONFIGS_STORAGE_KEY]:
            browserStorage[BROWSER_TOPIC_CONFIGS_STORAGE_KEY],
        });
      });
  }, []);

  const saveOptions: React.FormEventHandler<HTMLFormElement> = handleSubmit(
    (data, event) => {
      event?.preventDefault();

      setLoading(true);
      storage.sync
        .set(data)
        .then(() => runtime.sendMessage({ event: "configSave" }))
        .then((output: EventResponse[]) => {
          const failedResponses = output.filter(
            (eventResponse) =>
              eventResponse.event === EventResponseType.CONNECTION_FAILED
          );
          if (failedResponses.length) {
            let failedTopicNames = failedResponses
              .map((eventResponse) => eventResponse.topicConfig.name)
              .join(", ");
            setSnackbarMessage(
              i18n.getMessage(
                "optionsSnackbarConnectionFailure",
                failedTopicNames
              )
            );
            return;
          }

          setSnackbarMessage(i18n.getMessage("optionsSnackbarSaveSuccess"));
        })
        .catch(() => {
          setSnackbarMessage(i18n.getMessage("optionsSnackbarSaveFailure"));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  );

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <AppBar title={i18n.getMessage("optionsTitle")} />
        <Container>
          <Grid2 component="form" container spacing={2} onSubmit={saveOptions}>
            {topicConfigs.map((topicConfig, index) => (
              <TopicConfig
                key={topicConfig.id}
                index={index}
                register={register}
                errors={errors}
                onRemoveTopicConfig={() => removeTopicConfig(index)}
              />
            ))}
            {!topicConfigs.length && (
              <Grid2
                container
                xs={12}
                sx={{ marginTop: 2 }}
                direction="column"
                alignItems="center"
              >
                <Typography variant="h5" textAlign="center">
                  <img src="./ntfy-outline.svg" height="64" />
                  <br />
                  {i18n.getMessage("optionsEmptyTitle")}
                </Typography>
                <Typography>
                  {i18n.getMessage("optionsEmptyInstructions")}
                </Typography>
              </Grid2>
            )}
            <Grid2 container xs={12} spacing={2} justifyContent="right">
              <Grid2>
                <Button
                  variant="contained"
                  onClick={() => appendTopicConfig(topicConfigFactory())}
                >
                  {i18n.getMessage("optionsAddTopic")}
                </Button>
              </Grid2>
              <Grid2>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  loading={loading}
                >
                  {i18n.getMessage("optionsSave")}
                </LoadingButton>
              </Grid2>
            </Grid2>
          </Grid2>

          <Snackbar
            open={!!snackbarMessage}
            autoHideDuration={3000}
            onClose={() => setSnackbarMessage(null)}
            message={snackbarMessage}
          />
        </Container>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
