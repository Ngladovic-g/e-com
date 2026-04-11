import { Page, Locator, expect } from "@playwright/test";

export class ProductComparisonPage {

    private readonly page: Page;
    private readonly pageTitle: Locator;
    private readonly productTitles: Locator;

    constructor(page: Page) {

        this.page = page;
        this.pageTitle = page.locator("#content>h1");
        this.productTitles = page.locator("tr>td>a>strong");

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

}