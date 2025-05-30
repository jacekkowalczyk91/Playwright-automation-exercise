export class RegisterPage {
  constructor(page) {
    this.page = page;
    this.accountInformationPageText = page.getByText(
      'Enter Account Information'
    );
    this.registerAccountPassword = page.getByRole('textbox', {
      name: 'Password *',
    });
    this.userBirthDay = page.locator('#days');
    this.userBirthMonth = page.locator('#months');
    this.userBirthYear = page.locator('#years');
    this.newsletterSignUpCheckbox = page.getByRole('checkbox', {
      name: 'Sign up for our newsletter!',
    });
    this.specialOfferCheckbox = page.getByRole('checkbox', {
      name: 'Receive special offers from',
    });

    this.userFirstName = page.locator('[data-qa = first_name]');
    this.userLastName = page.locator('[data-qa = last_name]');
    this.userCompany = page.locator('[data-qa = company]');
    this.userAddress = page.locator('[data-qa = address]');
    this.userAdditionalAddress = page.locator('[data-qa = address2]');
    this.userCountry = page.locator('[data-qa = country]');
    this.userState = page.locator('[data-qa = state]');
    this.userCity = page.locator('[data-qa = city]');
    this.userZipCode = page.locator('[data-qa = zipcode]');
    this.userMobileNumber = page.locator('[data-qa = mobile_number]');
    this.createAccountButton = page.locator('[data-qa = create-account]');
    this.accountCreatedText = page.locator('[data-qa = account-created]');
    this.accountContinueButton = page.locator('[data-qa = continue-button]');
    this.deleteAccountButton = page.locator(
      'ul.nav.navbar-nav > li:nth-child(5) > a'
    );
    this.deleteAccountText = page.locator('[data-qa = account-deleted]');
  }
  async selectRadioByTitle(userTitle) {
    const selectTitle = this.page.locator(
      `input[type = 'radio'][value = '${userTitle}']`
    );
    await selectTitle.check();
  }
  async fillRegistrationForm(registerPage, registerData) {
    await registerPage.selectRadioByTitle(registerData.userTitle);
    await registerPage.registerAccountPassword.fill(
      registerData.newUserPassword
    );
    await registerPage.userBirthDay.selectOption(registerData.userBirthDay);
    await registerPage.userBirthMonth.selectOption(registerData.userBirthMonth);
    await registerPage.userBirthYear.selectOption(registerData.userBirthYear);
    await registerPage.newsletterSignUpCheckbox.check();
    await registerPage.specialOfferCheckbox.check();

    await registerPage.userFirstName.fill(registerData.userFirstName);
    await registerPage.userLastName.fill(registerData.userLastName);
    await registerPage.userCompany.fill(registerData.userCompany);
    await registerPage.userAddress.fill(registerData.userAddress);
    await registerPage.userAdditionalAddress.fill(
      registerData.userAdditionalAddress
    );
    await registerPage.userCountry.selectOption(registerData.userCountry);
    await registerPage.userState.fill(registerData.userState);
    await registerPage.userCity.fill(registerData.userCity);
    await registerPage.userZipCode.fill(registerData.userZipCode);
    await registerPage.userMobileNumber.fill(registerData.userMobileNumber);

    await registerPage.createAccountButton.click();
  }
}
