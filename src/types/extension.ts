export interface TopicConfig {
  id: string;
  name: string;
  hostname: string;
  token?: string;
}

export interface EventMessage {
  event: "configSave";
}
