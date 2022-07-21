export interface Review {
  title: string;
  content: string;
  rating: number;
}

export const enum ReviewSortCriteria {
  RECENT = 'recent',
  HELPFUL = 'helpful',
}
