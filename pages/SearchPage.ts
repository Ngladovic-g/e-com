import { Page, expect, Locator } from "@playwright/test";

export class SearchPage {

    private readonly page: Page;
    private readonly productCount: Locator;
    private readonly productHeader: Locator;
    private readonly noProductMsg: Locator;
    private readonly searchKeywordInputField: Locator;
    private readonly keySearchButton: Locator;
    private readonly productDescriptionCheckbox: Locator;
    private readonly categoryDropdown: Locator;
    private readonly openDropdown: Locator;
    private readonly subcategoryCheck: Locator;
    private readonly listView: Locator;
    private readonly listLayover: Locator;


    constructor(page: Page) {

        this.page = page;
        this.productCount = page.locator("div.product-layout");
        this.productHeader = page.locator("h4>a");
        this.noProductMsg = page.getByText('There is no product that matches the search criteria.', { exact: true });
        this.searchKeywordInputField = page.locator("#input-search");
        this.keySearchButton = page.locator("#button-search");
        this.productDescriptionCheckbox = page.locator("#description");
        this.openDropdown = page.locator("select[name='category_id']")
        this.categoryDropdown = page.locator("select[class='form-control']>option");
        this.subcategoryCheck = page.locator("input[name='sub_category']");
        this.listView = page.locator("#list-view")
        this.listLayover = page.locator(".product-list")
    }


    async isOnSearchPage(): Promise<boolean> {
        await this.page.title();
        return true

    }

    async resultProduct(): Promise<number> {

        return await this.productCount.count()

    }

    async clearSearchCriteria(): Promise<string> {
        await this.searchKeywordInputField.clear();
        return await this.searchKeywordInputField.inputValue();
    }

    async getSearchCriteriaAttribut(): Promise<string> {

        return await this.searchKeywordInputField.getAttribute('placeholder') ?? '';
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

    async buttonKeywordSearch(): Promise<void> {

        await this.keySearchButton.click();

    }

    async keywordInputField(product: string): Promise<string> {

        await this.searchKeywordInputField.fill(product);
        return this.searchKeywordInputField.inputValue();

    }

    async tickCheckbox(): Promise<Locator> {

        const checkbox = await this.productDescriptionCheckbox.isChecked();

        if (!checkbox) {

            await this.productDescriptionCheckbox.check()

        }
        return this.productDescriptionCheckbox;
    }

    async subCheck(): Promise<Locator> {

        const checkbox = await this.subcategoryCheck.isChecked();

        if (!checkbox) {

            await this.subcategoryCheck.check()

        }
        return this.subcategoryCheck;
    }

    async selectCategory(category: string): Promise<string> {


        const options = await this.categoryDropdown.all();

        for (const option of options) {
            const text = await option.textContent();
            const cleanText = text?.replace(/\u00A0/g, '').trim();


            if (cleanText === category) {
                const value = await option.getAttribute('value')
                await this.openDropdown.selectOption({ value: value! });
                return cleanText
            }
        }
        return ``;

    }



}
