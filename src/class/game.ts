import type { GameConfig } from '../types/types.ts';
import { HeaderTemplate } from '../templates/headerTemplate.ts';
import { CardTemplate } from '../templates/cardTemplate.ts';
import { gameOverScoreTemplate, gameOverWinnerTemplate } from '../templates/gameOverTemplate.ts';
import confetti from 'canvas-confetti';
import { THEMES } from '../data/themes.ts';
import { exitDialogTemplate } from '../templates/exitDialogTemplate.ts';

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

  /**
   * Sets the CSS variable `--grid-cols` based on the card count.
   * @private
   */
  private updateGridSize(): void {
    const gridMapping: Record<number, number> = {
      16: 4,
      24: 6,
      36: 6,
    };
    const columns = gridMapping[this.config.cardCount] || 4;
    this.gridElement.style.setProperty('--grid-cols', columns.toString());
  }

  /**
   * Renders the header with current scores and active player. Binds the exit button listener.
   * @private
   */
  private renderUI(): void {
    const headerContainer = document.querySelector('#game-header');
    if (headerContainer) {
      headerContainer.innerHTML = HeaderTemplate({
        scoreBlue: this.scoreBlue,
        scoreOrange: this.scoreOrange,
        currentPlayer: this.currentPlayer,
      });

      const exitBtn = headerContainer.querySelector('.game-header__exit-btn');
      exitBtn?.addEventListener('click', () => this.showExitDialog());
    }
  }

  /** Renders the exit confirmation dialog and handles back/exit actions. */
  private showExitDialog(): void {
    const dialog = document.createElement('div');
    dialog.innerHTML = exitDialogTemplate();
    const box = dialog.firstElementChild as HTMLElement;
    document.body.appendChild(box);

    box.querySelector('.exit-dialog__btn--back')?.addEventListener('click', () => box.remove());
    box.querySelector('.exit-dialog__btn--exit')?.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('game:exit'));
      box.remove();
    });
  }

  /**
   * Returns a shuffled array of symbol paths for the current game.
   * Picks `cardCount / 2` symbols from the configured theme, duplicates and shuffles them.
   * @private
   */
  private getGameSymbols(): string[] {
    const symbols = [...(THEMES[this.config.theme] || THEMES['codeVibes'])];
    this.shuffle(symbols);
    const selected = symbols.slice(0, this.config.cardCount / 2);
    const gameSet = [...selected, ...selected];
    this.shuffle(gameSet);
    return gameSet;
  }

  /**
   * Creates a card `<button>` element with the given image path.
   * @param imagePath - Path to the card symbol SVG
   */
  private createCard(imagePath: string): HTMLElement {
    const card = document.createElement('button');
    card.classList.add('card');
    card.dataset.symbol = imagePath;
    card.innerHTML = CardTemplate(imagePath);
    return card;
  }

  /** Generates the full game board and renders the header. Uses a DocumentFragment for performant DOM insertion. */
  private generateBoard(): void {
    const fragment = document.createDocumentFragment();
    this.getGameSymbols().forEach((path) => fragment.appendChild(this.createCard(path)));
    this.gridElement.innerHTML = '';
    this.gridElement.appendChild(fragment);
    this.renderUI();
  }

  /**
   * Fisher-Yates in-place shuffle.
   * @param array - The array to shuffle (mutated in place)
   */
  private shuffle<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /** Registers the delegated click listener on the grid. Ignores already flipped or matched cards. */
  private addEventListeners(): void {
    this.gridElement.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const card = target.closest('.card') as HTMLElement;

      if (card && !this.isLocked && !card.classList.contains('is-flipped') && !card.classList.contains('is-matched')) {
        this.handleCardClick(card);
      }
    });
  }

  /**
   * Processes a card flip. Adds it to `flippedCards` and triggers `checkMatch` when two cards are flipped.
   * @param card - The clicked card element
   */
  private handleCardClick(card: HTMLElement): void {
    card.classList.add('is-flipped');
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.isLocked = true;
      this.checkMatch();
    }
  }

  /** Checks whether the two flipped cards share the same symbol. */
  private checkMatch(): void {
    const [card1, card2] = this.flippedCards;
    const isMatch = card1.dataset.symbol === card2.dataset.symbol;

    if (isMatch) {
      this.handleMatch(card1, card2);
    } else {
      this.handleMismatch(card1, card2);
    }
  }

  /** Increments the current player's score by 1. */
  private incrementScore(): void {
    if (this.currentPlayer === 'blue') this.scoreBlue++;
    else this.scoreOrange++;
  }

  /** Checks if all pairs are found and triggers `showWinner` if so. */
  private checkGameOver(): void {
    if (this.matchedPairs === this.totalPairs) setTimeout(() => this.showWinner(), 500);
  }

  /**
   * Handles a successful card match. Marks cards as matched, increments score and checks for game over.
   * @param card1 - First matched card
   * @param card2 - Second matched card
   */
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

  /**
   * Handles a non-matching card pair. Flips cards back after 1s and switches the active player.
   * @param card1 - First card
   * @param card2 - Second card
   */
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

  /**
   * Determines the winner based on scores.
   * @returns `'blue'` | `'orange'` | `null` on draw
   */
  private getWinner(): 'blue' | 'orange' | null {
    if (this.scoreBlue > this.scoreOrange) return 'blue';
    if (this.scoreOrange > this.scoreBlue) return 'orange';
    return null;
  }

  /** Resolves the winner and delegates to `showGameOverScreen`. */
  private showWinner(): void {
    this.showGameOverScreen(this.getWinner());
  }

  /**
   * Creates and appends the game-over overlay element to the DOM.
   * @returns The created overlay element
   */
  private createOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.classList.add('game-over');
    document.body.appendChild(overlay);
    return overlay;
  }

  /**
   * Triggers the CSS transition to reveal a panel via the `is-visible` class.
   * Uses double `requestAnimationFrame` to ensure layout is already painted.
   * @param panel - The panel element to reveal
   */
  private slideIn(panel: HTMLElement): void {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => panel.classList.add('is-visible'));
    });
  }

  /**
   * Fires confetti in the winner's color.
   * Reads the player color from CSS custom property `--color-{winner}-player`.
   * @param winner - The winning player
   */
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

  /**
   * Renders and displays the winner panel inside a new overlay. Fires confetti on a non-draw result.
   * @param winner - Winner or `null` on draw
   */
  private showWinnerPanel(winner: 'blue' | 'orange' | null): void {
    const overlay = this.createOverlay();
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

  /**
   * Shows the score screen, then transitions to the winner screen after 5s.
   * @param winner - Winner or `null` on draw
   */
  private showGameOverScreen(winner: 'blue' | 'orange' | null): void {
    const overlay = this.createOverlay();
    overlay.innerHTML = gameOverScoreTemplate({
      scoreBlue: this.scoreBlue,
      scoreOrange: this.scoreOrange,
      winner,
    });
    const scorePanel = overlay.querySelector('.game-over__panel') as HTMLElement;
    this.slideIn(scorePanel);
    setTimeout(() => this.showWinnerPanel(winner), 5000);
  }
}
