import { Page, Locator, expect } from "@playwright/test";
import { HomePage } from "./HomePage";
import { ShoppinCartPage } from "./ShoppingCartPage";

export class ProductComparisonPage {

    private readonly page: Page;
    private readonly pageTitle: Locator;
    private readonly productTitles: Locator;
    private readonly productNotchosenforCompare: Locator;
    private readonly productsRemoveButtons: Locator;
    private readonly addToCartButtons: Locator;
    private readonly continueButton: Locator;
    private readonly breadcrumb: Locator;
    private readonly linkToShopingCart: Locator;
    



    constructor(page: Page) {

        this.page = page;
        this.pageTitle = page.locator("#content>h1");
        this.productTitles = page.locator("tr>td>a>strong");
        this.productNotchosenforCompare = page.locator("#content>p:has-text('You have not chosen any products to compare.')")
        this.productsRemoveButtons = page.locator("a.btn.btn-danger.btn-block")
        this.addToCartButtons = page.locator("input[value='Add to Cart']");
        this.continueButton = page.locator("div.pull-right>a.btn.btn-default");
        this.breadcrumb = page.locator(".breadcrumb a:has-text('Product Comparison')")
        this.linkToShopingCart = page.locator("a:has-text('shopping cart')");
        


    }


    async isOnComparisonPage(): Promise<string> {

        return await this.pageTitle.innerText() ?? '';

    }

    async validateProductTitle(...values: string[]): Promise<boolean> {

        const titles = await this.productTitles.all();


        const cleanTitles = await Promise.all(
            titles.map(async title => (await title.textContent())?.trim())
        );

        return values.every(value => cleanTitles.includes(value));
    }

    async removedProductsFromPage(): Promise<string> {

        const buttons = await this.productsRemoveButtons.count();

        for (let i = 0; i < buttons; i++) {

            const button = this.productsRemoveButtons.nth(0);
            button.waitFor({ timeout: 3000 })
            await button.click();
        }
        return await this.productNotchosenforCompare.innerText() ?? '';
    }

    async noProductSelectedForCompare(): Promise<string> {

        return await this.productNotchosenforCompare.innerText() ?? '';
    }

    async clickOnContinueButton(): Promise<HomePage> {

        await this.continueButton.click();
        return new HomePage(this.page);
    }

    async breadcrumbPresent(): Promise<string> {

        return await this.breadcrumb.innerText() ?? ''
    }

    async clickOnProductComparisonBreadcrumb(): Promise<string> {

        await this.breadcrumb.click();
        return await this.breadcrumb.innerText() ?? ''
    }

    async numberOfProductsOnPage(): Promise<number> {
        return await this.productTitles.count();
    }

    async addToCartButtonVisible(): Promise<boolean> {

        const count = await this.addToCartButtons.count();


        for (let i = 0; i < count; i++) {

            const isVisible = await this.addToCartButtons.nth(i).isVisible();

            if (!isVisible) return false
        }
        return count > 0
    }

    async removeButtonVisible(): Promise<boolean> {

        const count = await this.productsRemoveButtons.count();

        for (let i = 0; i < count; i++) {

            const isVisible = await this.productsRemoveButtons.nth(i).isVisible();
            if (!isVisible) return false

        }
        return count > 0
    }

    async addToCartForProducts(...productNames: string[]): Promise<void> {
        
        const count = await this.productTitles.count();

        for (const productName of productNames) {
            let found = false;

            for (let i = 0; i < count; i++) {
                const title = await this.productTitles.nth(i).textContent();

                if (title?.trim() === productName) {
                    const addToCartButton = this.page.locator(
                        `tbody tr td:nth-child(${i + 2}) input[value='Add to Cart']`
                    );
                    await addToCartButton.click();
                    found = true;
                    break;
                }
            }

            if (!found) throw new Error(`Product "${productName}" not found on comparison page`);
        }
    }


    async shopingCartLink():Promise<ShoppinCartPage>{

        await this.linkToShopingCart.click();
        return new ShoppinCartPage(this.page)
    }

    
}