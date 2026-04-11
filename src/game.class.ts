// game.ts
export class MemoryGame {
  private gridElement: HTMLElement;
  private cardCount: number;
  private flippedCards: HTMLElement[] = [];
  private isLocked: boolean = false;

  constructor(gridSelector: string, cardCount: number) {
    const el = document.querySelector(gridSelector);
    if (!el) throw new Error(`Element ${gridSelector} nicht gefunden`);

    this.gridElement = el as HTMLElement;
    this.cardCount = cardCount;

    this.init();
  }

  private init(): void {
    this.updateGridSize();
    this.generateBoard();
    this.addEventListeners();
  }

  private updateGridSize(): void {
    let columns: number;
    switch (this.cardCount) {
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
    const codeVibesTheme = [
      "/public/svg/Angular.svg",
      "/public/svg/atomic.svg",
      "/public/svg/Bootstrap.svg",
      "public/svg/CSS.svg",
      "public/svg/daLogo.svg",
      "public/svg/django.svg",
      "public/svg/Firebase.svg",
      "public/svg/github.svg",
      "public/svg/git.svg",
      "public/svg/HTML.svg",
      "public/svg/js.svg",
      "public/svg/NodeJs.svg",
      "public/svg/NodeJs.svg",
      "public/svg/Sass.svg",
      "public/svg/sql.svg",
      "public/svg/Terminal.svg",
      "public/svg/ts.svg",
      "public/svg/vite.svg",
      "public/svg/VSCode.svg",
    ];
    const selectedSymbols = codeVibesTheme.slice(0, this.cardCount / 2);
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
    this.isLocked = true; // Klicks sperren
    const [card1, card2] = this.flippedCards;

    if (card1.dataset.symbol === card2.dataset.symbol) {
      // Treffer!
      this.flippedCards = [];
      this.isLocked = false;
    } else {
      // Kein Treffer: nach 1 Sekunde wieder umdrehen
      setTimeout(() => {
        card1.classList.remove("is-flipped");
        card2.classList.remove("is-flipped");
        this.flippedCards = [];
        this.isLocked = false;
      }, 1000);
    }
  }
}