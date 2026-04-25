const html = String.raw;

export const exitDialogTemplate = (): string => html`
  <div class="exit-dialog">
    <div class="exit-dialog__box">
      <p class="exit-dialog__text">Are you sure you want to quit the game?</p>
      <div class="exit-dialog__actions">
        <button class="exit-dialog__btn exit-dialog__btn--back">Back to game</button>
        <button class="exit-dialog__btn exit-dialog__btn--exit">Exit game</button>
      </div>
    </div>
  </div>
`;
