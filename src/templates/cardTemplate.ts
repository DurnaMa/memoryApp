const html = String.raw;

/**
 * Returns the inner HTML string for a memory card.
 * @param imagePath - Path to the SVG shown on the card's back face
 * @constructor
 */
export const CardTemplate = (imagePath: string): string => html `
  <div class="card__inner">
    <div class="card__face card__face--front"></div>
    <div class="card__face card__face--back">
      <img src="${imagePath}" alt="Icon" class="card__icon">
    </div>
  </div>
`;