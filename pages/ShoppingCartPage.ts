import { Locator, expect, Page } from "@playwright/test";

export class ShoppinCartPage{

 private readonly page: Page;
 private readonly breadcrumb: Locator;
 private readonly products: Locator;


 constructor(page : Page){

    this.page = page;
    this.breadcrumb = page.locator(".breadcrumb a:has-text('Shopping Cart')")
    this.products = page.locator(".table-responsive>.table.table-bordered>tbody>tr")



}

async isOnShoppingCartPage():Promise<string>{

    return await this.breadcrumb.innerText() ?? '';

}

async numberOfProducts():Promise<number>{

  return  await this.products.count();
}

}