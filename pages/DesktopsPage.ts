
import { Locator, Page, expect } from "@playwright/test";
import { ProductDisplaypage } from "./ProductDisplayPage";


export class DesktopsPage {

    private readonly page: Page;
    private readonly desktopsTitle: Locator;
    private readonly listView: Locator;
    private readonly gridView: Locator;
    private readonly productCount: Locator;
    private readonly compareButton: Locator;
    private readonly wishlistButton: Locator;
    private readonly addToCart: Locator;
    private readonly productName: Locator;
    private readonly productComparisonLink: Locator;
    
    private readonly tooltip: Locator;


    constructor(page: Page) {
        this.page = page;
        this.desktopsTitle = page.locator("#content>h2");
        this.listView = page.locator("#list-view");
        this.gridView = page.locator("#grid-view");
        this.productCount = page.locator(".product-layout")
        this.compareButton = page.locator("button[data-original-title='Compare this Product']");
        //returns all compare buttons from page
        this.wishlistButton = page.locator("button[data-original-title='Add to Wish List']")
        //returns all add to wish list buttons
        this.addToCart = page.locator('span:has-text("Add to Cart")');
        //retunrs all addToCart buttons from page
        this.productName = page.locator("div.product-thumb h4 a");
        //returns all product names from page
        this.productComparisonLink = page.locator("a:has-text('product comparison')");
        
        this.tooltip = page.locator('.tooltip-inner');

    }


    async isOnDesktopsPage(): Promise<string> {

        return await this.desktopsTitle.innerHTML() ?? ''
    }


    async selectView(value: string): Promise<string> {

        if (value === "List") {
            await this.listView.click();
            return await this.listView.getAttribute('class') ?? ''
        }
        else {
            await this.gridView.click();
            return await this.gridView.getAttribute('class') ?? ''
        }
    }


    async addProductToCompare(value: string): Promise<boolean> {

        const counts = await this.productCount.count();


        for (let i = 0; i < counts; i++) {

            const name = await this.productCount.nth(i).locator(this.productName).textContent();

            const cleanText = name?.trim();


            if (value === cleanText) {

                await this.productCount.nth(i).locator(this.compareButton).click();
                const successMsg = this.page.getByText(`Success: You have added ${value} to your product comparison! ×`, { exact: true });
                await successMsg.waitFor({ state: "visible", timeout: 5000 })
                return await successMsg.isVisible();


            }
        }
        return false
    }


    async clickOnProductComparisonLink(): Promise<ProductDisplaypage> {

        await this.productComparisonLink.click();
        return new ProductDisplaypage(this.page);
    }

    

    async hoverTooltipPresent(value?: string): Promise<string[]> {

        const results: string[] = [];

        if (value === `compare`) {

            const compareButtons = await this.compareButton.count();

            for (let i = 0; i < compareButtons; i++) {
                await this.compareButton.nth(i).hover();
                const tooltip = this.tooltip.filter({ hasText: "Compare this Product" }).first();
                await tooltip.waitFor({ state: "visible", timeout: 5000 });
                const text = await tooltip.textContent() ?? '';
                results.push(text);

            }
        }else{

            const wishButtons = await this.wishlistButton.count();

            for(let i = 0; i < wishButtons; i++){

                await this.wishlistButton.nth(i).hover();

                const tooltip = this.tooltip.filter({hasText: "Add to Wish List"}).first();
                await tooltip.waitFor({state: "visible", timeout:5000});
                const text = await tooltip.textContent() ?? '';
                results.push(text);

            }
        }
        return results;
    }

    async numberOfProductsOnPage():Promise<number>{

       return await this.productCount.count();
    }
   
}
    


