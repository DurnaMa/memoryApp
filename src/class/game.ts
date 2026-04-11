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
    let columns: number;
    switch (
      this.config.cardCount
    ) {
      case 16:
        columns = 4;
        break;
      case 24:
        columns = 6;
        break;
      case 36:
        columns = 6;
        break;
      default:
        columns = 4;
    }
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

    const selectedSymbols = themes[this.config.theme].slice(
      0,
      this.config.cardCount / 2,
    );
    const gameSet = [...selectedSymbols, ...selectedSymbols].sort(
      () => Math.random() - 0.5,
    );

    this.gridElement.innerHTML = "";
    gameSet.forEach((imagePath) => {
      const card = document.createElement("button");
      card.classList.add("card");
      card.dataset.symbol = imagePath;
      card.innerHTML = `
        <div class="card__inner">
          <div class="card__face"></div>
          <div class="card__face card__face--back">
            <img src="${imagePath}" alt="Icon" class="card__icon">
          </div>
        </div>
      `;
      this.gridElement.appendChild(card);
    });
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
