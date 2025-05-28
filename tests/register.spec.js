import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { loginData } from '../test-data/login-data';

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
    const newUserName = 'newuser';
    const newUserEmail = '5newsuer@gmail.com';
    const newUserPassword = 'newuserpass';
    const userTitle = 'Mr';
    const userBirthDay = '2';
    const userBirthMonth = '4';
    const userBirthYear = '2000';
    const userFirstName = 'userFirstName';
    const userLastName = 'userLastName';
    const userCompany = 'Itest';
    const userAddress = 'Warszawska';
    const userAdditionalAddress = '11b';
    const userCountry = 'United States';
    const userState = 'Manhattan';
    const userCity = 'Los Angeles';
    const userZipCode = '11-111';
    const userMobileNumber = '222111444';

    //Act
    await loginPage.signUpName.fill(newUserName);
    await loginPage.signUpEmail.fill(newUserEmail);
    await loginPage.signUpButton.click();
    await expect(registerPage.accountInformationPageText).toBeVisible();

    await registerPage.selectRadioByTitle(userTitle);
    await registerPage.registerAccountPassword.fill(newUserPassword);
    await registerPage.userBirthDay.selectOption(userBirthDay);
    await registerPage.userBirthMonth.selectOption(userBirthMonth);
    await registerPage.userBirthYear.selectOption(userBirthYear);
    await registerPage.newsletterSignUpCheckbox.check();
    await registerPage.specialOfferCheckbox.check();

    await registerPage.userFirstName.fill(userFirstName);
    await registerPage.userLastName.fill(userLastName);
    await registerPage.userCompany.fill(userCompany);
    await registerPage.userAddress.fill(userAddress);
    await registerPage.userAdditionalAddress.fill(userAdditionalAddress);
    await registerPage.userCountry.selectOption(userCountry);
    await registerPage.userState.fill(userState);
    await registerPage.userCity.fill(userCity);
    await registerPage.userZipCode.fill(userZipCode);
    await registerPage.userMobileNumber.fill(userMobileNumber);
    await registerPage.createAccountButton.click();

    await expect(registerPage.accountCreatedText).toBeVisible();

    await registerPage.accountContinueButton.click();

    await expect(loginPage.userNameInMenu).toBeVisible({ timeout: 2000 });
    await expect(loginPage.userNameInMenu).toHaveText(
      `Logged in as ${newUserName}`
    );
    await registerPage.deleteAccountButton.click();

    await expect(registerPage.deleteAccountText).toBeVisible();
  });
  test('register with existing email', async ({ page }) => {
    const existingName = loginData.userName;
    const existingEmail = loginData.userEmail;

    await loginPage.signUpName.fill(existingName);
    await loginPage.signUpEmail.fill(existingEmail);
    await loginPage.signUpButton.click();

    await expect(
      page.locator('#form > div > div > div:nth-child(3) > div > form > p')
    ).toHaveText('Email Address already exist!');
  });
});
