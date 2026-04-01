import { Locator, Page } from "@playwright/test";
import { SearchPage } from "./SearchPage";


export class HomePage {
    private readonly page: Page;
    


    constructor(page: Page) {
        this.page = page;
        


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

}

