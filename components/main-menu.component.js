export class MainMenuComponent {
  constructor(page) {
    this.page = page;
    this.signUpNavbarButton = page.getByRole('link', {
      name: ' Signup / Login',
    });
    this.homePagetButton = page.locator(
      'ul.nav.navbar-nav > li:first-child > a'
    );
    this.contactUsButton = page.locator(
      'ul.nav.navbar-nav > li:nth-child(8) > a'
    );
  }
}
