import { Page, Locator, expect } from "@playwright/test";

export class ProductDisplaypage{

    private readonly page: Page;
    private readonly addToCartButton: Locator;
    private readonly wishlistButton: Locator;
    private readonly compareButton: Locator;
    private readonly pageHeader: Locator;


    constructor(page:Page){

        this.page = page;
        this.addToCartButton = page.locator("#button-cart");
        this.pageHeader = page.locator("h1")
        this.wishlistButton = page.locator("button[data-original-title='Add to Wish List']").nth(0);
        this.compareButton = page.locator("button[data-original-title='Compare this Product']").nth(0);

}


async isOnProductPage():Promise<string>{

 return await this.pageHeader.innerText() ?? ''
 
}

async addProductButtons():Promise<boolean>{

    const addButtons =  await this.addToCartButton.all();

    for(const addButton of addButtons){
        if(!addButton.isEnabled()) return false;
    }
return true
    }


async wishListButtons():Promise<boolean>{

    const wishlistButtons =  await this.wishlistButton.all();

    for(const wishList of wishlistButtons){
        if(!wishList.isEnabled()) return false;
    }
return true
}

async compareButtons():Promise<boolean>{

    const compareButton =  await this.compareButton.all();

    for(const copareButton of compareButton){
        if(!copareButton.isEnabled()) return false;
    }
return true
}

}