
export type UtilityType = 'AI' | 'Analytics';

export interface Utility {
  name: string;
  description: string;
  url: string;
  type: UtilityType;
}

export interface DashboardState {
  data: Utility[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
}
