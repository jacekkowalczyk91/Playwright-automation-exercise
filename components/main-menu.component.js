export class MainMenuComponent {
  constructor(page) {
    this.page = page;
    this.signUpNavbarButton = page.getByRole('link', {
      name: ' Signup / Login',
    });
  }
}
