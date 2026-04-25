import type { GameConfig } from '../types/types.ts';
import { HeaderTemplate } from '../templates/headerTemplate.ts';
import { CardTemplate } from '../templates/cardTemplate.ts';
import { gameOverScoreTemplate, gameOverWinnerTemplate } from '../templates/gameOverTemplate.ts';
import confetti from 'canvas-confetti';
import { THEMES } from '../data/themes.ts';

export class MemoryGame {
  private config: GameConfig;
  private gridElement: HTMLElement;

  private flippedCards: HTMLElement[] = [];
  private isLocked: boolean = false;

  private scoreBlue: number = 0;
  private scoreOrange: number = 0;
  private currentPlayer: 'blue' | 'orange' = 'blue';
  private matchedPairs: number = 0;
  private totalPairs: number = 0;

  constructor(config: GameConfig) {
    this.config = config;
    this.totalPairs = config.cardCount / 2;
    this.currentPlayer = config.startingPlayer;
    const selector = config.gridSelector ?? '#field';
    const element = document.querySelector(selector);
    if (!element) throw new Error(`Element ${selector} nicht gefunden`);

    this.gridElement = element as HTMLElement;
    this.init();
  }

  private init(): void {
    this.updateGridSize();
    this.generateBoard();
    this.addEventListeners();
  }

  private updateGridSize(): void {
    const gridMapping: Record<number, number> = {
      16: 4,
      24: 6,
      36: 6,
    };
    const columns = gridMapping[this.config.cardCount] || 4;
    this.gridElement.style.setProperty('--grid-cols', columns.toString());
  }

  private renderUI(): void {
    const headerContainer = document.querySelector('#game-header');
    if (headerContainer) {
      headerContainer.innerHTML = HeaderTemplate({
        scoreBlue: this.scoreBlue,
        scoreOrange: this.scoreOrange,
        currentPlayer: this.currentPlayer,
      });

      const exitBtn = headerContainer.querySelector('.game-header__exit-btn');
      exitBtn?.addEventListener('click', () => location.reload());
    }
  }

  private getGameSymbols(): string[] {
    const symbols = [...(THEMES[this.config.theme] || THEMES['codeVibes'])];
    this.shuffle(symbols);
    const selected = symbols.slice(0, this.config.cardCount / 2);
    const gameSet = [...selected, ...selected];
    this.shuffle(gameSet);
    return gameSet;
  }

  private createCard(imagePath: string): HTMLElement {
    const card = document.createElement('button');
    card.classList.add('card');
    card.dataset.symbol = imagePath;
    card.innerHTML = CardTemplate(imagePath);
    return card;
  }

  private generateBoard(): void {
    const fragment = document.createDocumentFragment();
    this.getGameSymbols().forEach((path) => fragment.appendChild(this.createCard(path)));
    this.gridElement.innerHTML = '';
    this.gridElement.appendChild(fragment);
    this.renderUI();
  }

  private shuffle<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private addEventListeners(): void {
    this.gridElement.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const card = target.closest('.card') as HTMLElement;

      if (card && !this.isLocked && !card.classList.contains('is-flipped') && !card.classList.contains('is-matched')) {
        this.handleCardClick(card);
      }
    });
  }

  private handleCardClick(card: HTMLElement): void {
    card.classList.add('is-flipped');
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.isLocked = true;
      this.checkMatch();
    }
  }

  private checkMatch(): void {
    const [card1, card2] = this.flippedCards;
    const isMatch = card1.dataset.symbol === card2.dataset.symbol;

    if (isMatch) {
      this.handleMatch(card1, card2);
    } else {
      this.handleMismatch(card1, card2);
    }
  }

  private incrementScore(): void {
    if (this.currentPlayer === 'blue') this.scoreBlue++;
    else this.scoreOrange++;
  }

  private checkGameOver(): void {
    if (this.matchedPairs === this.totalPairs) setTimeout(() => this.showWinner(), 500);
  }

  private handleMatch(card1: HTMLElement, card2: HTMLElement): void {
    card1.classList.add('is-matched');
    card2.classList.add('is-matched');
    this.incrementScore();
    this.matchedPairs++;
    this.flippedCards = [];
    this.isLocked = false;
    this.renderUI();
    this.checkGameOver();
  }

  private handleMismatch(card1: HTMLElement, card2: HTMLElement): void {
    setTimeout(() => {
      card1.classList.remove('is-flipped');
      card2.classList.remove('is-flipped');
      this.flippedCards = [];

      this.currentPlayer = this.currentPlayer === 'blue' ? 'orange' : 'blue';

      this.isLocked = false;
      this.renderUI();
    }, 1000);
  }

  private getWinner(): 'blue' | 'orange' | null {
    if (this.scoreBlue > this.scoreOrange) return 'blue';
    if (this.scoreOrange > this.scoreBlue) return 'orange';
    return null;
  }

  private showWinner(): void {
    this.showGameOverScreen(this.getWinner());
  }

  private createOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.classList.add('game-over');
    document.body.appendChild(overlay);
    return overlay;
  }

  private slideIn(panel: HTMLElement): void {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => panel.classList.add('is-visible'));
    });
  }

  private fireConfetti(winner: 'blue' | 'orange'): void {
    const prop = `--color-${winner}-player`;
    const color = getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.4 },
      colors: [color, '#ffffff', '#f0ea6e'],
    });
  }

  private showWinnerPanel(overlay: HTMLElement, winner: 'blue' | 'orange' | null): void {
    overlay.innerHTML = gameOverWinnerTemplate({
      scoreBlue: this.scoreBlue,
      scoreOrange: this.scoreOrange,
      winner,
    });
    const winnerPanel = overlay.querySelector('.game-over__panel') as HTMLElement;
    this.slideIn(winnerPanel);
    if (winner) setTimeout(() => this.fireConfetti(winner), 500);
    winnerPanel.querySelector('.game-over__restart-btn')?.addEventListener('click', () => location.reload());
  }

  private showGameOverScreen(winner: 'blue' | 'orange' | null): void {
    const overlay = this.createOverlay();
    overlay.innerHTML = gameOverScoreTemplate({
      scoreBlue: this.scoreBlue,
      scoreOrange: this.scoreOrange,
      winner,
    });
    const scorePanel = overlay.querySelector('.game-over__panel') as HTMLElement;
    this.slideIn(scorePanel);
    setTimeout(() => {
      scorePanel.classList.remove('is-visible');
      setTimeout(() => this.showWinnerPanel(overlay, winner), 500);
    }, 5000);
  }
}
