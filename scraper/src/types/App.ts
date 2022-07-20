export type AppIdentifier = string;

interface AppMetadata {
  name: string;
  appId: string;
  description: string;
}

export interface App {
  id: AppIdentifier;
  metadata?: AppMetadata;
}
