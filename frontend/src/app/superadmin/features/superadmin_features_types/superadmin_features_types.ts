export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  isGlobalEnabled: boolean;
  enabledTenantIds: string[];
}

export interface ReleaseNote {
  id: string;
  version: string;
  title: string;
  content: string;
  date: string;
  isPublished: boolean;
}
