import { Page, Locator, expect } from "@playwright/test";

export class ProductDisplaypage{

    private readonly page: Page;
    private readonly addToCartButton: Locator;
    private readonly wishlistButton: Locator;
    private readonly compareButton: Locator;


    constructor(page:Page){

        this.page = page;
        this.addToCartButton = page.locator("#button-cart");
        this.wishlistButton = page.locator("button[data-original-title='Add to Wish List']").nth(0);
        this.compareButton = page.locator("button[data-original-title='Compare this Product']").nth(0);

}


async isOnProductPage():Promise<string>{
 return this.page.title();
 
}

async productButtons():Promise<{add:boolean, wish:boolean, compareProduct:boolean}>{

    return {
            add: await this.addToCartButton.isEnabled(),
            wish: await this.wishlistButton.isEnabled(),
            compareProduct: await this.compareButton.isEnabled()
    }

}

}