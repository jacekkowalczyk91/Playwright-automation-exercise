import { MainMenuComponent } from '../components/main-menu.component';

export class ContactUsPage {
  constructor(page) {
    this.page = page;
    this.mainMenu = new MainMenuComponent(page);
    this.contactUsName = page.locator('[data-qa="name"]');
    this.contactUsEmail = page.locator('[data-qa="email"]');
    this.contactUsSubject = page.locator('[data-qa="subject"]');
    this.contactUsMessage = page.locator('[data-qa="message"]');
    this.contactUsFormSubmitButton = page.locator('[data-qa="submit-button"]');
    this.contactUsFormUpload = page.locator(
      '#contact-us-form > div:nth-child(6) > input'
    );
  }
}
