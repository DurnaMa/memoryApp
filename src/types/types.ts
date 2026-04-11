export type Theme = "codeVibes";
export type CardCount = 16 | 24 | 36;

export interface GameConfig {
  cardCount: CardCount;
  theme: Theme;
  gridSelector?: string;
}
