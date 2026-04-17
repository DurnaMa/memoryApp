const html = String.raw;

interface HeaderProps {
  scoreBlue: number;
  scoreOrange: number;
  currentPlayer: string;
}

export const HeaderTemplate = (props: HeaderProps): string => html`
  <header class="game-header">
    <div class="game-header__score-group">
      <div class="game-header__score-item game-header__score-item--blue">
        <span class="game-header__icon"></span> Blue ${props.scoreBlue}
      </div>
      <div class="game-header__score-item game-header__score-item--orange">
        <span class="game-header__icon"></span> Orange ${props.scoreOrange}
      </div>
    </div>

    <div class="game-header__current-player">
      Current player:
      <span
        class="game-header__icon game-header__icon--${props.currentPlayer}"
      ></span>
    </div>

    <div class="game-header__actions">
      <button class="game-header__exit-btn" type="button">Exit game</button>
    </div>
  </header>
`;
