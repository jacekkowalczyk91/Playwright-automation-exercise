import { MainMenuComponent } from '../components/main-menu.component';
import { expect } from '@playwright/test';

export class HomePage {
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

    this.subscriptionText = page.locator('.single-widget > h2');
    this.subscriptionInput = page.locator('#susbscribe_email');
    this.subscriptionSubmitButton = page.locator('#subscribe');

    this.categoryWomenButton = page.getByRole('link', { name: /Women/i });
    this.categorWomenyDressButton = page.getByRole('link', { name: /Dress/i });
    this.categoryWomenDressTitle = page.getByRole('heading', {
      name: 'Women - Dress Products',
    });

    this.categoryMenButton = page.locator('a[href="#Men"]:has-text("Men")');
    this.categoryMenJeansButton = page.getByRole('link', { name: /Jeans/i });
    this.categoryMenJeansTitle = page.getByRole('heading', {
      name: 'Men - Jeans Products',
    });
  }
  async verifyingNumberOfProducts(page, productIds) {
    const cartItemsLocator = page.locator('[id^="product-"]');
    const cartItems = await cartItemsLocator.count();
    expect(cartItems).toBe(productIds.length);
  }
}
