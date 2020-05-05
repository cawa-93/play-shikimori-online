export interface Episode {
  readonly id: number;
  readonly animeId: number;
  title: string;
  readonly type: 'ova' | 'tv' | 'ona';
}
