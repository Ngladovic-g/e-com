import { Locator, expect, Page } from "@playwright/test";
import { SiteMap } from "./SiteMap";

export class FooterPage{

    private readonly page: Page;
    private readonly siteMap: Locator;

    constructor(page:Page){

        this.page = page;
        this.siteMap = page.locator("li>a:has-text('Site Map')");
    }


    async clickOnSiteMap():Promise<SiteMap>{

        await this.siteMap.click();
        return new SiteMap(this.page);
    }
}