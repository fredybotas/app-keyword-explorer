export type AppIdentifier = string;

interface AppMetadata {
  name: string;
  appId: string;
  description: string;
  releaseDate: Date;
  ratingsCount: number;
  averageRating: number;
}

export interface App {
  id: AppIdentifier;
  metadata?: AppMetadata;
}
