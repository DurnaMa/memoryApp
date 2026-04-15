import type { GameConfig } from "../types/types.ts";

export class MemoryGame {
  private config: GameConfig;
  private gridElement: HTMLElement;
  private flippedCards: HTMLElement[] = [];
  private isLocked: boolean = false;

  constructor(config: GameConfig) {
    this.config = config;

    const selector = config.gridSelector ?? "#field";
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
      36: 6
    };

    const columns = gridMapping[this.config.cardCount] || 4;
    this.gridElement.style.setProperty("--grid-cols", columns.toString());
  }

  private generateBoard(): void {
    const themes = {
      codeVibes: [
        "/svg/Angular.svg",
        "/svg/atomic.svg",
        "/svg/Bootstrap.svg",
        "/svg/CSS.svg",
        "/svg/django.svg",
        "/svg/Firebase.svg",
        "/svg/github.svg",
        "/svg/git.svg",
        "/svg/HTML.svg",
        "/svg/js.svg",
        "/svg/NodeJs.svg",
        "/svg/Sass.svg",
        "/svg/sql.svg",
        "/svg/Terminal.svg",
        "/svg/ts.svg",
        "/svg/vite.svg",
        "/svg/VSCode.svg",
      ],
    };

    const count = this.config.cardCount / 2;
    const selectedSymbols = themes[this.config.theme].slice(0, count);
    const gameSet = [...selectedSymbols, ...selectedSymbols];

    this.shuffle(gameSet);

    this.gridElement.innerHTML = "";
    const fragment = document.createDocumentFragment();

    gameSet.forEach((imagePath) => {
      const card = document.createElement("button");
      card.classList.add("card");
      card.dataset.symbol = imagePath;
      card.innerHTML = `
        <div class="card__inner">
          <div class="card__face card__face--front"></div>
            <div class="card__face card__face--back">
            <img src="${imagePath}" alt="Icon" class="card__icon">
          </div>
        </div>
      `;
      fragment.appendChild(card);
    });

    this.gridElement.appendChild(fragment);
  }

  private shuffle(array: any[]): void {
    for (let indexGenerateBoard = array.length - 1; indexGenerateBoard > 0; indexGenerateBoard--) {
      const randomIndex = Math.floor(Math.random() * (indexGenerateBoard + 1));
      [array[indexGenerateBoard], array[randomIndex]] = [array[randomIndex], array[indexGenerateBoard]];
    }
  }

  private addEventListeners(): void {
    this.gridElement.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const card = target.closest(".card") as HTMLElement;
      if (card && !this.isLocked && !card.classList.contains("is-flipped")) {
        this.handleCardClick(card);
      }
    });
  }

  private handleCardClick(card: HTMLElement): void {
    card.classList.add("is-flipped");
    this.flippedCards.push(card);
    if (this.flippedCards.length === 2) {
      this.checkMatch();
    }
  }

  private checkMatch(): void {
    this.isLocked = true;
    const [card1, card2] = this.flippedCards;
    if (card1.dataset.symbol === card2.dataset.symbol) {
      this.flippedCards = [];
      this.isLocked = false;
    } else {
      setTimeout(() => {
        card1.classList.remove("is-flipped");
        card2.classList.remove("is-flipped");
        this.flippedCards = [];
        this.isLocked = false;
      }, 1000);
    }
  }
}
