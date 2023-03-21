import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";
import Input from "./components/Input";
import type { TopicConfig } from "./types/extension";
import { BROWSER_TOPIC_CONFIGS_STORAGE_KEY } from "./utils/constants";

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
    <div>
      <Input
        label="Hostname"
        value={topicConfig.hostname}
        onChange={(e) =>
          onTopicConfigChange({ ...topicConfig, hostname: e.target.value })
        }
      />
      <Input
        label="Topic name"
        value={topicConfig.name}
        onChange={(e) =>
          onTopicConfigChange({ ...topicConfig, name: e.target.value })
        }
      />
      <Input
        label="Token"
        value={topicConfig.token}
        onChange={(e) =>
          onTopicConfigChange({ ...topicConfig, token: e.target.value })
        }
        hint="Leave empty when authorization is not needed"
      />
      <button onClick={handleRemoveTopicConfig}>-</button>
    </div>
  );
};

const Options = () => {
  const [topicConfigs, setTopicConfigs] = useState<TopicConfig[]>([
    topicConfigFactory(),
  ]);

  useEffect(() => {
    browser.storage.sync
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

  const saveOptions = () => {
    // TODO: Data cleanup (consistent url) and validation

    browser.storage.sync
      .set({
        [BROWSER_TOPIC_CONFIGS_STORAGE_KEY]: topicConfigs,
      })
      .then(() => {
        return browser.runtime.sendMessage({ event: "configSave" });
      })
      .then(() => {
        // TODO: Show success
      })
      .catch(() => {
        // TODO: Show error
      });
  };

  return (
    <>
      <div>
        {topicConfigs.map((topicConfig) => (
          <TopicConfig
            key={topicConfig.id}
            topicConfig={topicConfig}
            onTopicConfigChange={updateTopicConfig}
            onRemoveTopicConfig={removeTopicConfig}
          />
        ))}
        {!topicConfigs.length &&
          "Press the button below to add a topic subscription"}
      </div>
      <button onClick={addTopicConfig}>+</button>
      <button onClick={saveOptions}>Save</button>
    </>
  );
};

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
