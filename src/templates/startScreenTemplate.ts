const html = String.raw;

export const startScreenTemplate = html`
  <main class="home">
    <div class="home__content">
      <h2 class="home__subtitle">It's play time</h2>
      <h1 class="home__title">Ready to play?</h1>

      <img
        class="home__controller"
        src="/svg/startScreen/stadia_controller.svg"
        alt="Controller"
      />

      <button class="home__btn" id="play-btn">
        <img
          class="home__controllerSmall"
          src="/svg/startScreen/stadiaControllerSmall.svg"
          alt="Controller"
        />
        Play
        <img
          class="home__controllerSmall"
          src="/svg/startScreen/arrow.svg"
          alt="Controller"
        />
      </button>
    </div>
  </main>
`;
