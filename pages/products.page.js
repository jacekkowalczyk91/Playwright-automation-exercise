import { MainMenuComponent } from '../components/main-menu.component';

export class ProductsPage {
  constructor(page) {
    this.page = page;
    this.mainMenu = new MainMenuComponent(page);

    this.productListView = page.locator('.features_items');
    this.productDetailView = page.locator(
      'ul.nav.nav-pills.nav-justified > li > a'
    );
    this.productTitle = page.locator('div.product-information > h2');
    this.productCategory = page.locator('text=/^Category:\\s*\\S+/');
    this.productPrice = page.locator('div.product-information > span');
    this.productAvailability = page.locator('text=/^Availability:\\s*\\S+/');
    this.productCondition = page.locator('text=/^Condition:\\s*\\S+/');
    this.productBrand = page.locator('text=/^Brand:\\s*\\S+/');
  }
}
