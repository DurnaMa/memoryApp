import "../scss/main.scss";
import { MemoryGame } from "./class/game.ts";
import type { Theme, CardCount } from "./types/types.ts";
import {startScreenTemplate} from "./templates/startScreenTemplate.ts";
import {settingTemplate} from "./templates/settingTemplates.ts";

const html = String.raw;

class App {
  private appEL: HTMLElement;

  constructor() {
    this.appEL = document.querySelector("#app") as HTMLElement;
    this.showHome();
  }

  private showHome() {
    this.appEL.innerHTML = html` <button id="play-btn">Play</button> `;
    this.appEL.innerHTML = startScreenTemplate;
    document.querySelector("#play-btn")?.addEventListener("click", () => {
      this.showSetting();
    });
  }

  private showSetting() {
    this.appEL.innerHTML = settingTemplate;
    document
      .querySelector("#setting-from")
      ?.addEventListener("submit", (event) => {
        event.preventDefault();

        const form = document.querySelector("#setting-from") as HTMLFormElement;
        const data = new FormData(form);

        const theme = data.get("theme") as string;
        const cardCount = Number(data.get("cardCount"));

        this.showGame(theme, cardCount);
      });
  }

  private showGame(theme: string, cardCount: number) {
    this.appEL.innerHTML = html`
      <section>
        <div class="memory-board">
          <div id="game-header"></div>
          <div id="field" class="game-grid"></div>
        </div>
      </section>
    `;
    new MemoryGame({
      theme: theme as Theme,
      cardCount: cardCount as CardCount,
    });
  }
}

new App();
