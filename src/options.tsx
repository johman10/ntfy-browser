import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Snackbar,
  TextField,
  ThemeProvider,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { i18n, storage, runtime } from "webextension-polyfill";
import type { TopicConfig } from "./types/extension";
import { BROWSER_TOPIC_CONFIGS_STORAGE_KEY } from "./utils/constants";
import theme from "./utils/theme";
import ErrorBoundary from "./components/ErrorBoundary";
import AppBar from "./components/AppBar";

const topicConfigFactory = (): TopicConfig => {
  return {
    id: crypto.randomUUID(),
    name: "",
    hostname: "https://ntfy.sh",
  };
};

const TopicConfig = ({
  topicConfig,
  onTopicConfigChange,
  onRemoveTopicConfig,
}: {
  topicConfig: TopicConfig;
  onTopicConfigChange: (updatedTopicConfig: TopicConfig) => void;
  onRemoveTopicConfig: (topicConfigId: string) => void;
}) => {
  const handleRemoveTopicConfig = () => {
    onRemoveTopicConfig(topicConfig.id);
  };

  return (
    <Grid2 xs={12}>
      <Card>
        <CardContent>
          <TextField
            fullWidth
            margin="normal"
            label={i18n.getMessage("optionsTopicLabel")}
            value={topicConfig.name}
            onChange={(e) =>
              onTopicConfigChange({ ...topicConfig, name: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label={i18n.getMessage("optionsHostnameLabel")}
            value={topicConfig.hostname}
            onChange={(e) =>
              onTopicConfigChange({ ...topicConfig, hostname: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label={i18n.getMessage("optionsTokenLabel")}
            value={topicConfig.token}
            onChange={(e) =>
              onTopicConfigChange({ ...topicConfig, token: e.target.value })
            }
            helperText={i18n.getMessage("optionsTokenHint")}
          />
        </CardContent>
        <CardActions sx={{ justifyContent: "right" }}>
          <Button onClick={handleRemoveTopicConfig} color="warning">
            {i18n.getMessage("optionsRemoveTopic")}
          </Button>
        </CardActions>
      </Card>
    </Grid2>
  );
};

const Options = () => {
  const [topicConfigs, setTopicConfigs] = useState<TopicConfig[]>([
    topicConfigFactory(),
  ]);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  useEffect(() => {
    storage.sync
      .get({
        [BROWSER_TOPIC_CONFIGS_STORAGE_KEY]: [topicConfigFactory()],
      })
      .then((items) => {
        setTopicConfigs(items.topicConfigs);
      });
  }, []);

  const addTopicConfig = () => {
    setTopicConfigs((currentTopicConfigs) => [
      ...currentTopicConfigs,
      topicConfigFactory(),
    ]);
  };

  const removeTopicConfig = (topicConfigId: string) => {
    setTopicConfigs((currentTopicConfigs) =>
      currentTopicConfigs.filter(
        (topicConfig) => topicConfig.id !== topicConfigId
      )
    );
  };

  const updateTopicConfig = (updatedTopicConfig: TopicConfig) => {
    setTopicConfigs((currentTopicConfigs) =>
      currentTopicConfigs.map((topicConfig) => {
        if (updatedTopicConfig.id === topicConfig.id) {
          return updatedTopicConfig;
        }
        return topicConfig;
      })
    );
  };

  const saveOptions: React.FormEventHandler<HTMLFormElement> = (event) => {
    // TODO: Data cleanup (consistent url) and validation
    event.preventDefault();

    storage.sync
      .set({
        [BROWSER_TOPIC_CONFIGS_STORAGE_KEY]: topicConfigs,
      })
      .then(() => {
        return runtime.sendMessage({ event: "configSave" });
      })
      .then(() => {
        console.log("reached");
        setSnackbarMessage(i18n.getMessage("optionsSnackbarSaveSuccess"));
      })
      .catch(() => {
        setSnackbarMessage(i18n.getMessage("optionsSnackbarSaveFailure"));
      });
  };

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <AppBar title={i18n.getMessage("optionsTitle")} />
        <Container>
          <Grid2 component="form" container spacing={2} onSubmit={saveOptions}>
            {topicConfigs.map((topicConfig) => (
              <TopicConfig
                key={topicConfig.id}
                topicConfig={topicConfig}
                onTopicConfigChange={updateTopicConfig}
                onRemoveTopicConfig={removeTopicConfig}
              />
            ))}
            {!topicConfigs.length && (
              <Grid2>{i18n.getMessage("optionsEmpty")}</Grid2>
            )}
            <Grid2 container xs={12} spacing={2} justifyContent="right">
              <Grid2>
                <Button variant="contained" onClick={addTopicConfig}>
                  {i18n.getMessage("optionsAddTopic")}
                </Button>
              </Grid2>
              <Grid2>
                <Button variant="contained" type="submit">
                  {i18n.getMessage("optionsSave")}
                </Button>
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
