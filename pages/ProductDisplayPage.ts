import { Page, Locator, expect } from "@playwright/test";
import { ProductComparisonPage } from "./ProductComparisonPage";

export class ProductDisplaypage {

    private readonly page: Page;
    private readonly addToCartButton: Locator;
    private readonly wishlistButton: Locator;
    private readonly compareButton: Locator;
    private readonly pageHeader: Locator;
    private readonly tooltip: Locator;
    private readonly relatedProducts: Locator;
    private readonly productComparisonLink: Locator;



    constructor(page: Page) {

        this.page = page;
        this.addToCartButton = page.locator("#button-cart");
        this.pageHeader = page.locator("h1")
        //locator bellow will return 2 buttons
        this.wishlistButton = page.locator("button[data-original-title='Add to Wish List']")//.nth(0);
        //locator bellow will return 2 buttons
        this.compareButton = page.locator("button[data-original-title='Compare this Product']")//.nth(0);
        this.tooltip = page.locator(".tooltip-inner");
        this.relatedProducts = page.locator("div.product-thumb.transition");
        this.productComparisonLink = page.getByRole('link', { name: 'product comparison' })

    }


    async isOnProductPage(): Promise<string> {

        return await this.pageHeader.innerText() ?? ''

    }

    async addProductButtons(): Promise<boolean> {

        const addButtons = await this.addToCartButton.all();

        for (const addButton of addButtons) {
            if (!addButton.isEnabled()) return false;
        }
        return true
    }


    async wishListButtons(): Promise<boolean> {

        const wishlistButtons = await this.wishlistButton.all();

        for (const wishList of wishlistButtons) {
            if (!wishList.isEnabled()) return false;
        }
        return true
    }

    async compareButtons(): Promise<boolean> {

        const compareButton = await this.compareButton.all();

        for (const copareButton of compareButton) {
            if (!copareButton.isEnabled()) return false;
        }
        return true
    }

    async compareButtonRelatedProductsTooltip(): Promise<string> {

        const count = await this.relatedProducts.count();

        for (let i = 0; i < count; i++) {

            await this.relatedProducts.nth(i).locator(this.compareButton).hover();
            const tooltip = this.tooltip.filter({ hasText: "Compare this Product" });
            await tooltip.waitFor({ state: "visible", timeout: 5000 });
            const text = await tooltip.textContent() ?? '';
            return text
        }
        return ''
    }

    async addAllRelatedProductsToCompare(): Promise<string[]> {

        const counts = await this.relatedProducts.count();
        const successMessages: string[] = [];

        for (let i = 0; i < counts; i++) {

            const name = await this.relatedProducts.nth(i).locator('div>h4>a').textContent();
            const cleanName = name?.trim();
            

            await this.relatedProducts.nth(i).locator(this.compareButton).click();

            const successMsg = this.page.locator('div.alert-success').filter({ hasText: cleanName });
            await successMsg.waitFor({ state: "visible", timeout: 5000 });

            const text = await successMsg.textContent() ?? '';
            successMessages.push(text);

        }
        return successMessages
    }

async clickOnProductCOmparisonLink():Promise<ProductComparisonPage>{

    await this.productComparisonLink.click();
    return new ProductComparisonPage(this.page);
}


}