export type AppIdentifier = string;
export interface App {
  id: AppIdentifier;
  metadata?: AppMetadata;
}

interface AppMetadata {
  name: string;
  appId: string;
  description: string;
}
