import { Page, Locator, expect } from "@playwright/test";

export class SiteMap {

    private readonly page: Page;


    constructor(page: Page) {

        this.page = page;

    }

    async isOnSiteMap(): Promise<string> {
        return this.page.title()
    }

}