import { Page, Locator, expect } from "@playwright/test";
import { SearchPage } from "./SearchPage";

export class SiteMap {

    private readonly page: Page;
    private readonly searchLink: Locator;


    constructor(page: Page) {

        this.page = page;
        this.searchLink = page.locator("li>a:has-text('Search')");

    }

    async isOnSiteMap(): Promise<string> {
        return this.page.title()
    }

    async clickOnSearchLink():Promise<SearchPage>{

        await this.searchLink.click()
        return new SearchPage(this.page);

    }
}