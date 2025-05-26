import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { loginData } from '../test-data/login-data';

test.describe('User Login page tests', () => {
  let loginPage;
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    loginPage = new LoginPage(page);
    await loginPage.cookiesBanner.waitFor({ state: 'visible', timeout: 2000 });
    await loginPage.cookiesBanner.click();
    await loginPage.mainMenu.signUpNavbarButton.click();
    await expect(loginPage.signUpFormText).toBeVisible();
  });

  test('login with correct credentials', async ({ page }) => {
    //Arrange
    const userId = loginData.userEmail;
    const userPassword = loginData.userPassword;
    //Act
    await loginPage.loginInput.fill(userId);
    await loginPage.passwordInput.fill(userPassword);
    await loginPage.loginButton.click();
    //Assert
    await expect(loginPage.userNameInMenu).toBeVisible({ timeout: 2000 });
    await expect(loginPage.userNameInMenu).toHaveText(
      `Logged in as ${loginData.userName}`
    );
  });
  test('login with incorrect password', async ({ page }) => {
    const userEmail = 'test@test.pl';
    const incorrectUserPassword = 'test';

    await loginPage.loginInput.fill(userEmail);
    await loginPage.passwordInput.fill(incorrectUserPassword);
    await loginPage.loginButton.click();

    await expect(
      page.locator(
        '#form > div > div > div.col-sm-4.col-sm-offset-1 > div > form > p'
      )
    ).toHaveText('Your email or password is incorrect!');
  });
  test('login with incorrect email', async ({ page }) => {
    const userEmail = 'test.pl';
    const incorrectUserPassword = 'test';
    const isValid = await loginPage.loginInput.evaluate(
      (input) => input.validity.valid
    );

    await loginPage.loginInput.fill(userEmail);
    await loginPage.passwordInput.fill(incorrectUserPassword);
    await loginPage.loginButton.click();

    expect(isValid).toBe(false);
  });
  test('user logout', async ({ page }) => {
    //Arrange
    const userId = loginData.userEmail;
    const userPassword = loginData.userPassword;
    //Act
    await loginPage.loginInput.fill(userId);
    await loginPage.passwordInput.fill(userPassword);
    await loginPage.loginButton.click();
    //Assert
    await expect(loginPage.userNameInMenu).toBeVisible({ timeout: 2000 });
    await expect(loginPage.userNameInMenu).toHaveText(
      `Logged in as ${loginData.userName}`
    );

    await loginPage.logoutButton.click();
    await expect(page.locator('.login-form > h2')).toHaveText('Login to your account');
  });
});
