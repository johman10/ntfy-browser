import {
  Button,
  Container,
  Snackbar,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { i18n, storage } from "webextension-polyfill";
import { BrowserStorage, Topic } from "./types/extension";
import { BROWSER_TOPIC_CONFIGS_STORAGE_KEY } from "./utils/constants";
import theme from "./utils/theme";
import ErrorBoundary from "./components/ErrorBoundary";
import AppBar from "./components/AppBar";
import { useFieldArray, useForm } from "react-hook-form";
import TopicConfig from "./components/TopicConfig";
import OptionsMessageHandler from "./utils/messages/OptionsMessageHandler";

const optionsMessageHandler = new OptionsMessageHandler();

const topicConfigFactory = (): Topic => {
  return {
    id: crypto.randomUUID(),
    name: "",
    hostname: "https://ntfy.sh",
  };
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
        .then(() => optionsMessageHandler.reconnectTopics())
        .then((failedResponses) => {
          if (failedResponses.length) {
            const failedTopicNames = failedResponses
              .map((eventResponse) => eventResponse.topic.name)
              .join(", ");
            setSnackbarMessage(
              i18n.getMessage(
                "optionsSnackbarConnectionFailure",
                failedTopicNames,
              ),
            );
            return;
          }

          setSnackbarMessage(i18n.getMessage("optionsSnackbarSaveSuccess"));
        })
        .catch((e) => {
          console.error(e);
          setSnackbarMessage(i18n.getMessage("optionsSnackbarSaveFailure"));
        })
        .finally(() => {
          setLoading(false);
        });
    },
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

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
);
