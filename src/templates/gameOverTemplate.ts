const html = String.raw;

interface GameOverProps {
  scoreBlue: number;
  scoreOrange: number;
  winner: "blue" | "orange" | null;
}

/**
 * Returns the score screen HTML shown at the end of the game.
 * Displays both players' final scores.
 * @param props - Final scores and winner
 */
export const gameOverScoreTemplate = (props: GameOverProps): string => html`
  <div class="game-over__panel">
    <h1 class="game-over__title">Game over</h1>
    <p class="game-over__label">Final score</p>
    <div class="game-over__scores">
      <span class="game-over__score game-over__score--blue"
        >Blue ${props.scoreBlue}</span
      >
      <span class="game-over__score game-over__score--orange"
        >Orange ${props.scoreOrange}</span
      >
    </div>
  </div>
`;

/**
 * Returns the winner announcement panel HTML.
 * Shows "DRAW" or the winning player's name and icon.
 * @param props - Final scores and winner
 */
export const gameOverWinnerTemplate = (props: GameOverProps): string => {
    const isDraw = props.winner === null;

    const winnerContent = isDraw
        ? `<p class="game-over__winner-name">UNENTSCHIEDEN</p>`
        : `
      <p class="game-over__winner-name game-over__winner-name--${props.winner}">
        ${props.winner!.toUpperCase()} PLAYER
      </p>
      <img
        class="game-over__winner-icon"
        src="/winner/${props.winner}Player.svg"
        alt="${props.winner} player"
      />
    `;

    return html`
    <div class="game-over__panel">
      <img class="game-over__confetti" src="/winner/Confetti.svg" alt="confetti" />
      <p class="game-over__winner-label">${isDraw ? 'Draw!' : 'The winner is'}</p>
      ${winnerContent}
      <button class="game-over__restart-btn">Back to start</button>
    </div>
  `;
};
