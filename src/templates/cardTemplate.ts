const html = String.raw;

export const CardTemplate = (imagePath: string): string => html `
  <div class="card__inner">
    <div class="card__face card__face--front"></div>
    <div class="card__face card__face--back">
      <img src="${imagePath}" alt="Icon" class="card__icon">
    </div>
  </div>
`;