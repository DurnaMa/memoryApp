import "../scss/main.scss";
import { MemoryGame } from "./class/game.ts";
import type { Theme, CardCount } from "./types/types.ts";
import {startScreenTemplate} from "./templates/startScreenTemplate.ts";

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
    this.appEL.innerHTML = html`
      <h2>Setting</h2>
      <form id="setting-from">
        <fieldset>
          <fieldset>
            <legend>Theme</legend>
            <label>
              <input type="radio" name="theme" value="codeVibes" checked />
              Code Vibes theme
            </label>
            <label>
              <input type="radio" name="theme" value="daProjects" />
              DA Projects Theme
            </label>
          </fieldset>
          <fieldset>
            <legend>Choose player</legend>
            <label>
              <input type="radio" name="player" value="blue" checked />
              Blue
            </label>
            <label>
              <input type="radio" name="player" value="orange" />
              Orange
            </label>
          </fieldset>
          <fieldset>
            <legend>Board size</legend>
            <label>
              <input type="radio" name="cardCount" value="16" checked />
              16
            </label>
            <label>
              <input type="radio" name="cardCount" value="24" />
              24
            </label>
            <label>
              <input type="radio" name="cardCount" value="36" />
              36
            </label>
          </fieldset>
        </fieldset>

        <button type="submit">Strat Game</button>
      </form>
    `;
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
