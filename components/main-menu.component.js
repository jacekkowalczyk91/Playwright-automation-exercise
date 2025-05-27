export class MainMenuComponent {
  constructor(page) {
    this.page = page;
    this.signUpNavbarButton = page.getByRole('link', {
      name: ' Signup / Login',
    });
    this.homePageButton = page.locator(
      'ul.nav.navbar-nav > li:first-child > a'
    );
    this.contactUsButton = page.locator(
      'ul.nav.navbar-nav > li:nth-child(8) > a'
    );
    this.testCasesButton = page.locator(
      'ul.nav.navbar-nav > li:nth-child(5) > a'
    );
    this.productsButton = page.locator(
      'ul.nav.navbar-nav > li:nth-child(2) > a'
    );
  }
}
