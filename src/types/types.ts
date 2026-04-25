export type Theme = "codeVibes" | "gaming" | "daProjects" | "foods";
export type CardCount = 16 | 24 | 36;
export type Player = "blue" | "orange"


export interface GameConfig {
  cardCount: CardCount;
  theme: Theme;
  startingPlayer: Player;
  gridSelector?: string;
}

export interface GameOverProps {
  scoreBlue: number;
  scoreOrange: number;
  winner: 'blue' | 'orange' | null;
}