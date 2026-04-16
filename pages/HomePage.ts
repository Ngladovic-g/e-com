import { Locator, Page } from "@playwright/test";
import { SearchPage } from "./SearchPage";
import { ProductComparisonPage } from "./ProductComparisonPage";


export class HomePage {
    private readonly page: Page;
    private readonly featuredProducts: Locator
    private readonly featureProductsCompareButtons: Locator;
    private readonly featureProductsWishlistButtons: Locator;
    private readonly tooltip: Locator;
    private readonly featureProductsNames: Locator;
    private readonly productAddedToCompareMessage: Locator;
    private readonly productComparisonLink: Locator;



    constructor(page: Page) {
        this.page = page;
        this.featuredProducts = page.locator("div.product-layout");
        //returns all compare buttons from feature product section
        this.featureProductsCompareButtons = page.locator("button[data-original-title='Compare this Product']")
        //retuns all wishlist buttons from feature product section
        this.featureProductsWishlistButtons = page.locator("button[data-original-title='Add to Wish List']")
        this.tooltip = page.locator('.tooltip-inner');
        this.featureProductsNames = page.locator("div.caption>h4>a");
        this.productAddedToCompareMessage = page.locator("div.alert.alert-success.alert-dismissible");
        this.productComparisonLink = page.getByRole("link", { name: "product comparison" });


    }


    async isOnHomePage(): Promise<boolean> {
        let title: string = await this.page.title();
        if (title) {
            return true;
        }
        return false;
    }


    async reopen(): Promise<Page> {
        const url = this.page.url();
        const context = this.page.context();

        await this.page.close();

        const newPage = await context.newPage();
        await newPage.goto(url);

        return newPage;
    }

    async pageUrl(): Promise<string> {

        return this.page.url();

    }

    async compareButtonFeatureProductsTooltip(): Promise<string[]> {

        const count = await this.featuredProducts.count();
        const tooltips: string[] = [];

        for (let i = 0; i < count; i++) {

            await this.featuredProducts.nth(i).locator(this.featureProductsCompareButtons).hover();
            const tooltip = this.tooltip.filter({ hasText: "Compare this Product" }).first();
            await tooltip.waitFor({ state: "visible", timeout: 5000 });
            const text = await tooltip.textContent() ?? ''
            tooltips.push(text)

        }
        return tooltips;
    }

    async addProductToComparePage(...values: string[]): Promise<void> {

        const count = await this.featuredProducts.count();


        for (const value of values) {
            for (let i = 0; i < count; i++) {

                const name = await this.featuredProducts.nth(i).locator(this.featureProductsNames).textContent();
                const cleanName = name?.trim() ?? '';
                
                 if (cleanName === value){
                    await this.featuredProducts.nth(i).locator(this.featureProductsCompareButtons).click();
                    break;
            }
        }
        }
       
    }

    async productAddedToCompareMsg():Promise<boolean>{

         await this.productAddedToCompareMessage.isVisible();
         return true;
    }

    async goToProductComparisonPage(): Promise<ProductComparisonPage> {

        await this.productComparisonLink.click();
        return new ProductComparisonPage(this.page);

    }
}

