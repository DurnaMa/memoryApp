import '../scss/main.scss';
import { MemoryGame } from './class/game.ts';
import type { Theme, CardCount, Player } from './types/types.ts';
import { startScreenTemplate } from './templates/startScreenTemplate.ts';
import { settingTemplate } from './templates/settingTemplates.ts';

const html = String.raw;

class App {
  private appEL: HTMLElement;

  constructor() {
    this.appEL = document.querySelector('#app') as HTMLElement;
    this.showHome();
  }

  private showHome() {
    this.appEL.innerHTML = startScreenTemplate;
    document.querySelector('#play-btn')?.addEventListener('click', () => {
      this.showSetting();
    });
  }

  private showSetting() {
    document.documentElement.removeAttribute('data-theme');
    this.appEL.innerHTML = settingTemplate;
    const previewImg = document.querySelector<HTMLImageElement>('.settings__preview-card--back img');
    const PREVIEW_IMAGES: Record<string, string> = {
      codeVibes: '/svg/codeVibes/git.svg',
      gaming: '/svg/gaming/Asset16@2x1.svg',
      daProjects: '/svg/daProjectsTheme/16_Pollapp.svg',
      foods: '/svg/foods/01@3x1.svg',
    };
    this.setupThemePreviewListeners(previewImg, PREVIEW_IMAGES);
    const checkedTheme = document.querySelector<HTMLInputElement>('input[name="theme"]:checked');
    if (checkedTheme) {
      document.documentElement.setAttribute('data-theme', checkedTheme.value);
      if (previewImg) previewImg.src = PREVIEW_IMAGES[checkedTheme.value] ?? '';
    }
    this.showSetingValidateForm();
    this.showSettingDocument();
  }

  /**
   * When you hover over an item, the preview shows the card decks and game board theme.
   * @param previewImg
   * @param PREVIEW_IMAGES
   * @private
   */
  private setupThemePreviewListeners(
      previewImg: HTMLImageElement | null,
      PREVIEW_IMAGES: Record<string, string>
  ) {
    const previewContainer = document.querySelector<HTMLElement>('.settings__preview');
    const themeRadios = document.querySelectorAll<HTMLInputElement>('input[name="theme"]');
    const applyPreview = (theme: string) => {
      previewContainer?.setAttribute('data-theme', theme);
      if (previewImg) previewImg.src = PREVIEW_IMAGES[theme] ?? '';
    };
    const revertToChecked = () => {
      const checked = document.querySelector<HTMLInputElement>('input[name="theme"]:checked');
      if (checked) applyPreview(checked.value);
    };
    themeRadios.forEach((radio) => {
      radio.addEventListener('change', () => applyPreview(radio.value));
      const label = radio.closest('label');
      label?.addEventListener('mouseenter', () => applyPreview(radio.value));
      label?.addEventListener('mouseleave', revertToChecked);
    });
  }

  /**
   * Form validation to ensure all fields are filled out before starting the game.
   * @private
   */
  private showSetingValidateForm() {
    const form = document.querySelector<HTMLFormElement>('#setting-from');
    const submitBtn = document.querySelector<HTMLButtonElement>('.settings__submit');

    if (form && submitBtn) {
      const validateForm = () => {
        const formData = new FormData(form);
        const hasPlayer = formData.has('player');
        const hasCardCount = formData.has('cardCount');
        submitBtn.disabled = !(hasPlayer && hasCardCount);
      };

      form.addEventListener('change', validateForm);
      validateForm();
    }
  }

  private showSettingDocument() {
    document.querySelector('#setting-from')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const data = new FormData(form);

      const theme = data.get('theme') as Theme;
      const cardCount = Number(data.get('cardCount')) as CardCount;
      const player = (data.get('player') ?? 'blue') as Player;

      if (!theme || !cardCount || !player) return;

      this.showGame(theme, cardCount, player);
    });
  }

  private showGame(theme: string, cardCount: number, player: string) {
    document.documentElement.setAttribute('data-theme', theme);
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
      startingPlayer: player as Player,
    });
    document.addEventListener('game:exit', () => this.showSetting(), { once: true });
  }
}

new App();
