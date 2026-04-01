import { Page, expect, Locator } from "@playwright/test";

export class SearchPage {

    private readonly page: Page;
    private readonly productCount: Locator;
    private readonly productHeader: Locator;
    private readonly noProductMsg: Locator;
    private readonly searchCriteriaInputField: Locator;



    constructor(page: Page) {

        this.page = page;
        this.productCount = page.locator("div.product-layout");
        this.productHeader = page.locator("h4>a");
        this.noProductMsg = page.getByText('There is no product that matches the search criteria.', { exact: true });
        this.searchCriteriaInputField = page.locator("#input-search");

    }


    async isOnSearchPage(): Promise<boolean> {
        await this.page.title();
        return true

    }

    async resultProduct(): Promise<number> {

        return await this.productCount.count()

    }

    async clearSearchCriteria():Promise<string>{
        await this.searchCriteriaInputField.clear();
        return await this.searchCriteriaInputField.inputValue();
    }

    async getSearchCriteriaAttribut():Promise<string>{
        
        return await this.searchCriteriaInputField.getAttribute('placeholder') ?? '';
    }

    async productTitle(product: string): Promise<string[]> {

        const count = await this.productHeader.count();
        const matches: string[] = [];

        for (let i = 0; i < count; i++) {

            const list = this.productHeader.nth(i);
            const name = await list.textContent();

            if (name?.toLowerCase().includes(product.toLowerCase())) {

                matches.push(name.trim())


            }
            if (matches.length === 0)
                throw new Error(`Product containing "${product}" not found`)

        }
        return matches;

    }

    async noProductAvailableMsg(): Promise<boolean> {

        return await this.noProductMsg.isVisible();

    }



}
