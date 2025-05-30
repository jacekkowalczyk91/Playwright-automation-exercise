import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { loginData } from '../test-data/login-data';
import { registerData } from '../test-data/register-data';

test.describe('User registration tests', () => {
  let loginPage;
  let registerPage;
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    loginPage = new LoginPage(page);
    await loginPage.cookiesBanner.waitFor({ state: 'visible', timeout: 2000 });
    await loginPage.cookiesBanner.click();
    await loginPage.mainMenu.signUpNavbarButton.click();
    await expect(loginPage.signUpFormText).toBeVisible();
    registerPage = new RegisterPage(page);
  });

  test('register account', async ({ page }) => {
    //Arrange
    const newUserEmail = '15newsuer@gmail.com';

    //Act
    await loginPage.signUpName.fill(registerData.newUserName);
    await loginPage.signUpEmail.fill(newUserEmail);
    await loginPage.signUpButton.click();
    await expect(registerPage.accountInformationPageText).toBeVisible();

    await registerPage.fillRegistrationForm(registerPage, registerData);

    await expect(registerPage.accountCreatedText).toBeVisible();

    await registerPage.accountContinueButton.click();

    await expect(loginPage.userNameInMenu).toBeVisible({ timeout: 2000 });
    await expect(loginPage.userNameInMenu).toHaveText(
      `Logged in as ${registerData.newUserName}`
    );
    await registerPage.deleteAccountButton.click();

    await expect(registerPage.deleteAccountText).toBeVisible();
  });
  test('register with existing email', async ({ page }) => {
    await loginPage.signUpName.fill(loginData.userName);
    await loginPage.signUpEmail.fill(loginData.userEmail);
    await loginPage.signUpButton.click();

    await expect(
      page.locator('#form > div > div > div:nth-child(3) > div > form > p')
    ).toHaveText('Email Address already exist!');
  });
});
