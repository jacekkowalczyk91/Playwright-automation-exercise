import { MainMenuComponent } from '../components/main-menu.component';

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.mainMenu = new MainMenuComponent(page);
    this.loginInput = page.locator('input[data-qa = login-email]');
    this.passwordInput = page.locator('[data-qa = login-password]');
    this.loginButton = page.locator('[data-qa = login-button]');

    this.signUpFormText = page.locator('.signup-form');
    this.signUpName = page.locator('[data-qa = signup-name]');
    this.signUpEmail = page.locator('[data-qa = signup-email]');
    this.signUpButton = page.locator('[data-qa = signup-button]');

    this.cookiesBanner = page.locator('[aria-label = Consent]');

    this.userNameInMenu = page.locator('ul.nav.navbar-nav > li:last-child > a');

    this.logoutButton = page.locator(
      'ul.nav.navbar-nav > li:nth-child(4) > a'
    );
  }
}
