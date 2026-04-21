const html = String.raw;

export const settingTemplate = html`
  <main class="settings">
    <div class="settings__left">
      <h2 class="settings__title">
        Settings
        <img
          class="settings__line"
          src="/svg/settings/lineLeft.svg"
          alt="lineLeft"
        />
      </h2>
      <form class="settings__form" id="setting-from">
        <fieldset class="settings__fieldset">
          <legend>
            <img class="" src="/svg/settings/palette.svg" alt="palette" />
            Theme
          </legend>
          <label>
            <input type="radio" name="theme" value="codeVibes" checked />
            Code Vibes theme
          </label>
          <label>
            <input type="radio" name="theme" value="gaming" />
            Geming theme
          </label>
          <label>
            <input type="radio" name="theme" value="daProjects" />
            DA Projects Theme
          </label>
          <label>
            <input type="radio" name="theme" value="foods" />
            Foods theme
          </label>
        </fieldset>
        <fieldset class="settings__fieldset">
          <legend>
            <img class="" src="/svg/settings/chess_pawn.svg" alt="chess_pawn" />
            Choose player
          </legend>
          <label>
            <input type="radio" name="player" value="blue" checked />
            Blue
          </label>
          <label>
            <input type="radio" name="player" value="orange" />
            Orange
          </label>
        </fieldset>
        <fieldset class="settings__fieldset">
          <legend>
            <img class="" src="/svg/settings/style.svg" alt="style" />
            Board size
          </legend>
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
      </form>
    </div>
    <div class="settings__right">
      <div class="settings__preview">
        <div class="settings__preview-card--front"></div>
        <div class="settings__preview-card--back">
          <img src="/svg/codeVibes/git.svg" alt="preview card 2" />
        </div>
      </div>
      <div class="settings__footer">
        <span>Game theme</span>
        <img src="/svg/settings/verticalLine.svg" alt="verticalLine" />
        <span>Player</span>
        <img src="/svg/settings/verticalLine.svg" alt="verticalLine" />
        <span>Board size</span>
        <button class="settings__submit" type="submit" form="setting-from">
          Start
        </button>
      </div>
    </div>
  </main>
`;
