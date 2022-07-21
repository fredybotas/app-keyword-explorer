export interface Review {
  title: string;
  content: string;
  rating: number;
}

export enum ReviewSortCriteria {
  RECENT = 'recent',
  HELPFUL = 'helpful',
}
