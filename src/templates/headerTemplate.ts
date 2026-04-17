const html = String.raw;
interface HeaderProps {
    scoreBlue: number;
    scoreOrange: number;
    currentPlayer: string;
}

export const HeaderTemplate = (props: HeaderProps): string => html `
<div class="game-header">
  <div class="scores">
    <span class="blue">Blue ${props.scoreBlue}</span>
    <span class="orange">Orange ${props.scoreOrange}</span>
  </div>
  <div class="current-player">
    Current player: <span class="player-icon">${props.currentPlayer}</span>
  </div>
  <div class="actions">
    <button class="exit-btn">Exit game</button>
  </div>
</div>
`;